from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.db.models import User, Course, Metrics
from app.operations.enrollment import enrollment_metrics

def initialize_metrics(db: Session, growth_rate):
    total_users = db.query(User).filter(User.role == "User").count()
    total_courses = db.query(Course).filter(Course.is_active == True).count()
    
    change_result = change(db)
    
    db_metrics = Metrics(
        total_users = total_users,
        total_courses = total_courses,
        most_enrolled_course = enrollment_metrics['most_enrolled_course'],
        change_courses = change_result["courses"],
        change_users = change_result["users"],
        growth_rate = growth_rate
    )
    db.add(db_metrics)
    db.commit()
    db.refresh(db_metrics)
    
    return db_metrics

def get_metrics(db: Session):
    last_record = db.query(Metrics).order_by(desc(Metrics.id)).first() 
    
    if last_record == None:
        return {
            "record": None,
            "users": 0,
            "courses": 0,
    }
    
    if last_record.id == 1:
        return last_record
        
    id_prev_record = last_record.id - 1
    prev_record = db.query(Metrics).filter(Metrics.id == id_prev_record).first()
    
    # Now we have to compare the change between the two records to verify if it's positive
    last_change_users = last_record.change_users
    last_change_courses = last_record.change_courses
    
    prev_change_users = prev_record.change_users
    prev_change_courses = prev_record.change_courses
    
    # Compare last and previous changes for each metric
    status_users = 1 if (last_change_users - prev_change_users) >= 0 else 0
    status_courses = 1 if (last_change_courses - prev_change_courses) >= 0 else 0
    
    return {
        "record": last_record,
        "users": status_users,
        "courses": status_courses,
    }

def change(db: Session):
    last_record = db.query(Metrics).order_by(desc(Metrics.timestamp)).first() # returns as instance of the Metrics model
    
    if last_record == None:
        return {
            "users": 0,
            "subscribers": 0,
            "courses": 0,
            "revenue": 0
        }
    
    db_courses = db.query(Course).filter(Course.is_active == True).count() # Real-time data from the database table
    db_users = db.query(User).filter(User.role == "User").count()
    
    total_courses = last_record.total_courses # Lastly saved data
    total_users = last_record.total_users
    
    change_courses = db_courses - total_courses # Real-time data - lastly saved data
    change_users = db_users - total_users
    
    return {
        "users": change_users,
        "courses": change_courses,
    }
    
    


