from fastapi import Depends
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.core.config import get_db
from app.db.models import User
from app.operations.metrics import initialize_metrics
from app.operations.metrics import get_metrics

""" Growth rate determines the change of the number of subscribers on the platform with respect to time """

def growth_rate_calc(db: Session):
    last_record = get_metrics(db)
    print(last_record)
    record = last_record["record"]
    last_users = record.total_users
    actual_users = db.query(User).filter(User.role == "User").count()
    
    growth_rate = ((last_users - actual_users)/last_users)*100
    
    initialize_metrics(db, growth_rate)