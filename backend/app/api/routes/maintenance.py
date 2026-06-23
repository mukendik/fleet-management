from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.api.deps import get_db, get_current_user, require_roles
from app.models.user import User
from app.models.vehicle import Vehicle
from app.models.maintenance_alert import MaintenanceAlert
from app.services.maintenance_service import MaintenanceService

router = APIRouter()


# =========================
# DASHBOARD
# =========================
@router.get("/dashboard")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _role=Depends(require_roles(["admin", "manager"]))
):

    return MaintenanceService.get_dashboard(
        db=db,
        company_id=current_user.company_id
    )


# =========================
# ALERTS LIST
# =========================
@router.get("/alerts")
def get_alerts(
    resolved: Optional[bool] = False,
    severity: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _role=Depends(require_roles(["admin", "manager"]))
):

    query = db.query(MaintenanceAlert).filter(
        MaintenanceAlert.company_id == current_user.company_id
    )

    if resolved is not None:
        query = query.filter(MaintenanceAlert.resolved == resolved)

    if severity:
        query = query.filter(MaintenanceAlert.severity == severity)

    alerts = query.order_by(MaintenanceAlert.id.desc()).limit(limit).all()

    return {
        "total": len(alerts),
        "items": alerts
    }


# =========================
# VEHICLE RISK SCORE
# =========================
@router.get("/vehicle/{vehicle_id}/risk")
def get_vehicle_risk(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _role=Depends(require_roles(["admin", "manager"]))
):

    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id,
        Vehicle.company_id == current_user.company_id
    ).first()

    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    return MaintenanceService.compute_risk_score(vehicle)


# =========================
# FULL SCAN (ALL FLEET)
# =========================
@router.post("/scan")
def run_scan(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _role=Depends(require_roles(["admin", "manager"]))
):

    return MaintenanceService.run_full_scan(
        db=db,
        company_id=current_user.company_id
    )


# =========================
# RESOLVE ALERT
# =========================
@router.put("/alerts/{alert_id}/resolve")
def resolve_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _role=Depends(require_roles(["admin", "manager"]))
):

    alert = db.query(MaintenanceAlert).filter(
        MaintenanceAlert.id == alert_id,
        MaintenanceAlert.company_id == current_user.company_id
    ).first()

    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.resolved = True

    db.commit()
    db.refresh(alert)

    return {
        "message": "Alert resolved",
        "alert_id": alert.id
    }