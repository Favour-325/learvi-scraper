from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))) 

from app.db import schemas
from app.db.models import User
from app.auth.depends import require_role, get_current_user
from app.core.config import get_db
from app.operations import affiliate

router = APIRouter(
    tags = ["Affiliate"],
    prefix = "/affiliate",
    dependencies = [Depends(require_role())]
)


@router.get('/', response_model=list[schemas.AffiliateOut])
def get_all_affiliate(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    
    return affiliate.get_all_affiliate(db)

@router.get('/{affiliate_id}', response_model=schemas.AffiliateOut)
def get_affiliate(affiliate_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    
    return affiliate.get_affiliate(affiliate_id, db)

@router.post('/new', response_model=schemas.AffiliateOut)
def create_affiliate(data: schemas.AffiliateCreate, db: Session = Depends(get_db)):
    
    return affiliate.create_affiliate(data, db)

@router.patch('/update/{affiliate_id}', response_model=schemas.AffiliateOut)
def update_affiliate(affiliate_id: int, data: schemas.AffiliateCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_affiliate = affiliate.get_affiliate(affiliate_id, db)
    
    return affiliate.update_affiliate(data, db_affiliate, db)

@router.delete('/delete/{affiliate_id}')
def delete_affiliate(affiliate_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_affiliate = affiliate.get_affiliate(affiliate_id, db)
    
    affiliate.delete_affiliate(db_affiliate, db)
    return {"message": "Affiliate has been removed successfully"}
    