from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import date
from enum import Enum


# ======================
# ENUMS (ALIGN BACK + FRONT)
# ======================

class VehicleStatus(str, Enum):
    active = "active"
    inactive = "inactive"
    maintenance = "maintenance"


class FuelType(str, Enum):
    diesel = "diesel"
    essence = "essence"
    electric = "electrique"
    hybrid = "hybride"


class TransmissionType(str, Enum):
    manual = "manual"
    automatic = "automatic"


# ======================
# BASE MODEL
# ======================

class VehicleBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    plate_number: str = Field(..., min_length=2, max_length=50)

    brand: str
    model: str

    year: Optional[int] = Field(None, ge=1900, le=2100)

    mileage: Optional[int] = Field(
        default=0,
        ge=0
    )

    fuel_type: Optional[FuelType] = None

    transmission: Optional[TransmissionType] = None

    status: VehicleStatus = VehicleStatus.active

    vin_number: Optional[str] = None

    registration_date: Optional[date] = None
    insurance_expiry_date: Optional[date] = None
    technical_inspection_expiry_date: Optional[date] = None

    @field_validator("plate_number")
    @classmethod
    def validate_plate(cls, v):
        if not v or not v.strip():
            raise ValueError("Plate number cannot be empty")
        return v.strip().upper()

# ======================
# CREATE
# ======================

class VehicleCreate(VehicleBase):
    pass


# ======================
# UPDATE (IMPORTANT FIX)
# ======================

class VehicleUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    plate_number: Optional[str] = Field(None, min_length=2, max_length=50)

    brand: Optional[str] = None
    model: Optional[str] = None

    year: Optional[int] = Field(None, ge=1900, le=2100)

    mileage: int = 0

    fuel_type: Optional[FuelType] = None
    transmission: Optional[TransmissionType] = None

    status: Optional[VehicleStatus] = None

    vin_number: Optional[str] = None

    registration_date: Optional[date] = None
    insurance_expiry_date: Optional[date] = None
    technical_inspection_expiry_date: Optional[date] = None



# ======================
# RESPONSE
# ======================

class VehicleResponse(VehicleBase):
    id: int
    company_id: int

    class Config:
        from_attributes = True