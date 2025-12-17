import os
import uvicorn
import psycopg2
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from qdrant_client import QdrantClient
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
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
NEON_DB_URL = os.getenv("NEON_DB_URL")  # Ensure this is in your .env file!

# 2. Initialize Clients
qdrant_client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
embedding_model = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
chat_model = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.3)


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

# 5. Request Model (Updated to include session_id)
class ChatRequest(BaseModel):
    question: str
    session_id: str  # Unique ID for the user session

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

@app.get("/")
async def root():
    return {"status": "ok", "message": "Physical AI Brain is running with Memory and Authentication!"}


@app.get("/health")
async def health_check():
    """Health check endpoint for deployment monitoring."""
    return {
        "status": "healthy",
        "version": "2.0.0",
        "features": ["chatbot", "authentication", "rag"]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)