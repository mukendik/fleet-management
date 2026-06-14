from uuid import uuid4

def create_vehicle(client, token, name="BMW X5", plate=None):
    if plate is None:
        plate = f"AA-{uuid4().hex[:6].upper()}"

    return client.post(
        "/vehicles",
        json={
            "name": "BMW X5",
            "plate_number": plate,
            "brand": "BMW",
            "model": "X5",
            "year": 2024,
            "fuel_type": "diesel",
            "status": "active"
        },
        headers={"Authorization": f"Bearer {token}"}
    )


def test_create_vehicle(client, manager_token):
    response = create_vehicle(client, manager_token)

    assert response.status_code == 201
    assert response.json()["name"] == "BMW X5"


def test_vehicle_detail(client, manager_token):
    created = create_vehicle(client, manager_token)
    
    print("########### VEHICLE ############### =")
    print(created.json())

    vehicle_id = created.json()["id"]

    response = client.get(
        f"/vehicles/{vehicle_id}",
        headers={"Authorization": f"Bearer {manager_token}"}
    )

    assert response.status_code == 200
    assert response.json()["id"] == vehicle_id


def test_driver_cannot_create_vehicle(client, driver_token):
    response = create_vehicle(client, driver_token)

    assert response.status_code == 403


def test_update_vehicle(client, manager_token):
    created = create_vehicle(client, manager_token)
    vehicle_id = created.json()["id"]

    response = client.put(
        f"/vehicles/{vehicle_id}",
        json={"name": "Audi A4"},
        headers={"Authorization": f"Bearer {manager_token}"}
    )

    assert response.status_code == 200
    assert response.json()["name"] == "Audi A4"


def test_delete_vehicle(client, manager_token):
    created = create_vehicle(client, manager_token)
    vehicle_id = created.json()["id"]

    response = client.delete(
        f"/vehicles/{vehicle_id}",
        headers={"Authorization": f"Bearer {manager_token}"}
    )

    assert response.status_code == 200


def test_vehicle_pagination(client, manager_token):
    for i in range(12):
        create_vehicle(
            client,
            manager_token,
            name=f"Vehicle {i}",
            plate=f"AA-{i}-BB"
        )

    response = client.get(
        "/vehicles?page=1&limit=10",
        headers={"Authorization": f"Bearer {manager_token}"}
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data["items"]) == 10
    assert data["page"] == 1
    assert data["limit"] == 10
    assert data["total"] >= 12


def test_vehicle_search(client, manager_token):
    create_vehicle(client, manager_token, name="BMW X5")
    create_vehicle(client, manager_token, name="Audi A4")

    response = client.get(
        "/vehicles?search=BMW",
        headers={"Authorization": f"Bearer {manager_token}"}
    )

    assert response.status_code == 200

    data = response.json()

    assert any("BMW" in v["name"] for v in data["items"])


def test_vehicle_filter_status(client, manager_token):
    create_vehicle(client, manager_token, name="Car 1")
    create_vehicle(client, manager_token, name="Car 2")

    response = client.get(
        "/vehicles?status=active",
        headers={"Authorization": f"Bearer {manager_token}"}
    )

    assert response.status_code == 200

    data = response.json()

    assert all(v["status"] == "active" for v in data["items"])