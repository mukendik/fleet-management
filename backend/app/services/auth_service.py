from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.auth import UserRegister
from app.core.security import hash_password


def create_user(db: Session, user_data: UserRegister):

    user = User(
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        company_id=user_data.company_id,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user
