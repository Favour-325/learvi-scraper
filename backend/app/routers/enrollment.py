from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))) 

from app.db import schemas
from app.auth.depends import require_role, get_current_user
from app.core.config import get_db
from app.operations import enrollment

router = APIRouter(
    tags = ["Enrollment"],
    prefix = "/enrollment",
)


@router.get('/', response_model=schemas.EnrollmentOut)
def get_all_enrollment(db: Session = Depends(get_db), current_user = Depends(require_role)): # For Admin only
    return enrollment.get_all_enrollment(db)

@router.get('/user/{user_id}', response_model=list[schemas.CourseOut])
def get_user_enrollment(user_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """ Get all course enrollments for a particular user """
    return enrollment.get_all_user_enrollment(user_id, db)

@router.post('/new', response_model=schemas.EnrollmentOut)
def create_enrollment(data: schemas.EnrollmentCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return enrollment.create_enrollment(data, db)

#@router.get('/metrics', response_model=schemas.CourseOut)