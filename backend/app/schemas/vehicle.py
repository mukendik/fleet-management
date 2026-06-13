from enum import Enum
from datetime import date
from typing import Optional, List

from pydantic import BaseModel, ConfigDict


class VehicleStatus(str, Enum):
    active = "active"
    maintenance = "maintenance"
    out_of_service = "out_of_service"


class FuelType(str, Enum):
    essence = "essence"
    diesel = "diesel"
    electric = "electric"
    hybrid = "hybrid"


class VehicleCreate(BaseModel):
    name: str
    plate_number: str

    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None

    vin_number: Optional[str] = None
    mileage: int = 0

    fuel_type: Optional[FuelType] = None

    registration_date: Optional[date] = None
    insurance_expiry_date: Optional[date] = None
    technical_inspection_expiry_date: Optional[date] = None

    status: VehicleStatus = VehicleStatus.active


class VehicleUpdate(BaseModel):
    name: Optional[str] = None
    plate_number: Optional[str] = None

    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None

    vin_number: Optional[str] = None
    mileage: Optional[int] = None

    fuel_type: Optional[FuelType] = None

    registration_date: Optional[date] = None
    insurance_expiry_date: Optional[date] = None
    technical_inspection_expiry_date: Optional[date] = None

    status: Optional[VehicleStatus] = None


class VehicleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int

    name: str
    plate_number: str

    brand: Optional[str]
    model: Optional[str]
    year: Optional[int]

    vin_number: Optional[str]
    mileage: int

    fuel_type: Optional[FuelType]

    registration_date: Optional[date]
    insurance_expiry_date: Optional[date]
    technical_inspection_expiry_date: Optional[date]

    status: VehicleStatus


class VehicleListResponse(BaseModel):
    items: List[VehicleResponse]
    total: int
    page: int
    limit: int
    pages: int