from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Optional

from app.api.deps import get_db, get_current_user, require_roles
from app.models.user import User
from app.models.driver import Driver
from app.schemas.driver import DriverCreate, DriverUpdate, DriverResponse, DriverListResponse

router = APIRouter()


# ----------------------
# LIST DRIVERS
# ----------------------
@router.get("", response_model=DriverListResponse)
def get_drivers(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _role=Depends(require_roles(["admin", "manager"]))
):

    query = db.query(Driver).filter(
        Driver.company_id == current_user.company_id
    )

    if search:
        query = query.filter(
            (Driver.first_name.ilike(f"%{search}%")) |
            (Driver.last_name.ilike(f"%{search}%")) |
            (Driver.license_number.ilike(f"%{search}%"))
        )

    if status:
        query = query.filter(Driver.status == status)

    total = query.count()

    items = query.offset((page - 1) * limit).limit(limit).all()

    return DriverListResponse(
        items=items,
        total=total,
        page=page,
        limit=limit,
        pages=(total + limit - 1) // limit
    )


# ----------------------
# CREATE DRIVER
# ----------------------
@router.post("", response_model=DriverResponse, status_code=201)
def create_driver(
    data: DriverCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _role=Depends(require_roles(["admin", "manager"]))
):

    existing = db.query(Driver).filter(
        Driver.license_number == data.license_number,
        Driver.company_id == current_user.company_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "DRIVER_LICENSE_EXISTS",
                "message": "This license number is already used",
                "field": "license_number"
            }
        )

    driver = Driver(
        first_name=data.first_name,
        last_name=data.last_name,
        license_number=data.license_number,
        phone=data.phone,
        email=data.email,
        status=data.status,
        company_id=current_user.company_id
    )

    try:
        db.add(driver)
        db.commit()
        db.refresh(driver)
        return driver

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail={
                "code": "DATABASE_ERROR",
                "message": "Integrity constraint violation",
            }
        )

# ----------------------
# GET DRIVER
# ----------------------
@router.get("/{driver_id}", response_model=DriverResponse)
def get_driver(
    driver_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _role=Depends(require_roles(["admin", "manager"]))
):

    driver = db.query(Driver).filter(
        Driver.id == driver_id,
        Driver.company_id == current_user.company_id
    ).first()

    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    return driver


# ----------------------
# UPDATE DRIVER
# ----------------------
@router.put("/{driver_id}", response_model=DriverResponse)
def update_driver(
    driver_id: int,
    data: DriverUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _role=Depends(require_roles(["admin", "manager"]))
):

    driver = db.query(Driver).filter(
        Driver.id == driver_id,
        Driver.company_id == current_user.company_id
    ).first()

    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    # unique license check
    if data.license_number:
        existing = db.query(Driver).filter(
            Driver.license_number == data.license_number,
            Driver.company_id == current_user.company_id,
            Driver.id != driver_id
        ).first()

        if existing:
            raise HTTPException(
                status_code=400,
                detail="License number already exists"
            )

        driver.license_number = data.license_number

    for field in ["first_name", "last_name", "phone", "email", "status"]:
        value = getattr(data, field, None)
        if value is not None:
            setattr(driver, field, value)

    try:
        db.commit()
        db.refresh(driver)
        return driver

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Database integrity error"
        )


# ----------------------
# DELETE DRIVER
# ----------------------
@router.delete("/{driver_id}")
def delete_driver(
    driver_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _role=Depends(require_roles(["admin", "manager"]))
):

    driver = db.query(Driver).filter(
        Driver.id == driver_id,
        Driver.company_id == current_user.company_id
    ).first()

    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    db.delete(driver)
    db.commit()

    return {"message": "Driver deleted successfully"}