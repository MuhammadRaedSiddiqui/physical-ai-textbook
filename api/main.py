import os
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # <--- CRITICAL IMPORT
from pydantic import BaseModel
from qdrant_client import QdrantClient
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 1. Load Environment Variables
load_dotenv()

# 2. Configuration
COLLECTION_NAME = "physical_ai_textbook"
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# 3. Initialize Clients
qdrant_client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

embedding_model = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")

chat_model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3
)

# 4. Define the API App
app = FastAPI(title="Physical AI Textbook Chatbot")

# --- CORS MIDDLEWARE (FIXES THE 405 ERROR) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (including OPTIONS)
    allow_headers=["*"],  # Allows all headers
)
# ---------------------------------------------

class ChatRequest(BaseModel):
    question: str

rag_template = """You are an expert teaching assistant for a textbook on Physical AI and Humanoid Robotics.
Use the following pieces of retrieved context to answer the student's question.
If the answer is not in the context, say you don't know and do not make up an answer.
Keep your answer concise and educational.

Context:
{context}

Question:
{question}

Answer:"""

prompt = ChatPromptTemplate.from_template(rag_template)
output_parser = StrOutputParser()

@app.get("/")
async def root():
    return {"status": "ok", "message": "Physical AI Brain is running!"}

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        query = request.question
        print(f"Received Question: {query}")

        # A. Convert user question to vector
        query_vector = embedding_model.embed_query(query)

        # B. Search Qdrant
        search_result = qdrant_client.query_points(
            collection_name=COLLECTION_NAME,
            query=query_vector,
            limit=3
        ).points

        # C. Construct Context
        context_text = "\n\n".join([hit.payload["text"] for hit in search_result])
        
        # D. Generate Answer
        chain = prompt | chat_model | output_parser
        response = chain.invoke({
            "context": context_text,
            "question": query
        })

        return {
            "answer": response,
            "sources": [hit.payload["url"] for hit in search_result]
        }

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)