from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct
from datetime import datetime, timedelta

from app.api.deps import get_db, get_current_user
from app.models.vehicle import Vehicle
from app.models.driver import Driver
from app.models.vehicle_assignment import VehicleAssignment

router = APIRouter()


@router.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    company_id = current_user.company_id

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
    ).scalar() or 0

    free_vehicles = max(total_vehicles - assigned_vehicles, 0)

    # =========================
    # DRIVERS
    # =========================
    total_drivers = db.query(Driver).filter(
        Driver.company_id == company_id
    ).count()

    active_drivers = db.query(Driver).filter(
        Driver.company_id == company_id,
        Driver.status == "active"
    ).count()

    assigned_drivers = db.query(
        func.count(distinct(VehicleAssignment.driver_id))
    ).filter(
        VehicleAssignment.company_id == company_id,
        VehicleAssignment.is_active == True
    ).scalar() or 0

    available_drivers = active_drivers - assigned_drivers

    # =========================
    # ASSIGNMENTS KPI
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
            "assigned": assigned_drivers,
            "available": available_drivers
        },
        "assignments": {
            "active": active_assignments,
            "today": today_assignments,
            "weekly": weekly_assignments
        }
    }

from sqlalchemy import func
from datetime import datetime, timedelta

...

@router.get("/weekly")
def weekly_assignments(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    company_id = current_user.company_id

    start = datetime.utcnow() - timedelta(days=6)

    assignments = (
        db.query(
            func.date(VehicleAssignment.assigned_at),
            func.count(VehicleAssignment.id)
        )
        .filter(
            VehicleAssignment.company_id == company_id,
            VehicleAssignment.assigned_at >= start
        )
        .group_by(func.date(VehicleAssignment.assigned_at))
        .all()
    )

    result = {}

    for d, count in assignments:
        result[str(d)] = count

    data = []

    for i in range(7):
        day = start + timedelta(days=i)

        data.append({
            "day": day.strftime("%a"),
            "value": result.get(day.strftime("%Y-%m-%d"), 0)
        })

    return data