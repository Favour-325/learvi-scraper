from fastapi import Request, Response
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from typing import Optional
import secrets
import hashlib
import os
from dotenv import load_dotenv

from app.db.models import RefreshToken
from app.core.config import get_db

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# bcrypt is the algorithm used for hashing passwords
# deprecated="auto" means Passlib will automatically mark older, and less secure schemes as deprecated if more are added later.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_token(token: str) -> str:
    """ Hash tokens for secure database storage """
    return hashlib.sha256(token.encode()).hexdigest()

def hash_password(password: str):
    """ Creates a hashed version of the plain password """
    return pwd_context.hash(password)

def verify_password(plain_pwd, hashed_pwd):
    """ Compares the plain password to the hashed password to verify if they are the same """
    return pwd_context.verify(plain_pwd, hashed_pwd)

# This creates secure, time-limited tokens for user-authentication
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy() # copies data to ensure original data isn't modified
    expire = datetime.utcnow() + (expires_delta or timedelta(days=1)) 
    to_encode.update({"exp": expire, "token_type": "access"}) # adds the expiration time to the token data
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM) # the data is encoded into a JWT using the secret key and algorithm.

    # token to_encode data always includes non-sensitive identifiers and never the password

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    
    to_encode.update({
        "exp": expire, 
        "token_type": "refresh", 
    }) 
    
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_refresh_token_from_cookie(request: Request) -> Optional[str]:
    """ Extract refresh token from HTTP-only cookie """
    
    return request.cookies.get("refresh_token")


def set_refresh_token_cookie(response: Response, refresh_token: str):
    """ Set refresh token as HTTP-only cookie with security flags """
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        max_age=datetime.utcnow() + timedelta(days=7)*24*60*60,
        httponly=True,  # Prevents JavaScript access - key security feature
        secure=False,   # Set to True in production with HTTPS
        samesite="lax", # CSRF protection while allowing some cross-stie usage
        path="/",       # Coolie available for entire domain
    )
    

def clear_refresh_token_cookie(response: Response):
    """ Clear refresh token cookie on logout """
    
    response.set_cookie(
        key="refresh_token",
        value="",
        max_age=0,
        httponly=True,
        secure=False,
        samesite="lax",
        path="/"
    )
    
def is_refresh_token_valid(db: Session, refresh_token: str) -> bool:
    """ Check if refresh token exists and is valid in database """
    token_hash = hash_token(refresh_token)
    
    db_token = db.query(RefreshToken).filter(
        RefreshToken.token_hash == token_hash,
        RefreshToken.is_revoked == False,
        RefreshToken.expires_at > datetime.utcnow()
    ).first()
    
    return db_token is not None

def revoke_refresh_token(db: Session, refresh_token: str):
    """ Revoke refresh token in database """
    token_hash = hash_token(refresh_token)
    
    db_token = db.query(RefreshToken).filter(
        RefreshToken.token_hash == token_hash
    ).first()
    
    if db_token:
        db_token.is_revoked = True
        db.commit()
        
def store_refresh_token(db: Session, user_id, refresh_token):
    """ Store refresh token in database """
    # Add newly created refresh_token to the database
    new_token = RefreshToken(
        token_hash = hash_token(refresh_token),
        is_revoked = False,
        user_id = user_id,
        expires_at = datetime.utcnow() + timedelta(days=7)
    )
    db.add(new_token)
    db.commit()
    db.refresh(new_token)