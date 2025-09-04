from sqlalchemy.orm import Session

from app.db.models import Course


def get_course(course_id: int, db: Session):
    return db.query(Course).filter(Course.id == course_id).first()