import os
import sys
import shutil
import tempfile
import json
import uuid
from pathlib import Path

# Global JSON encoder patch for UUID serialization across entire FastAPI app
_orig_json_default = json.JSONEncoder.default
def _uuid_json_default(self, obj):
    if isinstance(obj, uuid.UUID):
        return str(obj)
    return _orig_json_default(self, obj)
json.JSONEncoder.default = _uuid_json_default

# Add the backend directory to the sys.path so we can import from database and auth
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from groq import Groq
from sqlalchemy.orm import Session

from .pdf_loader import extract_pdf
from .chunker import split_text
from .embedd import create_embeddings
from .vectorstore import add_documents, search

# Import database and auth
from database import get_db, create_tables, Base
from auth.models import User, ChatHistory, UploadedFile
from auth.utils import get_current_user

load_dotenv()

GROQ_APIKEY = os.getenv("GROQ_APIKEY")
HF_TOKEN = os.getenv("HF_TOKEN")

if not GROQ_APIKEY:
    raise RuntimeError("GROQ_APIKEY is missing from your .env file")

# Import and include auth router
from auth.router import router as auth_router

client = Groq(api_key=GROQ_APIKEY)

app = FastAPI(title="Multimodal AI Backend")

# Include auth router
app.include_router(auth_router)

# Create database tables on startup
@app.on_event("startup")
async def startup_event():
    create_tables()

# Configure CORS
origins = os.getenv("BACKEND_CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
# Split by comma and strip spaces
allowed_origins = [origin.strip() for origin in origins.split(",")]

is_prod = os.getenv("APP_ENV", "development").lower() == "production" or os.getenv("RENDER") is not None

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("JWT_SECRET_KEY", "super-secret-key-change-in-production"),
    same_site="none" if is_prod else "lax",
    https_only=True if is_prod else False
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
OUTPUT_DIR = Path("outputs")
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)


class ChatRequest(BaseModel):
    message: str


def groq_chat(message: str) -> str:
    response = client.chat.completions.create(
        model=os.getenv("GROQ_MODEL", "openai/gpt-oss-120b"),
        messages=[{"role": "user", "content": message}],
    )
    return response.choices[0].message.content


@app.get("/")
def root():
    return {"status": "ok", "message": "Multimodal AI backend is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/chat")
def chat(request: ChatRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    answer = groq_chat(request.message)
    # Store chat history
    chat_entry = ChatHistory(
        user_id=current_user.id,
        message=request.message,
        response=answer
    )
    db.add(chat_entry)
    db.commit()
    return {"response": answer}


@app.post("/pdf/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    safe_name = f"{uuid.uuid4()}_{Path(file.filename).name}"
    pdf_path = UPLOAD_DIR / safe_name

    with pdf_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        text = extract_pdf(str(pdf_path))
        if not text.strip():
            raise HTTPException(status_code=400, detail="No text could be extracted from PDF")

        chunks = split_text(text)
        embeddings = create_embeddings(chunks)

        # IDs include a document prefix so multiple PDFs do not collide.
        document_id = uuid.uuid4().hex
        ids = [f"{document_id}_chunk_{i}" for i in range(len(chunks))]

        # Add documents to vector store with user_id
        add_documents(chunks, embeddings, ids, user_id=str(current_user.id))

        # Save file metadata to database
        db_file = UploadedFile(
            user_id=current_user.id,
            filename=file.filename,
            document_id=document_id
        )
        db.add(db_file)
        db.commit()

        return {
            "message": "PDF indexed successfully",
            "document_id": document_id,
            "filename": file.filename,
            "chunks": len(chunks),
        }
    finally:
        pdf_path.unlink(missing_ok=True)


@app.post("/pdf/chat")
def pdf_chat(request: ChatRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    question_embedding = create_embeddings([request.message])[0]
    # Search only the current user's documents
    results = search(question_embedding, user_id=str(current_user.id), n_results=5)
    documents = results.get("documents", [[]])[0]

    if not documents:
        return {
            "response": "I could not find any indexed PDF content. Upload a PDF first."
        }

    context = "\n\n".join(documents)

    prompt = f"""
You are a helpful assistant answering questions about uploaded PDF documents.

Use only the provided context.
If the answer cannot be found in the context, say that the information
was not found in the document.

Context:
{context}

Question:
{request.message}

Answer:
"""

    response = client.chat.completions.create(
        model=os.getenv("GROQ_MODEL", "openai/gpt-oss-120b"),
        messages=[{"role": "user", "content": prompt}],
    )

    return {"response": response.choices[0].message.content}


@app.post("/image/analyze")
async def analyze_image(
    file: UploadFile = File(...),
    question: str = Form("Describe this image."),
):
    allowed = {".jpg", ".jpeg", ".png", ".webp"}
    extension = Path(file.filename or "").suffix.lower()

    if extension not in allowed:
        raise HTTPException(status_code=400, detail="Unsupported image format")

    image_path = UPLOAD_DIR / f"{uuid.uuid4()}{extension}"

    with image_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        import base64

        mime = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".webp": "image/webp",
        }[extension]

        encoded = base64.b64encode(image_path.read_bytes()).decode("utf-8")

        messages = [{
            "role": "user",
            "content": [
                {"type": "text", "text": question},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:{mime};base64,{encoded}"
                    },
                },
            ],
        }]

        response = client.chat.completions.create(
            model="qwen/qwen3.6-27b",
            messages=messages,
        )

        return {"response": response.choices[0].message.content}
    finally:
        image_path.unlink(missing_ok=True)


@app.post("/voice/transcribe")
async def transcribe_voice(file: UploadFile = File(...)):
    extension = Path(file.filename or "").suffix.lower()
    if extension not in {".wav", ".mp3", ".m4a", ".webm", ".ogg", ".mp4"}:
        raise HTTPException(status_code=400, detail="Unsupported audio format")

    audio_path = UPLOAD_DIR / f"{uuid.uuid4()}{extension}"

    with audio_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        with audio_path.open("rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                file=audio_file,
                model="whisper-large-v3-turbo",
                response_format="text",
            )

        return {"text": str(transcription)}
    finally:
        audio_path.unlink(missing_ok=True)


@app.post("/image/generate")
def generate_image(request: ChatRequest):
    if not HF_TOKEN:
        raise HTTPException(
            status_code=500,
            detail="HF_TOKEN is missing from your .env file",
        )

    from huggingface_hub import InferenceClient

    client_hf = InferenceClient(HF_TOKEN, provider="auto")
    image = client_hf.text_to_image(
        prompt=request.message,
        model="black-forest-labs/FLUX.1-dev",
    )

    filename = f"{uuid.uuid4()}.png"
    output_path = OUTPUT_DIR / filename
    image.save(output_path)

    return {
        "filename": filename,
        "url": f"/outputs/{filename}",
    }


@app.get("/outputs/{filename}")
def get_output(filename: str):
    path = OUTPUT_DIR / Path(filename).name
    if not path.exists():
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(path, media_type="image/png")


@app.post("/tts")
def text_to_speech(request: ChatRequest):
    import pyttsx3

    filename = f"{uuid.uuid4()}.wav"
    output_path = OUTPUT_DIR / filename

    engine = pyttsx3.init()
    engine.setProperty("rate", 150)
    engine.save_to_file(request.message, str(output_path))
    engine.runAndWait()

    return {"url": f"/outputs/{filename}"}