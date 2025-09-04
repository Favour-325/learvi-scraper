from sqlalchemy.orm import Session

from app.db.models import Affiliate


def get_all_affiliate(db: Session):
    return db.query(Affiliate).all()

def get_affiliate(affiliate_id, db: Session):
    return db.query(Affiliate).filter(Affiliate.id == affiliate_id).first()

def create_affiliate(data, db: Session):
    db_affiliate = Affiliate(**data.dict())
    db.add(db_affiliate)
    db.commit()
    db.refresh(db_affiliate)
    
    return db_affiliate

def update_affiliate(update_data, affiliate, db: Session):
    for field, value in update_data.dict().items():
        setattr(affiliate, field, value)
        
    db.commit()
    db.refresh(affiliate)
    
    return affiliate
    
def delete_affiliate(affiliate, db: Session):
    db.delete(affiliate)
    db.commit()