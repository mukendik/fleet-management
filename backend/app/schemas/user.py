from pydantic import BaseModel, EmailStr


# =========================
# CREATE USER (REGISTER)
# =========================
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    company_id: int
    role: str = "driver"


# =========================
# LOGIN
# =========================
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# =========================
# OUTPUT (SAFE USER DATA)
# =========================
class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    company_id: int

    class Config:
        from_attributes = True