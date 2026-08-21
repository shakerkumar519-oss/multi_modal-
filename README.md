# 🤖 Multimodal AI Platform

A full-stack Multimodal Artificial Intelligence application built with **React 19**, **FastAPI**, **ChromaDB**, **Groq LLM**, and **PyMuPDF**.

Supports **Text Chat**, **PDF Document RAG Q&A**, **Image Analysis**, **Voice Transcription**, **Image Generation**, and **Text-to-Speech (TTS)**.

---

## 🌟 Key Features

- 💬 **Multi-Modal AI Chat**: Fast reasoning powered by Groq (`openai/gpt-oss-120b`).
- 📄 **PDF Document RAG**: Upload PDFs to extract text, generate vector embeddings with `SentenceTransformers`, and perform semantic Q&A using **ChromaDB**.
- 🖼️ **Vision & Image Analysis**: Describe and extract insights from images.
- 🎨 **Text-to-Image Generation**: Generate high-quality visual art from text prompts.
- 🎤 **Voice Transcription & TTS**: Speech-to-text and text-to-speech audio synthesis.
- 🔐 **Authentication & SSO**: OAuth2 bearer token authentication, bcrypt password hashing, and **Google OAuth2** single sign-on.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Lucide React, Glassmorphism CSS Design Token System
- **Backend**: FastAPI (Python 3.10+), Uvicorn, Starlette Middleware
- **Vector DB & RAG**: ChromaDB, SentenceTransformers (`all-MiniLM-L6-v2`), PyMuPDF
- **LLM Engine**: Groq API
- **Database & Auth**: SQLite (with PostgreSQL support), SQLAlchemy ORM, PyJWT, Passlib, Authlib

---

## ⚡ Quick Start (Local Setup)

### 1. Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher

### 2. Clone Repository
```bash
git clone https://github.com/your-username/multimodal-ai.git
cd multimodal-ai
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
# Application Configuration
APP_NAME=multimodal-ai
APP_ENV=development

# Database configuration
USE_SQLITE_FALLBACK=true

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-minimum-32-characters
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Google OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

# AI Keys
GROQ_APIKEY=gsk_your_groq_api_key
```

### 4. Run Backend Server
```bash
# Install dependencies
pip install -r requirement.txt

# Start backend server (runs on http://127.0.0.1:8000)
python run_backend.py
```

### 5. Run Frontend Development Server
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🌐 24/7 Cloud Deployment

### 1-Click Frontend Deployment (Vercel)
1. Push code to GitHub.
2. Import repository on [Vercel.com](https://vercel.com).
3. Set root directory to `frontend`.
4. Add environment variable `VITE_API_URL` pointing to your backend URL.
5. Click **Deploy**.

### 1-Click Backend Deployment (Render.com)
1. Import repository on [Render.com](https://render.com).
2. Render automatically detects `render.yaml`.
3. Add environment variable `GROQ_APIKEY`.
4. Click **Create Web Service**.

---

## 📜 License
MIT License. Free to use and modify.
