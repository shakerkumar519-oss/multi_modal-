import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from urllib.parse import urlparse

# Load environment variables from .env file
load_dotenv()  # This loads from .env in current directory or parent directories

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Check if we should use SQLite fallback for development
USE_SQLITE_FALLBACK = os.getenv("USE_SQLITE_FALLBACK", "false").lower() == "true"

if USE_SQLITE_FALLBACK or not DATABASE_URL.startswith("postgresql"):
    # Use SQLite for development/testing when PostgreSQL is not available
    SQLITE_DB_PATH = os.getenv("SQLITE_DB_PATH", "./multimodal_ai.db")
    SQLITE_DATABASE_URL = f"sqlite:///{SQLITE_DB_PATH}"
    engine = create_engine(SQLITE_DATABASE_URL, connect_args={"check_same_thread": False})
    print(f"Using SQLite database: {SQLITE_DATABASE_URL}")
else:
    # Use PostgreSQL as configured
    engine = create_engine(DATABASE_URL)
    print(f"Using PostgreSQL database: {DATABASE_URL}")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
def create_tables():
    Base.metadata.create_all(bind=engine)