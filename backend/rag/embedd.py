import numpy as np

_model = None

def get_model():
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _model = SentenceTransformer("all-MiniLM-L6-v2")
        except Exception as e:
            print(f"Warning: Could not load SentenceTransformer model: {e}")
            print("Using dummy embeddings for development.")
            class DummyModel:
                def encode(self, texts):
                    return np.random.rand(len(texts), 384).astype(np.float32)
            _model = DummyModel()
    return _model

def create_embeddings(texts):
    model = get_model()
    embeddings = model.encode(texts)
    return embeddings