from sqlalchemy import Column, Integer, String, Date, ForeignKey, Index, UniqueConstraint
from app.models.base import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)

    # =====================
    # IDENTITÉ
    # =====================
    name = Column(String, nullable=False)

    plate_number = Column(String, nullable=False, unique=True, index=True)

    vin_number = Column(String, unique=True, index=True, nullable=True)

    company_id = Column(Integer, ForeignKey("companies.id"), index=True)

    # =====================
    # BASIC INFO
    # =====================
    brand = Column(String, nullable=True)
    model = Column(String, nullable=True)
    year = Column(Integer, nullable=True)

    mileage = Column(Integer, default=0)

    # =====================
    # TECHNICAL
    # =====================
    fuel_type = Column(String, nullable=True)
    transmission = Column(String, nullable=True)

    engine = Column(String, nullable=True)
    engine_capacity = Column(Integer, nullable=True)

    # =====================
    # DATES
    # =====================
    registration_date = Column(Date, nullable=True)
    insurance_expiry_date = Column(Date, nullable=True)
    technical_inspection_expiry_date = Column(Date, nullable=True)

    # =====================
    # STATUS
    # =====================
    status = Column(String, default="active", index=True)


    # =====================
    # INDEXES (PERF SaaS)
    # =====================
    __table_args__ = (
        Index("ix_vehicle_company_plate", "company_id", "plate_number"),
    )