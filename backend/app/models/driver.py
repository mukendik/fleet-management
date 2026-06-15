from sqlalchemy import Column, Integer, String, ForeignKey, Date
from app.models.base import Base



class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)

    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)

    license_number = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)

    status = Column(String, default="active")  # active / inactive / suspended

    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)