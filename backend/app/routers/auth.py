from fastapi import APIRouter, HTTPException, Depends, Security, status
from fastapi.security import OAuth2PasswordRequestForm, HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError
import os
import sys
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))) 

from app.db import schemas
from app.db.models import User, RefreshToken
from app.auth.security import hash_password, create_access_token, create_refresh_token, verify_password, is_refresh_token_valid, revoke_refresh_token, store_refresh_token
from app.auth.depends import get_current_user
from app.core.config import get_db

router = APIRouter(
    tags = ["Authentication"],
    prefix = "/auth"
)

security = HTTPBearer() # Automatically parses the authorization header, validates the format and gets the token

@router.post("/register", response_model=schemas.UserOut)
def register(UserData: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == UserData.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User Already Exists")
    
    new_user = User(
        email = UserData.email,
        hashed_pwd = hash_password(UserData.pwd),
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


@router.post("/login", response_model=schemas.TokenOut)
def login(LoginData: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == LoginData.username).first()
    if not user or not verify_password(LoginData.password, user.hashed_pwd):
        raise HTTPException(status_code=401, detail="Invalid Credentials")
    
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    # Add newly created refresh_token to the database
    user_id = user.id
    store_refresh_token(db, user_id, refresh_token)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }
    
    
@router.post("/refresh", response_model=schemas.TokenOut)
def refresh_access_token(cred: HTTPAuthorizationCredentials = Security(security), db: Session = Depends(get_db)):
    """ Exchange refresh token for new access token """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate refresh token"
    )
    
    refresh_token = cred.credentials # Gets the raw string token from the authorization header
    
    if not refresh_token:
        return credentials_exception
    
    if not is_refresh_token_valid(db, refresh_token):
        raise credentials_exception
    
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        token_type: str = payload.get("token_type")
        
        if user_id is None or token_type != "refresh":
            raise credentials_exception
        
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    # Create new tokens (token rotation for security)
    new_access_token = create_access_token(data={"sub": str(user.id)})
    new_refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    # Revoke old refresh token and store new one
    revoke_refresh_token(db, refresh_token)
    user_id = user.id
    store_refresh_token(db, user_id, new_refresh_token)
    
    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }
    
    
@router.post("/logout")
async def logout(cred: HTTPAuthorizationCredentials = Security(security), db: Session = Depends(get_db)):
    """ Logout user and revoke refresh token """
    if cred.credentials:
        # Revoke refresh token in database
        revoke_refresh_token(db, cred.credentials)
        
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=schemas.UserOut)
def get_user(current_user: User = Depends(get_current_user)):
    """ Get current user information """
    return current_user





""" @router.get("/validate-session", response_model=schemas.TokenOut)
async def validate_session(request: Request, db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No valid session"
    )
    
    refresh_token = get_refresh_token_from_cookie(request)
    if not refresh_token or not is_refresh_token_valid(db, refresh_token):
        raise credentials_exception
    
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        token_type: str = payload.get("token_type")
        
        if email is None or token_type != "refresh":
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception
    
    # Verify user exists
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    
    # Generate access token for this session
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    } """