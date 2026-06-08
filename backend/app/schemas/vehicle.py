from pydantic import BaseModel
from typing import Optional

class VehicleCreate(BaseModel):
    name: str
    plate_number: str
    brand: str | None = None
    model: str | None = None
    year: int | None = None


class VehicleUpdate(BaseModel):
    name: Optional[str] = None
    plate_number: Optional[str] = None

    brand: str | None = None
    model: str | None = None
    year: int | None = None
    status: str | None = None

class VehicleResponse(BaseModel):
    id: int
    name: str
    plate_number: str

    brand: str | None = None
    model: str | None = None
    year: int | None = None
    status: str

    class Config:
        from_attributes = True