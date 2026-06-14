from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional

from app.api.deps import get_db, get_current_user, require_roles
from app.models.driver import Driver
from app.models.user import User
from app.schemas.driver import DriverCreate, DriverUpdate, DriverResponse

router = APIRouter(prefix="/drivers", tags=["Drivers"])


# ----------------------
# LIST
# ----------------------
@router.get("")
def get_drivers(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _role=Depends(require_roles(["admin", "manager"]))
):
    query = db.query(Driver).filter(
        Driver.company_id == current_user.company_id
    )

    if search:
        query = query.filter(
            or_(
                Driver.first_name.ilike(f"%{search}%"),
                Driver.last_name.ilike(f"%{search}%"),
                Driver.license_number.ilike(f"%{search}%")
            )
        )

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
        raise HTTPException(status_code=400, detail="Driver already exists")

    driver = Driver(
        **data.dict(),
        company_id=current_user.company_id
    )

    db.add(driver)
    db.commit()
    db.refresh(driver)

    return driver


# ----------------------
# DETAIL
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
# UPDATE
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

    for field, value in data.dict(exclude_unset=True).items():
        setattr(driver, field, value)

    db.commit()
    db.refresh(driver)

    return driver


# ----------------------
# DELETE
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