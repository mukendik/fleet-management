from datetime import datetime
from sqlalchemy import Column, Integer, ForeignKey, Boolean, DateTime, Index, relationship
from app.models.base import Base


class VehicleAssignment(Base):
    __tablename__ = "vehicle_assignments"

    id = Column(Integer, primary_key=True, index=True)

    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), index=True, nullable=False)
    driver_id = Column(Integer, ForeignKey("drivers.id"), index=True, nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), index=True, nullable=False)

    assigned_at = Column(DateTime, default=datetime.utcnow)
    unassigned_at = Column(DateTime, nullable=True)

    is_active = Column(Boolean, default=True, index=True)

    __table_args__ = (
        Index("ix_vehicle_driver_active", "vehicle_id", "driver_id", "is_active"),
    )

driver = relationship("Driver")
vehicle = relationship("Vehicle")