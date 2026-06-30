from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    DateTime,
    ForeignKey,
    Index,
)
from sqlalchemy import func
from sqlalchemy.orm import relationship
from app.models.base import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    plate_number = Column(String, nullable=False, unique=True, index=True)

    vin_number = Column(String, unique=True, index=True, nullable=True)

    company_id = Column(Integer, ForeignKey("companies.id"), index=True)

    brand = Column(String, nullable=False)
    model = Column(String, nullable=False)

    year = Column(Integer, nullable=True)
    mileage = Column(Integer, default=0)

    fuel_type = Column(String, nullable=False)
    transmission = Column(
        String,
        default="automatic",
        index=True
    )

    registration_date = Column(Date, nullable=True)
    insurance_expiry_date = Column(Date, nullable=True)
    technical_inspection_expiry_date = Column(
        Date,
        nullable=True
    )

    status = Column(String, default="active", index=True)

    # =========================
    # MAINTENANCE SYSTEM (MVP)
    # =========================

    last_service_km = Column(Integer, default=0)
    last_service_date = Column(DateTime, nullable=True)

    next_service_km = Column(Integer, nullable=True)

    next_inspection_date = Column(Date, nullable=True)
    next_insurance_date = Column(Date, nullable=True)

    __table_args__ = (
        Index("ix_vehicle_company_plate", "company_id", "plate_number"),
    )

assignments = relationship(
    "VehicleAssignment",
    back_populates="vehicle"
)