from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_db, get_current_user
from app.models.vehicle_assignment import VehicleAssignment
from app.models.user import User

router = APIRouter()


@router.get("")
def get_activity(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    company_id = current_user.company_id

    if not company_id:
        return {"error": "Missing company_id"}

    activities = (
        db.query(VehicleAssignment)
        .options(
            joinedload(VehicleAssignment.driver),   # 🔥 IMPORTANT
            joinedload(VehicleAssignment.vehicle)   # 🔥 IMPORTANT
        )
        .filter(VehicleAssignment.company_id == company_id)
        .order_by(VehicleAssignment.assigned_at.desc())
        .limit(50)
        .all()
    )

    return activities