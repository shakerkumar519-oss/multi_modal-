import chromadb
from chromadb.utils import embedding_functions

# Initialize ChromaDB client
client = chromadb.PersistentClient(path="./chroma_db")

# Get or create collection for PDF documents
collection = client.get_or_create_collection(name="pdf_documents")

def add_documents(documents, embeddings, ids, user_id=None):
    """
    Add documents to the vector store with optional user_id metadata
    """
    metadatas = [{"user_id": str(user_id)} if user_id else {} for _ in documents]
    collection.add(
        documents=documents,
        embeddings=embeddings.tolist(),
        ids=ids,
        metadatas=metadatas
    )

def search(query_embeddings, user_id=None, n_results=5):
    """
    Search for documents, optionally filtered by user_id
    """
    where_clause = {"user_id": str(user_id)} if user_id else None

    results = collection.query(
        query_embeddings=[query_embeddings.tolist()],
        n_results=n_results,
        where=where_clause
    )
    return results

def get_user_document_count(user_id):
    """
    Get count of documents for a specific user
    """
    results = collection.get(
        where={"user_id": str(user_id)}
    )
    return len(results['ids']) if results['ids'] else 0