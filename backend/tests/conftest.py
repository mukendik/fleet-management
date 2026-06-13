import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


from app.main import app
from app.core.database import Base, get_db


# =========================
# TEST DATABASE
# =========================
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
# (tu peux remplacer par postgres si CI docker)

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# =========================
# OVERRIDE DEPENDENCY
# =========================
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


# =========================
# FIXTURE CLIENT
# =========================
@pytest.fixture(scope="function")
def client():
    Base.metadata.create_all(bind=engine)

    with TestClient(app) as c:
        yield c

    Base.metadata.drop_all(bind=engine)


# =========================
# FIXTURES USERS TOKENS
# =========================
@pytest.fixture
def manager_token(client):
    client.post("/auth/register", json={
        "email": "manager@test.com",
        "password": "123456",
        "company_id": 1,
        "role": "manager"
    })

    res = client.post("/auth/login", json={
        "email": "manager@test.com",
        "password": "123456"
    })

    return res.json()["access_token"]


@pytest.fixture
def driver_token(client):
    client.post("/auth/register", json={
        "email": "driver@test.com",
        "password": "123456",
        "company_id": 1,
        "role": "driver"
    })

    res = client.post("/auth/login", json={
        "email": "driver@test.com",
        "password": "123456"
    })

    return res.json()["access_token"]