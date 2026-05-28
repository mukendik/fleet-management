from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    company_id: int

class UserLogin(BaseModel):
    email: EmailStr
    password: str
