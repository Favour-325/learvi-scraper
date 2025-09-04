from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))) 

from app.db import schemas
from app.db.models import Bookmark
from app.auth.depends import get_current_user
from app.core.config import get_db
from app.operations import bookmarks

router = APIRouter(
    tags = ["Bookmark"],
    prefix = "/bookmarks"
)

@router.get("/", response_model=list[schemas.BookmarkOut])
def get_all_bookmarks(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return bookmarks.get_all(db, current_user)


@router.get("/{course_id}", response_model=schemas.BookmarkOut)
def get_bookmark(course_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    bkmk = bookmarks.get(course_id, db, current_user)
    
    if not bkmk:
        raise HTTPException(status_code=404, detail="Course not found")
    
    return bkmk


@router.post("/new", response_model=schemas.BookmarkOut)
def create_bookmark(data: schemas.BookmarkCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):        
    
    return bookmarks.create(data, db, current_user)


@router.delete("/delete/{course_id}")
def delete_bookmark(course_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    bkmk = get_bookmark(course_id, db, current_user)
    
    if not bkmk:
        raise HTTPException(status_code=404, detail="Course not found")
    
    bookmarks.delete(bkmk, db)
    return {"message: ": "Course has be unmarked"}