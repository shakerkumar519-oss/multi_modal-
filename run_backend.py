import uvicorn
import sys
import os

# Ensure backend directory is in python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

if __name__ == '__main__':
    print("Starting FastAPI backend server on http://127.0.0.1:8000...")
    uvicorn.run("backend.rag.main:app", host="127.0.0.1", port=8000, reload=False)
