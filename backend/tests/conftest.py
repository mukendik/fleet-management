import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.base import Base
from sqlalchemy.orm import Session
from sqlalchemy import text 
from app.db.session import engine, SessionLocal

from app.models.user import User
from app.models.vehicle import Vehicle

@pytest.fixture(autouse=False)
def clean_db(db_session):
    db_session.query(Vehicle).delete()
    db_session.query(User).delete()
    db_session.commit()


@pytest.fixture()
def db_session():
    connection = engine.connect()
    transaction = connection.begin()
    session = Session(bind=connection)

    #nettoyage total avant test
    connection.execute(text("TRUNCATE users, vehicles RESTART IDENTITY CASCADE"))
    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client():
    return TestClient(app)

