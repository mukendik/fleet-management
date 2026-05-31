from fastapi.testclient import TestClient
from app.main import app


client = TestClient(app)


def get_token():
    client.post("/auth/register", json={
        "email": "test@gmail.com",
        "password": "123456",
        "company_id": 1
    })

    login = client.post("/auth/login", json={
        "email": "test@gmail.com",
        "password": "123456"
    })

    return login.json()["access_token"]

def test_create_vehicle():
    token = get_token()

    response = client.post(
        "/vehicles",
        json={
            "name": "BMW X5",
            "plate_number": "AA-123-BB"
        },
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    assert response.json()["name"] == "BMW X5"

def test_update_vehicle():
    token = get_token()

    created = client.post(
        "/vehicles",
        json={
            "name": "Audi A3",
            "plate_number": "ZZ-999-ZZ"
        },
        headers={"Authorization": f"Bearer {token}"}
    )

    vehicle_id = created.json()["id"]

    response = client.put(
        f"/vehicles/{vehicle_id}",
        json={"name": "Audi A4"},
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    assert response.json()["name"] == "Audi A4"


def test_display_vehicles():
    token = get_token()

    response = client.get(
        "/vehicles",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200

def test_delete_vehicle():
    token = get_token()

    created = client.post(
        "/vehicles",
        json={
            "name": "Tesla Model 3",
            "plate_number": "TT-111-TT"
        },
        headers={"Authorization": f"Bearer {token}"}
    )

    vehicle_id = created.json()["id"]

    response = client.delete(
        f"/vehicles/{vehicle_id}",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200

    # verify deletion
    check = client.get(
        "/vehicles",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert all(v["id"] != vehicle_id for v in check.json())

def test_company_isolation():
    # Company 1
    client.post("/auth/register", json={
        "email": "user1@test.com",
        "password": "123456",
        "company_id": 1
    })

    login1 = client.post("/auth/login", json={
        "email": "user1@test.com",
        "password": "123456"
    })

    token1 = login1.json()["access_token"]

    client.post(
        "/vehicles",
        json={"name": "Car A", "plate_number": "AAA"},
        headers={"Authorization": f"Bearer {token1}"}
    )

    # Company 2
    client.post("/auth/register", json={
        "email": "user2@test.com",
        "password": "123456",
        "company_id": 2
    })

    login2 = client.post("/auth/login", json={
        "email": "user2@test.com",
        "password": "123456"
    })

    token2 = login2.json()["access_token"]

    response = client.get(
        "/vehicles",
        headers={"Authorization": f"Bearer {token2}"}
    )

    # Company 2 should NOT see Company 1 vehicles
    assert response.status_code == 200
    assert response.json() == []