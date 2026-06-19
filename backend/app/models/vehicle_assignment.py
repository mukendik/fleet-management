from sqlalchemy import Column, Integer, ForeignKey, Boolean, DateTime, func, Index
from sqlalchemy.orm import relationship


from app.models.base import Base


class VehicleAssignment(Base):
    __tablename__ = "vehicle_assignments"

    id = Column(Integer, primary_key=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    driver_id = Column(Integer, ForeignKey("drivers.id"))
    company_id = Column(Integer, index=True)

    is_active = Column(Boolean, default=True)
    assigned_at = Column(DateTime, server_default=func.now(), nullable=False)
    unassigned_at = Column(DateTime)

    driver = relationship("Driver")
    vehicle = relationship("Vehicle")