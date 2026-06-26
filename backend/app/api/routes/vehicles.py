from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import Optional

from app.api.deps import get_db, get_current_user, require_roles
from app.models.user import User
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleResponse, VehicleUpdate
from app.services.vehicle_service import get_vehicle_by_id

from app.services.intelligence.maintenance_service import MaintenanceRule
from app.services.intelligence.engine import build_vehicle_intelligence

router = APIRouter()


# =========================
# LIST VEHICLES
# =========================
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


# =========================
# CREATE VEHICLE
# =========================
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

    vehicle = Vehicle(
        **data.model_dump(),
        company_id=current_user.company_id
    )

    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)

    return vehicle


# =========================
# GET BY ID
# =========================
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


# =========================
# UPDATE VEHICLE
# =========================
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

    old_mileage = vehicle.mileage

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(vehicle, key, value)

    # =========================
    # MAINTENANCE HOOK SAFE
    # =========================
    if data.mileage is not None and data.mileage != old_mileage:
        try:
            MaintenanceRule.on_mileage_update(db, vehicle)
        except Exception as e:
            print(f"[Maintenance Error] {e}")

    db.commit()
    db.refresh(vehicle)

    # Intelligence after commit
    try:
        FleetIntelligenceEngine.analyze_vehicle(db, vehicle)
    except Exception as e:
        print(f"[Intelligence Error] {e}")

    return vehicle


# =========================
# DELETE VEHICLE
# =========================
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