from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.db.models import User
from app.auth.security import ALGORITHM
from app.core.config import get_db

import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """ Extract and validate the current user from JWT token """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    
    if not token:
        raise credentials_exception
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        token_type: str = payload.get("token_type")
        
        # Ensure this is an access token, not a refresh token
        if user_id is None or token_type != "access":
            raise credentials_exception
        
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

# Dependency factory - a function that returns another function
def require_role():
    """ Gets user role and verifies if the specified role is allowed access to route """
    def admin_checker(current_user: Session = Depends(get_current_user)):
        if current_user.role != "Admin":
            raise HTTPException(status_code = 403, detail="Permission Denied")
        
        return current_user
    return admin_checker    # FastAPI's Depends expects a callable object that it can execute to resolve the dependency