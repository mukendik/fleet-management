from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class AssignmentCreate(BaseModel):
    vehicle_id: int
    driver_id: int


class AssignmentResponse(BaseModel):
    id: int
    vehicle_id: int
    driver_id: int
    company_id: int
    assigned_at: datetime
    unassigned_at: Optional[datetime]
    is_active: bool

    class Config:
        from_attributes = True