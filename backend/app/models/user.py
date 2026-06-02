from sqlalchemy import Column, Integer, String, ForeignKey
from app.models.base import Base
from app.core.roles import Role
import enum

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    company_id = Column(Integer, ForeignKey("companies.id"))

    role = Column(String, default=Role.DRIVER.value)

    class UserRole(str, enum.Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    USER = "user"