from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from enum import Enum


class DriverStatus(str, Enum):
    active = "active"
    inactive = "inactive"


# BASE
class DriverBase(BaseModel):
    first_name: str = Field(..., min_length=2)
    last_name: str = Field(..., min_length=2)

    phone: Optional[str] = None
    email: Optional[str] = None

    license_number: str

    license_expiry_date: Optional[date] = None
    status: DriverStatus = DriverStatus.active


# CREATE
class DriverCreate(DriverBase):
    pass


# UPDATE
class DriverUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None

    phone: Optional[str] = None
    email: Optional[str] = None

    license_number: Optional[str] = None
    license_expiry_date: Optional[date] = None

    status: Optional[DriverStatus] = None


# RESPONSE
class DriverResponse(DriverBase):
    id: int
    company_id: int

    class Config:
        from_attributes = True