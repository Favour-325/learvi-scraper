from sqlalchemy.orm import Session
from app.db.models import Announcement

""" The Create Function Explained """
# The function is used to create a db object using SQLAlchmey.
# 1. Converts the data (usually a Pydantic model) to a dict by unpacking the dict into kwargs for the model, creating a new instance.

# 2. Adds the new model object to the SQLAlchemy session which then track changes to this object and prepares it for insertion into the db.

# 3. Commits the current transaction, saving all changes tracked by the session to the db. This is when the new object is actually written to the db.

# 4. Reloads the object from the db to update its attributes (like auto-generated id) and ensures the returned object has all fields populated as stored in the db.

def get_all(db: Session):
    return db.query(Announcement).all()

def get(db: Session, announcement_id):
    return db.query(Announcement).filter(Announcement.id == announcement_id).first()

def create(db: Session, data):
    db_announcement = Announcement(**data.dict()) # (1)
    
    db.add(db_announcement) # (2)
    db.commit() # (3)
    db.refresh(db_announcement) # (4)
    
    return db_announcement

def update(db: Session, announcement, data):
    for field, value in data.dict().items():
        setattr(announcement, field, value)
        
    db.commit()
    db.refresh(announcement)
    
    return announcement

def delete(announcement, db: Session):
    db.delete(announcement)
    db.commit()