from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.db.models import User


def get_recent_signups(db: Session):
    return db.query(User).filter(User.role == "User").order_by(desc(User.joined_at)).limit(3).all() # returns the last 3 created user accounts

def get_all(db: Session):
    return db.query(User).filter(User.role == "User").all()

def get_user(user_id: int, db: Session):
    return db.query(User).filter(User.id == user_id).first() # Verify the possibility of using .one_or_none() instead of .first()

def create(data, db: Session):
    db_user = User(**data.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

def update(user, data, db: Session):
    for field, value in user.dict().items():
        setattr(user, field, value)
        
    db.commit()
    db.refresh(user)
    
    return user

def delete(user, db: Session):
    db.delete(user)
    db.commit()