from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional
import os
from typing import Optional, Any
from datetime import datetime, timedelta
from database import get_db
from .models import User
from .utils import verify_password, get_password_hash, create_access_token, verify_token
from pydantic import BaseModel, EmailStr
from jose import jwt, JWTError
from authlib.integrations.starlette_client import OAuth

router = APIRouter(prefix="/auth", tags=["authentication"])

# Pydantic models
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(UserBase):
    id: Any
    is_active: bool
    auth_provider: str
    created_at: Optional[Any] = None

    class Config:
        from_attributes = True

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Google OAuth setup
oauth = OAuth()
oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

@router.post("/signup", response_model=Token)
async def signup(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user_data.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=hashed_password,
        auth_provider="email"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create access token
    access_token_expires = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")))
    access_token = create_access_token(
        data={"sub": new_user.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")))
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, os.getenv("JWT_SECRET_KEY"), algorithms=[os.getenv("JWT_ALGORITHM")])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# Google OAuth routes
@router.get('/google/login')
async def google_login(request: Request):
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    if not client_id or not client_secret or client_id == client_secret or "googleusercontent" not in client_id or "googleusercontent" in client_secret:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google Client Secret in .env is invalid. Client Secret must be your secret key (e.g. GOCSPX-...), not another *.googleusercontent.com string."
        )
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
    if not redirect_uri:
        host = request.headers.get("x-forwarded-host") or request.headers.get("host", "localhost:8000")
        scheme = "https" if "onrender.com" in host or request.headers.get("x-forwarded-proto") == "https" else "http"
        redirect_uri = f"{scheme}://{host}/auth/google/callback"

    try:
        return await oauth.google.authorize_redirect(request, redirect_uri)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to initiate Google OAuth: {str(e)}"
        )

@router.get('/google/callback')
async def google_callback(request: Request, db: Session = Depends(get_db)):
    frontend_url = os.getenv("FRONTEND_URL")
    if not frontend_url:
        cors_origin = os.getenv("BACKEND_CORS_ORIGINS", "http://localhost:5173").split(",")[0].strip()
        frontend_url = cors_origin if cors_origin != "*" else "http://localhost:5173"

    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')
        if not user_info:
            import httpx
            async with httpx.AsyncClient() as client:
                res = await client.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    headers={"Authorization": f"Bearer {token['access_token']}"}
                )
                user_info = res.json()

        email = user_info['email']
        name = user_info.get('name', email.split('@')[0])
        google_id = user_info['sub']

        user = db.query(User).filter(
            (User.email == email) | (User.google_id == google_id)
        ).first()

        if user:
            if not user.google_id:
                user.google_id = google_id
                if user.auth_provider == "email":
                    user.auth_provider = "both"
            db.commit()
        else:
            user = User(
                email=email,
                name=name,
                google_id=google_id,
                auth_provider="google"
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        access_token_expires = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")))
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )

        return RedirectResponse(url=f"{frontend_url}/?token={access_token}")
    except Exception as e:
        error_msg = str(e)
        html_error = f"""
        <!DOCTYPE html>
        <html>
        <head><title>Authentication Notice</title></head>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #0f0c29; color: white; text-align: center;">
            <div style="max-width: 450px; padding: 30px; background: #1a0533; border-radius: 16px; border: 1px solid #333;">
                <h2 style="color: #ef4444;">Google Sign In Notice</h2>
                <p style="color: #d1d5db; font-size: 14px; line-height: 1.5;">{error_msg}</p>
                <a href="{frontend_url}/login" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Return to Login</a>
            </div>
        </body>
        </html>
        """
        return HTMLResponse(content=html_error, status_code=400)