from pydantic import BaseModel, EmailStr


# =========================
# LOGIN INPUT
# =========================
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# =========================
# USER RETURNED IN LOGIN
# =========================
class AuthUser(BaseModel):
    id: int
    email: str
    role: str
    company_id: int


# =========================
# TOKEN RESPONSE (CLEAN SAAS)
# =========================
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    user: AuthUser


# =========================
# REFRESH
# =========================
class RefreshRequest(BaseModel):
    refresh_token: str