# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development Setup
- Install backend dependencies: `pip install -r requirement.txt`
- Install frontend dependencies: `cd frontend && npm install`
- Environment variables: Ensure `.env` file contains `GROQ_APIKEY` and `HF_TOKEN`

### Running the Application
- Both servers are typically already running in the background
- Backend (FastAPI): `cd backend/rag && python main.py` (runs on http://localhost:8000)
- Frontend (React/Vite): `cd frontend && npm run dev` (runs on http://localhost:5173)

### Testing Endpoints
- Health check: `curl http://localhost:8000/health`
- Chat: `curl -X POST http://localhost:8000/chat -H "Content-Type: application/json" -d '{"message": "hello"}'`
- PDF upload: `curl -X POST http://localhost:8000/pdf/upload -F "file=@document.pdf"`
- Image analysis: `curl -X POST http://localhost:8000/image/analyze -F "file=@image.jpg" -F "question=What is in this image?"`
- Voice transcription: `curl -X POST http://localhost:8000/voice/transcribe -F "file=@audio.wav"`
- Image generation: `curl -X POST http://localhost:8000/image/generate -H "Content-Type: application/json" -d '{"message": "a beautiful sunset"}'`
- PDF chat: `curl -X POST http://localhost:8000/pdf/chat -H "Content-Type: application/json" -d '{"message": "What is this PDF about?"}'`

### Stopping Servers
- To stop background processes: `taskkill /F /IM python.exe` and `taskkill /F /IM node.exe`
- Or close the terminal windows where servers are running

## Architecture

### High-Level Structure
This is a multimodal AI application with a **client-server architecture**:
- **Frontend**: React/Vite SPA providing user interface for all AI interactions
- **Backend**: FastAPI server handling all AI model interactions and business logic
- **Data Layer**: ChromaDB vector database for document storage and retrieval
- **Storage**: Local filesystem for temporary uploads (`uploads/`), generated images (`outputs/`), and persistent vector database (`chroma_db/`)

### Backend Components (`backend/` directory)
- **RAG System** (`backend/rag/`): Core retrieval-augmented generation pipeline
  - `main.py`: FastAPI application entry point with all API endpoints
  - `rag.py`: Main RAG orchestration logic
  - `pdf_loader.py`: PDF text extraction
  - `chunker.py`: Text splitting for vector storage
  - `embedd.py`: Text embedding generation
  - `vectorstore.py`: ChromaDB vector storage operations
  - `ingest.py`: Document ingestion pipeline
- **Models** (`backend/models/`): Specific AI model wrappers
  - `pdf/`: PDF processing models
  - `voice.py`, `voice2.py`: Speech-to-text models
  - `imggen.py`: Image generation models
  - `image.py`: Image analysis models

### Frontend Components (`frontend/` directory)
- **React/Vite Application**: Single-page application
- **Dependencies**: React 19, Vite, Lucide icons
- **Entry Point**: `index.html` with React rendering
- **Source Code**: Located in `frontend/src/` directory

### Key Features Implementation
1. **Text Chat**: Direct LLM interaction via Groq API
2. **PDF Processing**: Upload → Extract text → Chunk → Embed → Store in ChromaDB → Query with RAG
3. **Image Analysis**: Multimodal model processing (likely via Hugging Face)
4. **Voice Transcription**: Speech-to-text conversion
5. **Image Generation**: Text-to-image generation via Hugging Face models
6. **Text-to-Speech**: Backend endpoint for audio generation

### Data Flow
1. User interacts with frontend interface
2. Frontend makes HTTP requests to backend endpoints
3. Backend processes requests using appropriate AI models
4. For document-based queries: RAG pipeline retrieves relevant chunks from ChromaDB
5. Results returned to frontend for display

## Environment
- Python backend with FastAPI framework
- Node.js frontend with Vite build tool
- ChromaDB for vector storage
- Groq API for LLM inference
- Hugging Face for image/video/audio models