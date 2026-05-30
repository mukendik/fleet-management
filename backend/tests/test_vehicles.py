from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_vehicles():

    client.post("/auth/register", json={
        "email": "test@gmail.com",
        "password": "123456",
        "company_id": 1
    })

    login = client.post("/auth/login", json={
        "email": "test@gmail.com",
        "password": "123456"
    })

    assert login.status_code == 200, login.json()

    token = login.json()["access_token"]

    response = client.get(
        "/vehicles",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200