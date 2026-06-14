from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from enum import Enum


# ----------------------
# ENUMS
# ----------------------

class VehicleStatus(str, Enum):
    active = "active"
    out_of_service = "out_of_service"
    maintenance = "maintenance"


class FuelType(str, Enum):
    diesel = "diesel"
    petrol = "petrol"
    electric = "electric"
    hybrid = "hybrid"


class TransmissionType(str, Enum):
    manual = "manual"
    automatic = "automatic"


# ----------------------
# BASE
# ----------------------

class VehicleBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)

    plate_number: str = Field(
        ...,
        min_length=2,
        max_length=50
    )

    brand: str
    model: str

    year: int = Field(..., ge=1900, le=2100)

    mileage: int = 0

    fuel_type: FuelType

    transmission: Optional[TransmissionType] = None

    status: VehicleStatus = VehicleStatus.active

    vin_number: Optional[str] = None

    registration_date: Optional[date] = None
    insurance_expiry_date: Optional[date] = None
    technical_inspection_expiry_date: Optional[date] = None


# ----------------------
# CREATE
# ----------------------

class VehicleCreate(VehicleBase):
    pass


# ----------------------
# UPDATE
# ----------------------

class VehicleUpdate(BaseModel):
    name: Optional[str] = None

    plate_number: Optional[str] = Field(
        default=None,
        max_length=50
    )

    brand: Optional[str] = None
    model: Optional[str] = None

    year: Optional[int] = None
    mileage: Optional[int] = None

    fuel_type: Optional[FuelType] = None

    transmission: Optional[TransmissionType] = None

    status: Optional[VehicleStatus] = None

    vin_number: Optional[str] = None

    registration_date: Optional[date] = None
    insurance_expiry_date: Optional[date] = None
    technical_inspection_expiry_date: Optional[date] = None


# ----------------------
# RESPONSE
# ----------------------

class VehicleResponse(VehicleBase):
    id: int
    company_id: int

    class Config:
        from_attributes = True