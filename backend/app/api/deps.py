from fastapi import Depends, HTTPException, status
from app.core.security import oauth2_scheme
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.config import settings
from app.db.session import get_db
from app.models.user import User, UserRole




def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        # IMPORTANT
        token_type = payload.get("type")

        if token_type != "access":
            raise credentials_exception

        email: str = payload.get("sub")

        if email is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(
        User.email == email
    ).first()

    if user is None:
        raise credentials_exception
    
    return user

from fastapi import Depends, HTTPException, status

def require_roles(allowed_roles: list[str]):

    def wrapper(current_user: User = Depends(get_current_user)):

        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail="Access forbidden"
            )

        return current_user

    return wrapper