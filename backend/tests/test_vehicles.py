from fastapi.testclient import TestClient
from app.main import app
from app.db.session import get_db
from uuid import uuid4



client = TestClient(app)

def get_manager_token():
    response = client.post(
        "/auth/login",
        json={
            "email": "manager@gmail.com",
            "password": "123456",
            "company_id": 1,
            "role": "manager"
        }
    )

    return response.json()["access_token"]

def get_driver_token():
    response = client.post(
        "/auth/login",
        json={
            "email": "driver@gmail.com",
            "password": "123456"
        }
    )

    return response.json()["access_token"]

def test_create_vehicle():
    token = get_manager_token()
    response = client.post(
        "/vehicles",
        json={
            "name": "BMW X5",
            "plate_number": "AA-123-BB",
            "status": "active"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["name"] == "BMW X5"

def test_driver_create_vehicle():
    token = get_driver_token()
    response = client.post(
        "/vehicles",
        json={
            "name": "BMW X5",
            "plate_number": "AA-123-BB"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 403

def test_update_vehicle():
    token = get_manager_token()

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
    token = get_manager_token()

    response = client.get(
        "/vehicles",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200

def test_driver_display_vehicles():
    token = get_driver_token()

    response = client.get(
        "/vehicles",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 403

def test_delete_vehicle():
    token = get_manager_token()

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

    assert all(v["id"] != vehicle_id for v in check.json()["items"])

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
        "company_id": 2,
        "role": "admin"
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
    data = response.json()

    assert response.status_code == 200
    assert data["items"] == []
    assert data["total"] == 0
    assert data["page"] == 1

def test_vehicle_pagination():

    token = get_manager_token()

    # create vehicles
    for i in range(15):
        client.post(
            "/vehicles",
            json={
                "name": f"Vehicle {i}",
                "plate_number": f"AA-{i}-{uuid4()}",
                "status": "active"
            },
    headers={"Authorization": f"Bearer {token}"}
    )

    response = client.get(
        "/vehicles?page=1&limit=10",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )
    print(response.json())
    assert response.status_code == 200

    data = response.json()

    assert "items" in data
    assert len(data["items"]) == 10
    assert data["page"] == 1
    assert data["limit"] == 10
    assert data["total"] == 17
    assert data["pages"] == 2

def test_vehicle_search():

    token = get_manager_token()

    for i in range(15):
      client.post(
        "/vehicles",
        json={
            "name": f"Vehicle {i}",
            "plate_number": f"AA-{i}-BB",
            "status": "active"
        },
    headers={"Authorization": f"Bearer {token}"}
    )
    client.post(
    "/vehicles",
    json={
        "name": "Audi A4",
        "plate_number": "AUDI-001"
    },
    headers={"Authorization": f"Bearer {token}"}
    )
    response = client.get(
        "/vehicles?search=BMW",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )
    print(response.json())
    assert response.status_code == 200

    data = response.json()

    assert len(data["items"]) >= 1
    assert data["items"][0]["name"] == "BMW X5"


def test_vehicle_filter_status():

    token = get_manager_token()

    for i in range(15):
        client.post(
            "/vehicles",
            json={
                "name": f"Vehicle {i}",
                "plate_number": f"AA-{i}-BB-{uuid4()}",
                "status": "active"
            },
            headers={"Authorization": f"Bearer {token}"}
        )

        client.post(
            "/vehicles",
            json={
                "name": "Audi A4",
                "plate_number": f"INACTIVE-{uuid4()}",
                "status": "inactive"
            },
            headers={"Authorization": f"Bearer {token}"}
        )

    response = client.get(
        "/vehicles?status=inactive",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data["items"]) >= 1
    assert any(v["status"] == "inactive" for v in data["items"])