from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.vehicle import Vehicle

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])


@router.get("")
def get_vehicles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Vehicle).filter(
        Vehicle.company_id == current_user.company_id
    ).all()