from pydantic import BaseModel
from typing import Optional, List
from datetime import date


# =========================
# VEHICLE CREATE
# =========================
class VehicleCreate(BaseModel):
    name: str
    plate_number: str

    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None

    vin_number: Optional[str] = None
    mileage: int = 0

    fuel_type: Optional[str] = None
    transmission: Optional[str] = None
    engine: Optional[str] = None
    engine_capacity: Optional[int] = None

    registration_date: Optional[date] = None
    insurance_expiry_date: Optional[date] = None
    technical_inspection_expiry_date: Optional[date] = None

    status: str = "active"

    class Config:
        json_schema_extra = {
            "example": {
                "name": "BMW X5",
                "plate_number": "AA-123-BB",
                "brand": "BMW",
                "model": "X5",
                "year": 2024,
                "vin_number": "WBA123456789",
                "mileage": 120000,
                "fuel_type": "diesel",
                "transmission": "automatic",
                "engine": "3.0L",
                "engine_capacity": 3000,
                "registration_date": "2024-01-01",
                "insurance_expiry_date": "2025-01-01",
                "technical_inspection_expiry_date": "2025-06-01",
                "status": "active"
            }
        }


# =========================
# VEHICLE UPDATE
# =========================
class VehicleUpdate(BaseModel):
    name: Optional[str] = None
    plate_number: Optional[str] = None

    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None

    vin_number: Optional[str] = None
    mileage: Optional[int] = None

    fuel_type: Optional[str] = None
    transmission: Optional[str] = None
    engine: Optional[str] = None
    engine_capacity: Optional[int] = None

    registration_date: Optional[date] = None
    insurance_expiry_date: Optional[date] = None
    technical_inspection_expiry_date: Optional[date] = None

    status: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "name": "BMW X5 Updated",
                "mileage": 130000,
                "status": "inactive"
            }
        }


# =========================
# VEHICLE RESPONSE
# =========================
class VehicleResponse(BaseModel):
    id: int

    name: str
    plate_number: str

    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None

    vin_number: Optional[str] = None
    mileage: int = 0

    fuel_type: Optional[str] = None
    transmission: Optional[str] = None
    engine: Optional[str] = None
    engine_capacity: Optional[int] = None

    registration_date: Optional[date] = None
    insurance_expiry_date: Optional[date] = None
    technical_inspection_expiry_date: Optional[date] = None

    status: str

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "name": "BMW X5",
                "plate_number": "AA-123-BB",
                "brand": "BMW",
                "model": "X5",
                "year": 2024,
                "vin_number": "WBA123456789",
                "mileage": 120000,
                "fuel_type": "diesel",
                "transmission": "automatic",
                "engine": "3.0L",
                "engine_capacity": 3000,
                "registration_date": "2024-01-01",
                "insurance_expiry_date": "2025-01-01",
                "technical_inspection_expiry_date": "2025-06-01",
                "status": "active"
            }
        }


# =========================
# VEHICLE LIST RESPONSE (PAGINATION)
# =========================
class VehicleListResponse(BaseModel):
    items: List[VehicleResponse]
    total: int
    page: int
    limit: int
    pages: int