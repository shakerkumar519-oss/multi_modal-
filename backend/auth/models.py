from sqlalchemy import Column, String, DateTime, Boolean, Text, ForeignKey, Integer
from sqlalchemy.sql import func
import uuid
from passlib.context import CryptContext
from database import Base

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def generate_uuid_str():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid_str)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    password_hash = Column(String, nullable=True)  # Nullable for Google-only users
    google_id = Column(String, unique=True, nullable=True, index=True)
    auth_provider = Column(String, nullable=False, default="email")  # email, google
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def verify_password(self, password: str) -> bool:
        """Verify a password against the stored hash."""
        if not self.password_hash:
            return False
        return pwd_context.verify(password, self.password_hash)

    def set_password(self, password: str):
        """Hash and set the password."""
        self.password_hash = pwd_context.hash(password)

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(String(36), primary_key=True, default=generate_uuid_str)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class UploadedFile(Base):
    __tablename__ = "uploaded_files"

    id = Column(String(36), primary_key=True, default=generate_uuid_str)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    document_id = Column(String, nullable=False)  # The UUID used in vectorstore for this PDF
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())