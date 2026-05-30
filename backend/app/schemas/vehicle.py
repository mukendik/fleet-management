from pydantic import BaseModel
from typing import Optional

class VehicleCreate(BaseModel):
    name: str
    plate_number: str


class VehicleUpdate(BaseModel):
    name: Optional[str] = None
    plate_number: Optional[str] = None