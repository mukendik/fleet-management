from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
    Index,
)

from app.models.base import Base


class MaintenanceAlert(Base):
    __tablename__ = "maintenance_alerts"

    id = Column(Integer, primary_key=True)

    vehicle_id = Column(
        Integer,
        ForeignKey("vehicles.id"),
        nullable=False,
        index=True
    )

    company_id = Column(
        Integer,
        nullable=False,
        index=True
    )

    rule_name = Column(
        String,
        nullable=False
    )

    due_km = Column(
        Integer,
        nullable=False
    )

    current_km = Column(
        Integer,
        nullable=False
    )

    severity = Column(
        String,
        default="warning",
        nullable=False
    )

    resolved = Column(
        Boolean,
        default=False,
        nullable=False,
        index=True
    )

    __table_args__ = (
        Index(
            "ix_alert_company_resolved",
            "company_id",
            "resolved"
        ),
    )