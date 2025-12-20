import os
import time
import json
import re
import uvicorn
import psycopg2
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from qdrant_client import QdrantClient
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Import authentication module
from auth import auth_router, create_db_and_tables

# 1. Load Environment Variables
load_dotenv()

COLLECTION_NAME = "physical_ai_textbook"
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
NEON_DB_URL = os.getenv("NEON_DB_URL")

# 2. Initialize Clients
qdrant_client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
embedding_model = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
# Using Groq for fast LLM inference (30 req/min free tier)
chat_model = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.3,
    api_key=GROQ_API_KEY
)


# Helper: Invoke with retry for rate limits
def invoke_with_retry(chain, params, max_retries=3):
    """Invoke a chain with exponential backoff for rate limit errors."""
    for attempt in range(max_retries):
        try:
            return chain.invoke(params)
        except Exception as e:
            error_str = str(e)
            if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                wait_time = (2 ** attempt) * 5  # 5s, 10s, 20s
                print(f"Rate limited, waiting {wait_time}s before retry {attempt + 1}/{max_retries}")
                time.sleep(wait_time)
                if attempt == max_retries - 1:
                    raise HTTPException(
                        status_code=429,
                        detail=f"API rate limit exceeded. Please try again in {wait_time} seconds."
                    )
            else:
                raise e
    raise HTTPException(status_code=500, detail="Max retries exceeded")


# 3. Lifespan context manager for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events."""
    # Startup: Create authentication tables
    print("Creating authentication database tables...")
    await create_db_and_tables()
    print("Authentication tables ready!")
    yield
    # Shutdown: Cleanup (if needed)
    print("Shutting down...")


app = FastAPI(
    title="Physical AI Textbook API",
    description="API for Physical AI & Humanoid Robotics Textbook with RAG chatbot and authentication",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include authentication router
app.include_router(auth_router, prefix="/api")

# 4. Database Functions (for chat history - legacy sync)
def get_db_connection():
    return psycopg2.connect(NEON_DB_URL)

def get_chat_history(session_id: str, limit=5):
    """Fetch the last N messages for context"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        # Fetch recent messages
        cur.execute("""
            SELECT role, content FROM chat_history
            WHERE session_id = %s
            ORDER BY created_at DESC
            LIMIT %s
        """, (session_id, limit))
        rows = cur.fetchall()
        conn.close()

        # Reverse to chronological order (oldest -> newest) for the AI
        history = rows[::-1]
        formatted_history = "\n".join([f"{role.capitalize()}: {content}" for role, content in history])
        return formatted_history
    except Exception as e:
        print(f"DB Error (Get History): {e}")
        return ""

def save_message(session_id: str, role: str, content: str):
    """Save a message to Neon"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO chat_history (session_id, role, content) VALUES (%s, %s, %s)",
            (session_id, role, content)
        )
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"DB Error (Save Message): {e}")

# 5. Request Models
class ChatRequest(BaseModel):
    question: str
    session_id: str  # Unique ID for the user session


class TranslateRequest(BaseModel):
    text: str
    target_language: str = "Urdu"


class PersonalizeRequest(BaseModel):
    text: str
    user_context: str


class QuizRequest(BaseModel):
    topic: str
    context: str = ""

# 6. Updated Prompt Template with History
rag_template = """You are an expert teaching assistant for a textbook on Physical AI and Humanoid Robotics.
Use the retrieved context and chat history to answer the question.
If the answer is not in the context, say you don't know.

Context:
{context}

Chat History:
{chat_history}

Current Question:
{question}

Answer:"""

