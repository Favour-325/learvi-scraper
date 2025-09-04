from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))) 

from app.db import schemas
from app.auth.depends import require_role
from app.core.config import get_db
from app.operations import users

router = APIRouter(
    tags = ["User"],
    prefix = "/user-mgt",
    dependencies = [Depends(require_role())]
)


@router.get("/recent", response_model=list[schemas.UserOut])
def recent_signups(db: Session = Depends(get_db)):
    return users.get_recent_signups(db)

@router.get("/", response_model=list[schemas.UserOut])
def get_all_users(db: Session = Depends(get_db)):
    return users.get_all(db)

@router.get("/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    return users.get_user(user_id, db)

@router.post("/new", response_model=schemas.UserOut)
def create_user(data: schemas.UserCreate, db: Session = Depends(get_db)):
    user = users.create(data, db)
    
    return user

@router.patch("/update/{user_id}", response_model=schemas.UserOut)
def update_user(user_id: int, data, db: Session = Depends(get_db)):
    user = users.get_user(user_id, db)
    
    if user == None:
        raise HTTPException(status=404, details="No user found")
    
    return users.update(user, data, db)

@router.delete("/delete/{user_id}", response_model=schemas.UserOut)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = users.get_user(user_id, db)
    
    if user == None:
        raise HTTPException(status=404, details="No user found")
    
    users.delete(user, db)
    
    return {"Message": "User deleted successfully"}