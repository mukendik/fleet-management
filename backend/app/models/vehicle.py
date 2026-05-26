from sqlalchemy import Column, Integer, String, ForeignKey
from app.models.base import Base

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    plate_number = Column(String, unique=True, nullable=False)

    company_id = Column(Integer, ForeignKey("companies.id"))
