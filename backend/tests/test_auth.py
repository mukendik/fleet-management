import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


# ---------------------------
# HELPERS
# ---------------------------

def register_user(email, password="123456", company_id=1, role="manager"):
    return client.post("/auth/register", json={
        "email": email,
        "password": password,
        "company_id": company_id,
        "role": role
    })


def login_user(email, password="123456"):
    return client.post("/auth/login", json={
        "email": email,
        "password": password
    })


# ---------------------------
# AUTH TESTS
# ---------------------------

def test_register_success():
    response = register_user("manager@test.com")

    # accepte 200 ou 201 selon ton backend
    assert response.status_code in [200, 201]


def test_login_success():
    register_user("login@test.com")

    response = login_user("login@test.com")

    assert response.status_code == 200
    data = response.json()

    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


def test_refresh_token():
    register_user("refresh@test.com")

    login = login_user("refresh@test.com")
    refresh_token = login.json()["refresh_token"]

    response = client.post("/auth/refresh", json={
        "refresh_token": refresh_token
    })

    assert response.status_code == 200
    body = response.json()

    assert "access_token" in body
    assert body["token_type"] == "bearer"


def test_login_wrong_password():
    register_user("wrongpass@test.com")

    response = login_user("wrongpass@test.com", password="badpassword")

    assert response.status_code == 401


def test_register_duplicate_email():
    register_user("duplicate@test.com")

    response = register_user("duplicate@test.com")

    assert response.status_code in [400, 409]


def test_me_endpoint(manager_token):
    # nécessite fixture manager_token dans conftest.py
    response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {manager_token}"}
    )

    assert response.status_code == 200
    data = response.json()

    assert "email" in data