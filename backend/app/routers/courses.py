from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))) 

from app.db import schemas
from app.db.models import Course, User
from app.operations import courses
from app.auth.depends import get_current_user, require_role
from app.core.config import get_db

router = APIRouter(
    tags = ["Courses"],
    prefix = "/courses"
)

@router.get("/", response_model=schemas.PaginatedOut)
def get_all_courses(category: Optional[str] = None,
                    search: Optional[str] = None,
                    limit: int = 100,
                    offset: int = 0,
                    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    
    query = db.query(Course).filter(Course.is_active == True)
    
    if category:
        query = query.filter(Course.category == category)
    
    # .ilike() is case-insensitive. % is used to match any character before and after the specified string.
    if search:
        query = query.filter(Course.title.ilike(f"%{search}%"))
    
    total = query.count()
    courses = query.offset(offset).limit(limit).all()
    
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "results": courses
    }
    
    
@router.get("/{course_id}", response_model=schemas.CourseOut)
def get_course(course_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    course = courses.get_course(course_id, db)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    return course


@router.post("/create", response_model=schemas.CourseOut)
def new_course(CourseData: schemas.CourseCreate, db: Session = Depends(get_db), current_user = Depends(require_role)):
    
    db_course = Course(**CourseData.dict())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    
    return db_course


@router.patch("/update/{course_id}", response_model=schemas.CourseOut)
def update_course(course_id: int, CourseData: schemas.CourseCreate, db: Session = Depends(get_db), current_user = Depends(require_role)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    for field, value in CourseData.dict().items():
        setattr(course, field, value)
        
    db.commit()
    db.refresh(course)
    
    return course


@router.delete("/delete/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db), current_user = Depends(require_role)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    db.delete(course)
    db.commit()
    
    return {"message": "Course deleted successfully"}