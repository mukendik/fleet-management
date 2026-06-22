from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct
from datetime import datetime, timedelta

from app.api.deps import get_db, get_current_user
from app.models.vehicle import Vehicle
from app.models.driver import Driver
from app.models.vehicle_assignment import VehicleAssignment
from app.models.user import User

router = APIRouter()


@router.get("/dashboard")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    company_id = current_user.company_id

    if not company_id:
        return {"error": "Missing company_id on user"}

    # =========================
    # VEHICLES
    # =========================
    total_vehicles = db.query(Vehicle).filter(
        Vehicle.company_id == company_id
    ).count()

    assigned_vehicles = db.query(
        func.count(distinct(VehicleAssignment.vehicle_id))
    ).filter(
        VehicleAssignment.company_id == company_id,
        VehicleAssignment.is_active == True
    ).scalar()

    free_vehicles = max(total_vehicles - assigned_vehicles, 0)

    # =========================
    # DRIVERS (BUSINESS LOGIC)
    # =========================
    total_drivers = db.query(Driver).filter(
        Driver.company_id == company_id
    ).count()

    # drivers actifs métier
    active_drivers = db.query(Driver).filter(
        Driver.company_id == company_id,
        Driver.status == "active"
    ).count()

    inactive_drivers = db.query(Driver).filter(
        Driver.company_id == company_id,
        Driver.status != "active"
    ).count()

    # drivers actuellement assignés à un véhicule (REAL-TIME OPS STATE)
    assigned_drivers = db.query(
        func.count(distinct(VehicleAssignment.driver_id))
    ).filter(
        VehicleAssignment.company_id == company_id,
        VehicleAssignment.is_active == True
    ).scalar()

    # drivers actifs MAIS NON assignés (très utile KPI SaaS)
    unassigned_active_drivers = db.query(Driver).filter(
        Driver.company_id == company_id,
        Driver.status == "active"
    ).filter(
        ~Driver.id.in_(
            db.query(VehicleAssignment.driver_id).filter(
                VehicleAssignment.company_id == company_id,
                VehicleAssignment.is_active == True
            )
        )
    ).count()

    # =========================
    # ASSIGNMENTS
    # =========================
    now = datetime.utcnow()
    today_start = datetime(now.year, now.month, now.day)
    week_start = now - timedelta(days=7)

    today_assignments = db.query(VehicleAssignment).filter(
        VehicleAssignment.company_id == company_id,
        VehicleAssignment.assigned_at >= today_start
    ).count()

    weekly_assignments = db.query(VehicleAssignment).filter(
        VehicleAssignment.company_id == company_id,
        VehicleAssignment.assigned_at >= week_start
    ).count()

    churn = db.query(VehicleAssignment).filter(
        VehicleAssignment.company_id == company_id,
        VehicleAssignment.is_active == False,
        VehicleAssignment.unassigned_at.isnot(None),
        VehicleAssignment.unassigned_at >= week_start
    ).count()

    active_assignments = db.query(VehicleAssignment).filter(
        VehicleAssignment.company_id == company_id,
        VehicleAssignment.is_active == True
    ).count()

    # =========================
    # RESPONSE
    # =========================
    return {
        "vehicles": {
            "total": total_vehicles,
            "assigned": assigned_vehicles,
            "free": free_vehicles
        },
        "drivers": {
            "total": total_drivers,
            "active": active_drivers,
            "inactive": inactive_drivers,
            "assigned": assigned_drivers,
            "available": unassigned_active_drivers
        },
        "assignments": {
            "active": active_assignments,
            "today": today_assignments,
            "weekly": weekly_assignments,
            "churn": churn
        }
    }
