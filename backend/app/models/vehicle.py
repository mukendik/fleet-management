from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    ForeignKey,
    Index,
)

from app.models.base import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    plate_number = Column(
        String,
        nullable=False,
        unique=True,
        index=True,
    )

    vin_number = Column(
        String,
        unique=True,
        index=True,
        nullable=True,
    )

    company_id = Column(
        Integer,
        ForeignKey("companies.id"),
        index=True,
    )

    brand = Column(String)
    model = Column(String)

    year = Column(Integer)

    mileage = Column(Integer, default=0)

    fuel_type = Column(String)

    registration_date = Column(Date)
    insurance_expiry_date = Column(Date)
    technical_inspection_expiry_date = Column(Date)

    status = Column(
        String,
        default="active",
        index=True,
    )

    __table_args__ = (
        Index(
            "ix_vehicle_company_plate",
            "company_id",
            "plate_number",
        ),
    )