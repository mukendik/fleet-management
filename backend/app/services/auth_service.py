from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import hash_password
from app.core.security import verify_password

def create_user(db: Session, user_data: UserCreate):

    user = User(
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        company_id=user_data.company_id,
        role="driver"  # default safe role
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

def authenticate_user(
            db: Session,
            email: str,
            password: str
):
            user = db.query(User).filter(User.email == email).first()

            if not user:
                return None

            if not verify_password(password, user.hashed_password):
                return None

            return user
