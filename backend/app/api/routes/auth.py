from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.api.deps import get_current_user
from app.services.auth_service import authenticate_user
from app.schemas.user import UserCreate, UserLogin
from app.schemas.auth import (
    Token,
    UserLogin,
    RefreshRequest,
    AuthUser,
)
from app.core.security import (
    create_access_token,
    create_refresh_token,
    verify_refresh_token,
    hash_password
)

from jose import jwt
from app.core.config import settings

router = APIRouter()


# =========================
# REGISTER
# =========================
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.email == user.email).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(
        email=user.email,
        hashed_password=hash_password(user.password),
        company_id=user.company_id,
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# =========================
# LOGIN (V2 CLEAN)
# =========================
@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):

    user = authenticate_user(
        db,
        user_data.email,
        user_data.password
    )

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({
        "sub": user.email,
        "role": user.role
    })

    refresh_token = create_refresh_token({
        "sub": user.email
    })

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=AuthUser(
            id=user.id,
            email=user.email,
            role=user.role,
            company_id=user.company_id
        )
    )


# =========================
# ME
# =========================
from app.schemas.user import UserOut

@router.get("/me", response_model=UserOut)
def read_me(current_user: User = Depends(get_current_user)):
    return current_user


# =========================
# REFRESH
# =========================
@router.post("/refresh")
def refresh_token(payload: RefreshRequest, db: Session = Depends(get_db)):

    data = verify_refresh_token(payload.refresh_token)

    if not data:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user = db.query(User).filter(User.email == data["sub"]).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_access_token = create_access_token({
        "sub": user.email,
        "role": user.role
    })

    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }