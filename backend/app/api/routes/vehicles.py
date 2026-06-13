from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import or_

from app.api.deps import (
    get_db,
    get_current_user,
    require_roles,
)

from app.models.user import User
from app.models.vehicle import Vehicle

from app.schemas.vehicle import (
    VehicleCreate,
    VehicleUpdate,
    VehicleResponse,
    VehicleListResponse,
)

router = APIRouter()


# =========================================================
# LIST VEHICLES
# =========================================================
@router.get(
    "",
    response_model=VehicleListResponse
)
def get_vehicles(
    page: int = Query(
        1,
        ge=1,
        description="Page number"
    ),
    limit: int = Query(
        10,
        ge=1,
        le=100,
        description="Items per page"
    ),

    search: Optional[str] = None,
    status: Optional[str] = None,
    brand: Optional[str] = None,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    ),

    _role=Depends(
        require_roles(
            ["admin", "manager"]
        )
    )
):
    query = db.query(Vehicle).filter(
        Vehicle.company_id == current_user.company_id
    )

    if search:
        query = query.filter(
            or_(
                Vehicle.name.ilike(f"%{search}%"),
                Vehicle.plate_number.ilike(f"%{search}%")
            )
        )

    if status:
        query = query.filter(
            Vehicle.status == status
        )

    if brand:
        query = query.filter(
            Vehicle.brand.ilike(f"%{brand}%")
        )

    total = query.count()

    vehicles = (
        query
        .order_by(Vehicle.id.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "items": vehicles,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (
            (total + limit - 1) // limit
        )
    }


# =========================================================
# CREATE VEHICLE
# =========================================================
@router.post(
    "",
    response_model=VehicleResponse,
    status_code=201
)
def create_vehicle(
    data: VehicleCreate,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    ),

    _role=Depends(
        require_roles(
            ["admin", "manager"]
        )
    )
):
    vehicle = Vehicle(
        name=data.name,
        plate_number=data.plate_number,

        brand=data.brand,
        model=data.model,
        year=data.year,

        vin_number=data.vin_number,
        mileage=data.mileage,

        fuel_type=(
            data.fuel_type.value
            if data.fuel_type
            else None
        ),

        registration_date=data.registration_date,
        insurance_expiry_date=data.insurance_expiry_date,
        technical_inspection_expiry_date=data.technical_inspection_expiry_date,

        status=data.status.value,

        company_id=current_user.company_id,
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


# =========================================================
# GET VEHICLE DETAIL
# =========================================================
@router.get(
    "/{vehicle_id}",
    response_model=VehicleResponse
)
def get_vehicle(
    vehicle_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    ),

    _role=Depends(
        require_roles(
            ["admin", "manager"]
        )
    )
):
    vehicle = (
        db.query(Vehicle)
        .filter(
            Vehicle.id == vehicle_id,
            Vehicle.company_id == current_user.company_id
        )
        .first()
    )

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    return vehicle


# =========================================================
# UPDATE VEHICLE
# =========================================================
@router.put(
    "/{vehicle_id}",
    response_model=VehicleResponse
)
def update_vehicle(
    vehicle_id: int,

    data: VehicleUpdate,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    ),

    _role=Depends(
        require_roles(
            ["admin", "manager"]
        )
    )
):
    vehicle = (
        db.query(Vehicle)
        .filter(
            Vehicle.id == vehicle_id,
            Vehicle.company_id == current_user.company_id
        )
        .first()
    )

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    update_data = data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():

        if hasattr(value, "value"):
            value = value.value

        setattr(vehicle, field, value)

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


# =========================================================
# DELETE VEHICLE
# =========================================================
@router.delete("/{vehicle_id}")
def delete_vehicle(
    vehicle_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    ),

    _role=Depends(
        require_roles(
            ["admin", "manager"]
        )
    )
):
    vehicle = (
        db.query(Vehicle)
        .filter(
            Vehicle.id == vehicle_id,
            Vehicle.company_id == current_user.company_id
        )
        .first()
    )

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    db.delete(vehicle)
    db.commit()

    return {
        "message": "Vehicle deleted successfully"
    }