from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.models import Enrollment, Course


def get_all_enrollment(db: Session):
    return db.query(Enrollment).all()

def get_all_user_enrollment(user_id, db: Session):
    """ db_enrollments = db.query(Enrollment).filter(Enrollment.user_id == user_id).all()
    
    # Getting the course details using the course id from each enrollment
    courses = []
    for enrollment in db_enrollments:
        course = get_course(enrollment.course_id, db)
        courses.append(course) """
    # Hahaha everything done in a single line
    courses = db.query(Course).join(Enrollment).filter(Enrollment.user_id == user_id).all()
        
    return courses
        
def create_enrollment(data, db: Session):
    db_enrollment = Enrollment(**data.dict())
    db.add(db_enrollment)
    db.commit()
    db.refresh(db_enrollment)
    
    return db_enrollment
    
def enrollment_metrics(db: Session):
    query = (
        db.query(Course.title, func.count(Enrollment.course_id)).label("enrollment_count")
        .join(Enrollment)
        .group_by(Course.id) # aggregates the counts per course_id
        .order_by(func.count(Enrollment.course_id).desc())
    ) # the () enables us to break the expression into multiple lines
    
    most_enrolled_course = query.first()
    most_enrolled_courses = query.limit(5).all()
    
    return {
        "most enrolled course": most_enrolled_course,
        "most enrolled courses": most_enrolled_courses
    }
    
    