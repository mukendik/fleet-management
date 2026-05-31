from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User

from app.api.deps import get_current_user

#from app.schemas.auth import UserRegister, UserLogin, Token
from app.schemas.user import UserCreate, UserLogin
from app.schemas.auth import Token
#from app.schemas.user import UserLogin

from app.services.auth_service import create_user
from app.services.auth_service import authenticate_user

from app.core.security import (
    create_access_token,
    create_refresh_token
)

from app.core.security import hash_password

from app.core.security import (
    verify_password,
    create_access_token,
)

router = APIRouter(prefix="/auth", tags=["auth"])

# REGISTER
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.email == user.email).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(
        email=user.email,
        hashed_password=hash_password(user.password),
        company_id=user.company_id
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# LOGIN
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
    "sub": user.email
})

    refresh_token = create_refresh_token({
    "sub": user.email
})

    return {
    "access_token": access_token,
    "refresh_token": refresh_token,
    "token_type": "bearer",
}

# ME (SaaS READY)
@router.get("/me")
def read_me(current_user: User = Depends(get_current_user)):
    return current_user
