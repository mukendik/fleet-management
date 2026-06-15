from pydantic import BaseModel, Field
from typing import Optional


# ----------------------
# BASE
# ----------------------
class DriverBase(BaseModel):
    first_name: str = Field(..., min_length=2, max_length=50)
    last_name: str = Field(..., min_length=2, max_length=50)

    license_number: str = Field(..., min_length=3, max_length=50)

    phone: Optional[str] = None
    email: Optional[str] = None

    status: str = "active"


# ----------------------
# CREATE
# ----------------------
class DriverCreate(DriverBase):
    pass


# ----------------------
# UPDATE
# ----------------------
class DriverUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None

    license_number: Optional[str] = None

    phone: Optional[str] = None
    email: Optional[str] = None

    status: Optional[str] = None


# ----------------------
# RESPONSE
# ----------------------
class DriverResponse(DriverBase):
    id: int
    company_id: int

    class Config:
        from_attributes = True