from sqlalchemy import (
    Column,
    Integer,
    String,
    Index,
)

from app.models.base import Base


class MaintenanceRule(Base):
    __tablename__ = "maintenance_rules"

    id = Column(Integer, primary_key=True)

    company_id = Column(
        Integer,
        nullable=False,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    interval_km = Column(
        Integer,
        nullable=False
    )

    warning_before_km = Column(
        Integer,
        default=1000,
        nullable=False
    )

    __table_args__ = (
        Index(
            "ix_maintenance_rule_company_name",
            "company_id",
            "name"
        ),
    )