from sqlalchemy.orm import Session
from datetime import datetime

from app.db.models import Course
from app.core.config import SessionLocal


def delete_expired_courses():
    db: Session = SessionLocal()
    try:
        now = datetime.utcnow()
        expired_courses = db.query(Course).filter(Course.expiry_date < now).all() # Get all expired courses from the database
        for course in expired_courses:
            db.delete(course)
            
        db.commit() # Save changes made to the database
        print(f"Deleted {len(expired_courses)} expired courses")
    finally:
        db.close()
        
