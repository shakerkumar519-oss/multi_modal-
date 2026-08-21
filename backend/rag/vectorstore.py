try:
    import chromadb
    client = chromadb.Client()
    collection = client.get_or_create_collection(name="multimodal_rag")
    _has_chroma = True
except Exception as e:
    print(f"Warning: Could not initialize ChromaDB ({e}). Using in-memory fallback vectorstore.")
    _has_chroma = False

class MemoryVectorStore:
    def __init__(self):
        self.docs = []
    def add(self, documents, ids):
        for doc_id, doc in zip(ids, documents):
            self.docs.append({"id": doc_id, "text": doc})
    def query(self, query_texts, n_results=3):
        res_texts = [d["text"] for d in self.docs[:n_results]]
        return {"documents": [res_texts]}

_memory_store = MemoryVectorStore()

def add_documents(documents, ids):
    if _has_chroma:
        try:
            collection.add(documents=documents, ids=ids)
        except Exception:
            _memory_store.add(documents, ids)
    else:
        _memory_store.add(documents, ids)

def search(query_text, n_results=3):
    if _has_chroma:
        try:
            results = collection.query(query_texts=[query_text], n_results=n_results)
            return results['documents'][0]
        except Exception:
            return _memory_store.query([query_text], n_results=n_results)['documents'][0]
    else:
        return _memory_store.query([query_text], n_results=n_results)['documents'][0]