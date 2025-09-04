from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))) 

from app.db import schemas
from app.db.models import Metrics
from app.auth.depends import get_current_user, require_role
from app.core.config import get_db
from app.operations import metrics

router = APIRouter(
    tags = ["Metrics"],
    prefix = "/metrics",
    dependencies = [Depends(require_role())]
)

@router.get("/", response_model=schemas.MetricsRes)
def get_metrics(db: Session = Depends(get_db)):
    return metrics.get_metrics(db)


