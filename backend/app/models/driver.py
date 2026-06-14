from sqlalchemy import Column, Integer, String, Date, Enum, ForeignKey
from app.db.base import Base
import enum


class DriverStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"


class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)

    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)

    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)

    license_number = Column(String, nullable=False)
    license_expiry_date = Column(Date, nullable=True)

    status = Column(Enum(DriverStatus), default=DriverStatus.active)

    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)