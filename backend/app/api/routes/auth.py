from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User

from app.schemas.auth import UserRegister, UserLogin, Token
from app.schemas.user import UserLogin

from app.services.auth_service import create_user
from app.services.auth_service import authenticate_user

from app.core.security import create_access_token

from app.core.security import (
    verify_password,
    create_access_token,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    user = create_user(db, user_data)

    return {"message": "user created"}

@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):

        user = authenticate_user(
             db,
             user_data.email,
             user_data.password
        )

        if not user:
           raise HTTPException(status_code=401, detail="Invalid credentials")

        
       token = create_access_token({"sub": user.email})

       return {
           "access_token": token,
           "token_type": "bearer",
       }
