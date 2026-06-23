from venv import logger

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import or_
from typing import Optional


from app.api.deps import get_db, get_current_user, require_roles
from app.models.user import User
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleResponse, VehicleUpdate
from app.services.vehicle_service import get_vehicle_by_id
from app.services.maintenance_service import MaintenanceService

router = APIRouter()


# ----------------------
# LIST
# ----------------------
@router.get("")
def get_vehicles(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    brand: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _role=Depends(require_roles(["admin", "manager"]))
):
    query = db.query(Vehicle).filter(
        Vehicle.company_id == current_user.company_id
    )

    if search:
        query = query.filter(
            or_(
                Vehicle.name.ilike(f"%{search}%"),
                Vehicle.plate_number.ilike(f"%{search}%"),
                Vehicle.vin_number.ilike(f"%{search}%")
            )
        )

    if status:
        query = query.filter(Vehicle.status == status)

    if brand:
        query = query.filter(Vehicle.brand == brand)

    total = query.count()
    items = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit
    }


# ----------------------
# CREATE
# ----------------------
@router.post("", response_model=VehicleResponse, status_code=201)
def create_vehicle(
    data: VehicleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _role=Depends(require_roles(["admin", "manager"]))
):

    existing = db.query(Vehicle).filter(
        Vehicle.plate_number == data.plate_number,
        Vehicle.company_id == current_user.company_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Plate number already exists")

    vin_number = data.vin_number.strip() if data.vin_number else None

    vehicle = Vehicle(
        name=data.name,
        plate_number=data.plate_number,
        brand=data.brand,
        model=data.model,
        year=data.year,
        mileage=data.mileage,
        fuel_type=data.fuel_type,
        transmission=data.transmission,
        vin_number=vin_number,
        registration_date=data.registration_date,
        insurance_expiry_date=data.insurance_expiry_date,
        technical_inspection_expiry_date=data.technical_inspection_expiry_date,
        status=data.status,
        company_id=current_user.company_id
    )

    db.add(vehicle)

    try:
        db.commit()
        db.refresh(vehicle)
        return vehicle

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Database integrity error")


# ----------------------
# DETAIL
# ----------------------
@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _role=Depends(require_roles(["admin", "manager"]))
):
    vehicle = get_vehicle_by_id(db, vehicle_id, current_user.company_id)

    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    return vehicle


# ----------------------
# UPDATE (FIX CRASH + SAFE ENUM)
# ----------------------
@router.put("/{vehicle_id}", response_model=VehicleResponse)
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

    # -------------------------
    # plate number uniqueness
    # -------------------------
    if data.plate_number:
        existing = db.query(Vehicle).filter(
            Vehicle.plate_number == data.plate_number,
            Vehicle.company_id == current_user.company_id,
            Vehicle.id != vehicle_id
        ).first()

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Plate number already exists"
            )

        vehicle.plate_number = data.plate_number

    # -------------------------
    # safe field update
    # -------------------------
    update_fields = [
        "name",
        "brand",
        "model",
        "year",
        "mileage",
        "fuel_type",
        "transmission",
        "status",
        "registration_date",
        "insurance_expiry_date",
        "technical_inspection_expiry_date"
    ]

    for field in update_fields:
        value = getattr(data, field)

        if value is not None:
            setattr(vehicle, field, value)

    # -------------------------
    # SAFE vin handling (FIX CRASH)
    # -------------------------
    if data.vin_number is not None:
        vin = data.vin_number.strip()
        vehicle.vin_number = vin if vin else None

    # -------------------------
    # TRACK OLD MILEAGE
    # -------------------------
    old_mileage = vehicle.mileage

    # =========================
    # MILEAGE HOOK (MAINTENANCE)
    # =========================
    if data.mileage is not None and data.mileage != old_mileage:
        try:
            MaintenanceService.on_mileage_update(db, vehicle)
        except Exception as e:
            # IMPORTANT: ne pas bloquer update vehicle
            print(f"[Maintenance Hook Error] {e}")

    # -------------------------
    # DB commit safe
    # -------------------------
    try:
        db.commit()
        db.refresh(vehicle)
        MaintenanceService.check_vehicle(db, vehicle)
        return vehicle

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Update failed: {str(e)}"
        )
# ----------------------
# DELETE
# ----------------------
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