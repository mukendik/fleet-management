from pydantic import BaseModel
from typing import Optional
from datetime import date


# =========================
# BASE
# =========================
class VehicleBase(BaseModel):
    name: str
    plate_number: str

    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None

    status: str = "active"


# =========================
# CREATE
# =========================
class VehicleCreate(VehicleBase):
    vin_number: Optional[str] = None
    mileage: int = 0

    fuel_type: Optional[str] = None
    transmission: Optional[str] = None
    engine: Optional[str] = None
    engine_capacity: Optional[int] = None

    registration_date: Optional[date] = None
    insurance_expiry_date: Optional[date] = None
    technical_inspection_expiry_date: Optional[date] = None

    class Config:
        json_schema_extra = {
            "example": {
                "name": "BMW X5",
                "plate_number": "AA-123-BB",
                "brand": "BMW",
                "model": "X5",
                "year": 2024,
                "mileage": 120000,
                "fuel_type": "diesel",
                "status": "active"
            }
        }


# =========================
# UPDATE (IMPORTANT: ALL OPTIONAL)
# =========================
class VehicleUpdate(BaseModel):
    name: Optional[str] = None
    plate_number: Optional[str] = None

    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None

    status: Optional[str] = None

    vin_number: Optional[str] = None
    mileage: Optional[int] = None

    fuel_type: Optional[str] = None
    transmission: Optional[str] = None
    engine: Optional[str] = None
    engine_capacity: Optional[int] = None

    registration_date: Optional[date] = None
    insurance_expiry_date: Optional[date] = None
    technical_inspection_expiry_date: Optional[date] = None


# =========================
# RESPONSE (API OUTPUT)
# =========================
class VehicleResponse(VehicleBase):
    id: int

    vin_number: Optional[str] = None
    mileage: int = 0

    fuel_type: Optional[str] = None
    transmission: Optional[str] = None
    engine: Optional[str] = None
    engine_capacity: Optional[int] = None

    registration_date: Optional[date] = None
    insurance_expiry_date: Optional[date] = None
    technical_inspection_expiry_date: Optional[date] = None

    class Config:
        from_attributes = True


# =========================
# LIST RESPONSE (PAGINATION)
# =========================
class VehicleListResponse(BaseModel):
    items: list[VehicleResponse]
    total: int
    page: int
    size: int
    pages: int