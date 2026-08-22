import os
import tempfile
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "")
USE_SQLITE_FALLBACK = os.getenv("USE_SQLITE_FALLBACK", "true").lower() == "true"

def _get_sqlite_url():
    if os.name == 'nt':
        db_path = os.path.join(tempfile.gettempdir(), "multimodal_ai_v3.db")
    else:
        db_path = "/tmp/multimodal_ai_v3.db"
    return f"sqlite:///{db_path}"

if USE_SQLITE_FALLBACK or not DATABASE_URL or not DATABASE_URL.startswith("postgresql"):
    SQLITE_DATABASE_URL = _get_sqlite_url()
    engine = create_engine(SQLITE_DATABASE_URL, connect_args={"check_same_thread": False})
    print(f"Using SQLite database: {SQLITE_DATABASE_URL}")
else:
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            pass
        print(f"Using PostgreSQL database: {DATABASE_URL}")
    except Exception as e:
        print(f"Warning: PostgreSQL connection failed ({e}). Falling back to SQLite.")
        SQLITE_DATABASE_URL = _get_sqlite_url()
        engine = create_engine(SQLITE_DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    try:
        import auth.models
        Base.metadata.create_all(bind=engine)
        print("Database tables verified successfully.")
    except Exception as e:
        print(f"Warning creating tables: {e}")

# Automatically ensure tables exist on module import
create_tables()