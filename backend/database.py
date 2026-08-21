import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./multimodal_ai_v3.db")
USE_SQLITE_FALLBACK = os.getenv("USE_SQLITE_FALLBACK", "true").lower() == "true"

if USE_SQLITE_FALLBACK or not DATABASE_URL.startswith("postgresql"):
    SQLITE_DB_PATH = os.getenv("SQLITE_DB_PATH", "./multimodal_ai_v3.db")
    SQLITE_DATABASE_URL = f"sqlite:///{SQLITE_DB_PATH}"
    engine = create_engine(SQLITE_DATABASE_URL, connect_args={"check_same_thread": False})
    print(f"Using SQLite database: {SQLITE_DATABASE_URL}")
else:
    engine = create_engine(DATABASE_URL)
    print(f"Using PostgreSQL database: {DATABASE_URL}")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    Base.metadata.create_all(bind=engine)