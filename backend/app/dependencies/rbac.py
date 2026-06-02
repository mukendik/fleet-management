from fastapi import Depends, HTTPException
from app.core.security import get_current_user
from app.models.user import UserRole


def require_roles(*allowed_roles: UserRole):
    def wrapper(user=Depends(get_current_user)):
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail="Not enough permissions"
            )
        return user
    return wrapper