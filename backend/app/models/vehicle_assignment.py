from sqlalchemy import Column, Integer, ForeignKey, Boolean, DateTime, func, Index
from sqlalchemy.orm import relationship

from app.models.base import Base


class VehicleAssignment(Base):
    __tablename__ = "vehicle_assignments"

    id = Column(Integer, primary_key=True)

    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), index=True)
    driver_id = Column(Integer, ForeignKey("drivers.id"), index=True)
    company_id = Column(Integer, index=True)

    is_active = Column(Boolean, default=True, index=True)

    assigned_at = Column(DateTime, server_default=func.now(), nullable=False)
    unassigned_at = Column(DateTime, nullable=True)

    driver = relationship("Driver")
    vehicle = relationship("Vehicle")

    __table_args__ = (
            Index("ix_va_company_vehicle_active", "company_id", "vehicle_id", "is_active"),
            Index("ix_va_vehicle_date", "vehicle_id", "assigned_at"),
        )


# =========================
# INDEX (PERF SaaS)
# =========================
Index("ix_va_company", VehicleAssignment.company_id)
Index("ix_va_vehicle", VehicleAssignment.vehicle_id)
Index("ix_va_driver", VehicleAssignment.driver_id)
Index("ix_va_active", VehicleAssignment.is_active)