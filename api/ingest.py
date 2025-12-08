import os
import glob
from dotenv import load_dotenv
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings # <--- CHANGED
from qdrant_client import QdrantClient
from qdrant_client.http import models

# Load secrets
load_dotenv()

# Configuration
DOCS_DIR = "../docs"
COLLECTION_NAME = "physical_ai_textbook"

def ingest_docs():
    print("🚀 Starting ingestion with Google Gemini...")

    # 1. Initialize Clients
    qdrant = QdrantClient(
        url=os.getenv("QDRANT_URL"),
        api_key=os.getenv("QDRANT_API_KEY")
    )
    
    # 2. Initialize Google Embeddings
    # "models/text-embedding-004" is the latest stable embedding model from Google
    embeddings_model = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004") 

    # 3. Re-create Collection in Qdrant
    # Google's text-embedding-004 has 768 dimensions (OpenAI was 1536)
    qdrant.recreate_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=models.VectorParams(
            size=768,  # <--- CRITICAL CHANGE for Gemini
            distance=models.Distance.COSINE
        )
    )
    print(f"📦 Collection '{COLLECTION_NAME}' created.")

    # 4. Read and Split Files
    files = glob.glob(f"{DOCS_DIR}/**/*.md", recursive=True)
    print(f"fq Found {len(files)} markdown files.")

    documents = []
    for file_path in files:
        try:
            loader = TextLoader(file_path, encoding='utf-8')
            docs = loader.load()
            
            # Clean up metadata
            relative_path = os.path.relpath(file_path, DOCS_DIR)
            url_path = f"/docs/{relative_path.replace('.md', '').replace(os.sep, '/')}"
            
            for doc in docs:
                doc.metadata["source"] = file_path
                doc.metadata["url"] = url_path
                documents.extend(docs)
        except Exception as e:
            print(f"⚠️ Error loading {file_path}: {e}")

    # Split text
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_documents(documents)
    print(f"🧩 Generated {len(chunks)} chunks.")

    # 5. Embed and Upsert
    batch_size = 100
    total_batches = (len(chunks) // batch_size) + 1

    for i in range(0, len(chunks), batch_size):
        batch = chunks[i : i + batch_size]
        print(f"Processing batch {i // batch_size + 1}/{total_batches}...")
        
        texts = [doc.page_content for doc in batch]
        metadatas = [doc.metadata for doc in batch]
        
        # Generate Embeddings using Google
        embedded_vectors = embeddings_model.embed_documents(texts)
        
        points = [
            models.PointStruct(
                id=i + idx,
                vector=vector,
                payload={
                    "text": text,
                    "url": meta["url"],
                    "source": meta["source"]
                }
            )
            for idx, (text, vector, meta) in enumerate(zip(texts, embedded_vectors, metadatas))
        ]

        qdrant.upsert(
            collection_name=COLLECTION_NAME,
            points=points
        )

    print("✅ Ingestion Complete!")

if __name__ == "__main__":
    ingest_docs()