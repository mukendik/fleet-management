from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    company_id: int


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
