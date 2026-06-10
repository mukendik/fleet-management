from pydantic import BaseModel
from typing import Optional
from typing import List

class VehicleCreate(BaseModel):
    name: str
    plate_number: str
    brand: str | None = None
    model: str | None = None
    year: int | None = None
    status: str = "active"

    class Config:
        json_schema_extra = {
            "example": {
                "name": "BMW X5",
                "plate_number": "AA-123-BB",
                "brand": "BMW",
                "model": "X5",
                "year": 2024,
                "status": "active"
            }
        }


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

class VehicleListResponse(BaseModel):
    items: list[VehicleResponse]
    total: int
    page: int
    size: int
    pages: int