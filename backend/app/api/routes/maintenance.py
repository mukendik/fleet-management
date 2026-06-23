from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user, require_roles
from app.models.user import User
from app.services.maintenance_service import MaintenanceService

router = APIRouter()


# =========================
# DASHBOARD
# =========================

@router.get("/dashboard")
def maintenance_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _role=Depends(require_roles(["admin", "manager"]))
):

    return MaintenanceService.get_dashboard(
        db,
        current_user.company_id
    )


# =========================
# FULL SCAN (ADMIN TOOL)
# =========================

@router.post("/scan")
def run_scan(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _role=Depends(require_roles(["admin"]))
):

    return MaintenanceService.run_full_scan(
        db,
        current_user.company_id
    )


# =========================
# CHECK SINGLE VEHICLE
# =========================

@router.post("/vehicle/{vehicle_id}/check")
def check_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _role=Depends(require_roles(["admin", "manager"]))
):

    from app.models.vehicle import Vehicle

    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id,
        Vehicle.company_id == current_user.company_id
    ).first()

    if not vehicle:
        return {"error": "Vehicle not found"}

    alerts = MaintenanceService.check_vehicle(db, vehicle)

    return {
        "vehicle_id": vehicle.id,
        "alerts_created": len(alerts)
    }