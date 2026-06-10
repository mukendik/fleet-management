from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import or_

from app.api.deps import get_db, get_current_user, require_roles
from app.models.user import User
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleUpdate


router = APIRouter(prefix="/vehicles", tags=["Vehicles"])


@router.get("")
def get_vehicles(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),

    search: str | None = None,
    status: str | None = None,
    brand: str | None = None,

    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _role=Depends(require_roles(["admin", "manager"]))
):
    query = db.query(Vehicle).filter(
        Vehicle.company_id == current_user.company_id
    )

    # SEARCH
    if search:
        query = query.filter(
            or_(
                Vehicle.name.ilike(f"%{search}%"),
                Vehicle.plate_number.ilike(f"%{search}%")
            )
        )

    # FILTERS
    if status:
        query = query.filter(Vehicle.status == status)

    if brand:
        query = query.filter(Vehicle.brand == brand)

    total = query.count()

    vehicles = query.offset(
        (page - 1) * limit
    ).limit(limit).all()

    return {
        "items": vehicles,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit
    }


#CREATE VEHICLE
@router.post("")
def create_vehicle(
    data: VehicleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _role=Depends(require_roles(["admin", "manager"]))
):
    vehicle = Vehicle(
        name=data.name,
        plate_number=data.plate_number,
        brand=data.brand,
        model=data.model,
        year=data.year,
        company_id=current_user.company_id,
        status=data.status
    )

    db.add(vehicle)

    try:
        db.commit()
        db.refresh(vehicle)
        return vehicle

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Plate number already exists"
        )

# GET VEHICLE BY ID (DETAIL)
@router.get("/{vehicle_id}")
def get_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["admin", "manager"])),
    current_user: User = Depends(get_current_user)
):
    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id,
        Vehicle.company_id == current_user.company_id
    ).first()

    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    return vehicle

# UPDATE VEHICLE
@router.put("/{vehicle_id}")
def update_vehicle(
    vehicle_id: int,
    data: VehicleUpdate,
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

    if data.name is not None:
        vehicle.name = data.name

    if data.plate_number is not None:
        vehicle.plate_number = data.plate_number

    if data.brand is not None:
        vehicle.brand = data.brand

    if data.model is not None:
        vehicle.model = data.model

    if data.year is not None:
        vehicle.year = data.year

    if data.status is not None:
        vehicle.status = data.status

    db.commit()
    db.refresh(vehicle)

    return vehicle

#DELETE VEHICLE
@router.delete("/{vehicle_id}")
def delete_vehicle(
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

    db.delete(vehicle)
    db.commit()

    return {"message": "Vehicle deleted successfully"}