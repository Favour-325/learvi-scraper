from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))) 

from app.db import schemas
from app.auth.depends import require_role, get_current_user
from app.core.config import get_db
from app.operations import announcements

router = APIRouter(
    tags = ["Announcement"],
    prefix = "/announcement",
)

@router.get("/", response_model=list[schemas.AnnouncementOut])
def get_all(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    
    return announcements.get_all(db)

@router.post("/new", response_model=schemas.AnnouncementOut)
def create(data: schemas.Announcement, db: Session = Depends(get_db), current_user = Depends(require_role)):
    
    return announcements.create(db, data)

@router.patch("/update/{announcement_id}", response_model=schemas.AnnouncementOut)
def update(announcement_id: int, data: schemas.Announcement, db: Session = Depends(get_db), current_user = Depends(require_role)):
    
    db_announcement = announcements.get(db, announcement_id)
    if db_announcement == None:
        raise HTTPException(status_code=404, detail="Announcement not found")

    return announcements.update(db, db_announcement, data)
 
@router.delete("/delete/{announcement_id}")
def delete(announcement_id: int, db: Session = Depends(get_db), current_user = Depends(require_role)):
    db_announcement = announcements.get(db, announcement_id)
    if db_announcement == None:
        raise HTTPException(status_code=404, detail="Announcement not found")
    
    announcements.delete(db_announcement, db)
    return {"Message": "Announcement deleted successfully"}