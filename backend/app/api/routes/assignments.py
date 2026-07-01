from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from sqlalchemy import desc, func
from datetime import datetime
import time

from app.api.deps import get_db, get_current_user, require_roles
from app.models.vehicle_assignment import VehicleAssignment
from app.schemas.vehicle_assignment import AssignmentCreate, AssignmentResponse
from app.models.user import User

router = APIRouter()

#assign a driver to a vehicle
@router.post("", response_model=AssignmentResponse)
def assign_vehicle(
    data: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _role=Depends(require_roles(["admin", "manager"]))
):

    company_id = current_user.company_id

    # close old assignment vehicle
    db.query(VehicleAssignment).filter(
        VehicleAssignment.vehicle_id == data.vehicle_id,
        VehicleAssignment.company_id == company_id,
        VehicleAssignment.is_active == True
    ).update({
        "is_active": False,
        "unassigned_at": datetime.utcnow()
    })

    # close old assignment driver
    db.query(VehicleAssignment).filter(
        VehicleAssignment.driver_id == data.driver_id,
        VehicleAssignment.company_id == company_id,
        VehicleAssignment.is_active == True
    ).update({
        "is_active": False,
        "unassigned_at": datetime.utcnow()
    })

    assignment = VehicleAssignment(
        vehicle_id=data.vehicle_id,
        driver_id=data.driver_id,
        company_id=company_id,
        is_active=True,
        assigned_at=datetime.utcnow()
    )

    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return assignment

#unassign a driver from a vehicle
@router.delete("/{assignment_id}")
def unassign_driver(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _role=Depends(require_roles(["admin", "manager"]))
):

    assignment = (
        db.query(VehicleAssignment)
        .filter(
            VehicleAssignment.id == assignment_id,
            VehicleAssignment.company_id == current_user.company_id,
            VehicleAssignment.is_active == True
        )
        .first()
    )

    if not assignment:
        raise HTTPException(404, "Assignment not found")

    assignment.is_active = False
    assignment.unassigned_at = datetime.utcnow()

    db.commit()

    return {"message": "Driver unassigned"}

#current driver of a vehicle
@router.get("/driver/{driver_id}/current")
def get_current_vehicle(
    driver_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    result = (
        db.query(VehicleAssignment)
        .options(joinedload(VehicleAssignment.vehicle))
        .filter(
            VehicleAssignment.driver_id == driver_id,
            VehicleAssignment.company_id == current_user.company_id,
            VehicleAssignment.is_active == True
        )
        .first()
    )

    if not result:
        return {
            "vehicle": None,
            "id": None,
            "assigned_at": None,
            "driver_id": driver_id
        }

    return result

@router.get("/vehicle/{vehicle_id}/current")
def get_current_driver(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    start = time.time()

    result = (
        db.query(VehicleAssignment)
        .options(joinedload(VehicleAssignment.driver))
        .filter(
            VehicleAssignment.vehicle_id == vehicle_id,
            VehicleAssignment.company_id == current_user.company_id,
            VehicleAssignment.is_active == True
        )
        .first()
    )

    print("🔥 CURRENT QUERY TIME:", time.time() - start)

    return result or {
        "driver": None,
        "id": None,
        "assigned_at": None,
        "vehicle_id": vehicle_id
    }

#historique véhicule
@router.get("/vehicle/{vehicle_id}/history")
def vehicle_history(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return (
        db.query(VehicleAssignment)
        .options(joinedload(VehicleAssignment.driver))
        .filter(
            VehicleAssignment.vehicle_id == vehicle_id,
            VehicleAssignment.company_id == current_user.company_id
        )
        .order_by(
            func.coalesce(
                VehicleAssignment.unassigned_at,
                VehicleAssignment.assigned_at
            ).desc()
        )
        .limit(100)
        .all()
    )

@router.get("")
def list_assignments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    company_id = current_user.company_id

    assignments = (
        db.query(VehicleAssignment)
        .options(
            joinedload(VehicleAssignment.driver),
            joinedload(VehicleAssignment.vehicle)
        )
        .filter(
            VehicleAssignment.company_id == company_id
        )
        .order_by(VehicleAssignment.assigned_at.desc())
        .limit(100)
        .all()
    )

    return assignments