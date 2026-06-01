import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.base import Base
from app.db.session import engine


@pytest.fixture(scope="function")
def db_session():
    connection = engine.connect()
    transaction = connection.begin()

    session = Session(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client():
    return TestClient(app)