from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from datetime import datetime

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

    # 1. close old assignment for vehicle
    db.query(VehicleAssignment).filter(
        VehicleAssignment.vehicle_id == data.vehicle_id,
        VehicleAssignment.is_active == True,
        VehicleAssignment.company_id == current_user.company_id
    ).update({
        "is_active": False,
        "unassigned_at": datetime.utcnow()
    })

    # 2. close old assignment for driver
    db.query(VehicleAssignment).filter(
        VehicleAssignment.driver_id == data.driver_id,
        VehicleAssignment.is_active == True,
        VehicleAssignment.company_id == current_user.company_id
    ).update({
        "is_active": False,
        "unassigned_at": datetime.utcnow()
    })

    # 3. create new assignment
    assignment = VehicleAssignment(
        vehicle_id=data.vehicle_id,
        driver_id=data.driver_id,
        company_id=current_user.company_id,
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
@router.get("/vehicle/{vehicle_id}/current")
def get_current_driver(vehicle_id: int, db: Session = Depends(get_db)):

    assignment = (
        db.query(VehicleAssignment)
        .options(joinedload(VehicleAssignment.driver))
        .filter(
            VehicleAssignment.vehicle_id == vehicle_id,
            VehicleAssignment.is_active == True
        )
        .first()
    )

    if not assignment:
        return {
            "driver": None,
            "id": None,
            "assigned_at": None,
            "vehicle_id": vehicle_id
        }

    return assignment

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
        .order_by(VehicleAssignment.assigned_at.desc())
        .all()
    )