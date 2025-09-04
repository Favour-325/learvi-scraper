from sqlalchemy.orm import Session

from app.db.models import Bookmark

def get(course_id, db: Session, current_user):
    return db.query(Bookmark).filter(Bookmark.course_id == course_id, 
                                     Bookmark.user_id == current_user.id).first()

def get_all(db: Session, current_user):
    return db.query(Bookmark).filter(Bookmark.user_id == current_user.id).all()

def create(data, db: Session):
    db_bookmark = Bookmark(**data.dict())
    db.add(db_bookmark)
    db.commit()
    db.refresh(db_bookmark)
    
    return db_bookmark

    
def delete(bkmk, db: Session, ):
    db.delete(bkmk)
    db.commit()
    