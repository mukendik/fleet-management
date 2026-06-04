from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user, require_roles
from app.models.user import User
from app.core.roles import Role
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleUpdate



router = APIRouter(prefix="/vehicles", tags=["Vehicles"])


@router.get("")
def get_vehicles(
    db: Session = Depends(get_db),
    user=Depends(require_roles(Role.ADMIN, Role.DRIVER)),
    current_user: User = Depends(get_current_user)
):
    return db.query(Vehicle).filter(
        Vehicle.company_id == current_user.company_id
    ).all()


#CREATE VEHICLE
@router.post("")
def create_vehicle(
    data: VehicleCreate,
    db: Session = Depends(get_db),
    user=Depends(require_roles(Role.ADMIN)),
    current_user: User = Depends(get_current_user)
):
    vehicle = Vehicle(
        name=data.name,
        plate_number=data.plate_number,
        company_id=current_user.company_id
    )

    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)

    return vehicle

# UPDATE VEHICLE
@router.put("/{vehicle_id}")
def update_vehicle(
    vehicle_id: int,
    data: VehicleUpdate,
    db: Session = Depends(get_db),
    user=Depends(require_roles(Role.ADMIN)),
    current_user: User = Depends(get_current_user)
):
    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id,
        Vehicle.company_id == current_user.company_id
    ).first()

    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    if data.name is not None:
        vehicle.name = data.name

    if data.plate_number is not None:
        vehicle.plate_number = data.plate_number

    db.commit()
    db.refresh(vehicle)

    return vehicle

#DELETE VEHICLE
@router.delete("/{vehicle_id}")
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_roles(Role.ADMIN))
  #  current_user: User = Depends(get_current_user)
):
    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id,
        Vehicle.company_id == current_user.company_id
    ).first()

    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    db.delete(vehicle)
    db.commit()

    return {"message": "Vehicle deleted successfully"}