prompt = ChatPromptTemplate.from_template(rag_template)
output_parser = StrOutputParser()

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        query = request.question
        session_id = request.session_id
        print(f"Question from {session_id}: {query}")

        # A. Embed Question
        query_vector = embedding_model.embed_query(query)

        # B. Search Qdrant
        search_result = qdrant_client.query_points(
            collection_name=COLLECTION_NAME,
            query=query_vector,
            limit=3
        ).points

        context_text = "\n\n".join([hit.payload["text"] for hit in search_result])

        # C. Get History from Neon
        history_text = get_chat_history(session_id)

        # D. Generate Answer
        chain = prompt | chat_model | output_parser
        response = chain.invoke({
            "context": context_text,
            "chat_history": history_text,
            "question": query
        })

        # E. Save Conversation to Neon (Async in production, sync here for simplicity)
        save_message(session_id, "user", query)
        save_message(session_id, "bot", response)

        return {
            "answer": response,
            "sources": [hit.payload["url"] for hit in search_result]
        }

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# 7. Translate Endpoint
@app.post("/translate")
async def translate_endpoint(request: TranslateRequest):
    """Translate text to the target language (default: Urdu)."""
    try:
        translate_prompt = ChatPromptTemplate.from_template(
            """Translate the following technical documentation into professional {target_language}.
Maintain all technical terms (like ROS 2, Nodes, VLA, SLAM, LiDAR, etc.) in English.
Keep the formatting and structure similar to the original.

Text to translate:
{text}

Translation:"""
        )

        chain = translate_prompt | chat_model | output_parser
        translation = invoke_with_retry(chain, {
            "text": request.text,
            "target_language": request.target_language
        })

        return {
            "original": request.text,
            "translated": translation,
            "target_language": request.target_language
        }
    except Exception as e:
        print(f"Translation Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# 7b. Batch Translation Endpoint (for faster page translation)
class BatchTranslateRequest(BaseModel):
    texts: list[str]
    target_language: str = "Urdu"


@app.post("/translate/batch")
async def batch_translate_endpoint(request: BatchTranslateRequest):
    """Translate multiple texts in a single request for better performance."""
    try:
        # Join texts with a unique separator
        separator = "\n---SECTION_BREAK---\n"
        combined_text = separator.join(request.texts)

        translate_prompt = ChatPromptTemplate.from_template(
            """Translate each section of the following technical documentation into professional {target_language}.
Maintain all technical terms (like ROS 2, Nodes, VLA, SLAM, LiDAR, sensors, actuators) in English.
Keep sections separated by exactly "---SECTION_BREAK---" (preserve this separator in output).
Keep the translation accurate, clear, and professional.

Sections to translate:
{text}

Translated sections:"""
        )

        chain = translate_prompt | chat_model | output_parser
        translated_combined = invoke_with_retry(chain, {
            "text": combined_text,
            "target_language": request.target_language
        })

        # Split back into individual translations
        translated_texts = translated_combined.split("---SECTION_BREAK---")
        translated_texts = [t.strip() for t in translated_texts]

        # Ensure we have the same number of translations as inputs
        while len(translated_texts) < len(request.texts):
            translated_texts.append(request.texts[len(translated_texts)])

        return {
            "translations": translated_texts[:len(request.texts)],
            "target_language": request.target_language
        }
    except Exception as e:
        print(f"Batch Translation Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# 8. Personalize Endpoint
@app.post("/personalize")
async def personalize_endpoint(request: PersonalizeRequest):
    """Personalize content based on user's background."""
    try:
        personalize_prompt = ChatPromptTemplate.from_template(
            """You are a personalized tutor for a Physical AI and Humanoid Robotics textbook.
Rewrite the following introduction/summary to be specifically relevant for a student with this background.
Keep it concise, motivating, and highlight connections to their experience.

Student Background:
{user_context}

Content to Personalize:
{text}

Personalized Version:"""
        )

        chain = personalize_prompt | chat_model | output_parser
        personalized = invoke_with_retry(chain, {
            "text": request.text,
            "user_context": request.user_context
        })

        return {
            "original": request.text,
            "personalized": personalized,
            "user_context": request.user_context
        }
    except Exception as e:
        print(f"Personalization Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# 9. Quiz Generation Endpoint
@app.post("/quiz")
async def quiz_endpoint(request: QuizRequest):
    """Generate a 3-question multiple choice quiz on a given topic."""
    try:
        quiz_prompt = ChatPromptTemplate.from_template(
            """You are a Robotics Professor creating an assessment quiz for students studying Physical AI and Humanoid Robotics.

Generate a 3-question Multiple Choice Quiz about: {topic}

{context_section}

IMPORTANT: You MUST return ONLY a raw JSON array with NO markdown formatting, NO code blocks, NO backticks.
Return EXACTLY this structure (replace the example content with actual quiz questions):

[
  {{
    "question": "Your first question here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_index": 0,
    "explanation": "Brief explanation of why this answer is correct."
  }},
  {{
    "question": "Your second question here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_index": 1,
    "explanation": "Brief explanation of why this answer is correct."
  }},
  {{
    "question": "Your third question here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_index": 2,
    "explanation": "Brief explanation of why this answer is correct."
  }}
]

Rules:
- Each question should test understanding, not just memorization
- Options should be plausible but only one correct
- correct_index is 0-based (0 for first option, 1 for second, etc.)
- Explanations should be educational and concise
- Return ONLY the JSON array, nothing else"""
        )

        # Build context section if provided
        context_section = ""
        if request.context:
            context_section = f"Use this context to generate relevant questions:\n{request.context}"

        chain = quiz_prompt | chat_model | output_parser
        raw_response = invoke_with_retry(chain, {
            "topic": request.topic,
            "context_section": context_section
        })

        # Clean the response - remove markdown code blocks if present
        cleaned_response = raw_response.strip()

        # Remove ```json and ``` wrappers
        cleaned_response = re.sub(r'^```json\s*', '', cleaned_response)
        cleaned_response = re.sub(r'^```\s*', '', cleaned_response)
        cleaned_response = re.sub(r'\s*```$', '', cleaned_response)
        cleaned_response = cleaned_response.strip()

        # Parse JSON
        try:
            quiz_data = json.loads(cleaned_response)
        except json.JSONDecodeError as json_err:
            print(f"JSON Parse Error: {json_err}")
            print(f"Raw response: {raw_response}")
            raise HTTPException(
                status_code=500,
                detail="Failed to parse quiz data from AI response"
            )

        # Validate quiz structure
        if not isinstance(quiz_data, list) or len(quiz_data) == 0:
            raise HTTPException(
                status_code=500,
                detail="Invalid quiz format: expected non-empty array"
            )

        for i, q in enumerate(quiz_data):
            if not all(key in q for key in ["question", "options", "correct_index", "explanation"]):
                raise HTTPException(
                    status_code=500,
                    detail=f"Question {i+1} missing required fields"
                )
            if not isinstance(q["options"], list) or len(q["options"]) != 4:
                raise HTTPException(
                    status_code=500,
                    detail=f"Question {i+1} must have exactly 4 options"
                )

        return {"quiz": quiz_data}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Quiz Generation Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
async def root():
    return {"status": "ok", "message": "Physical AI Brain is running with Memory and Authentication!"}


@app.get("/health")
async def health_check():
    """Health check endpoint for deployment monitoring."""
    return {
        "status": "healthy",
        "version": "2.0.0",
        "features": ["chatbot", "authentication", "rag", "translate", "personalize", "quiz"]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
