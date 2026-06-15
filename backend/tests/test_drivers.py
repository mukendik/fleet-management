import pytest


# ----------------------
# HELPERS
# ----------------------

def create_driver(client, token):
    return client.post(
        "/drivers",
        json={
            "first_name": "John",
            "last_name": "Doe",
            "license_number": "LIC-12345",
            "phone": "+33123456789",
            "email": "john@test.com",
            "status": "active"
        },
        headers={"Authorization": f"Bearer {token}"}
    )


# ----------------------
# CREATE
# ----------------------
def test_create_driver(client, manager_token):
    response = create_driver(client, manager_token)

    assert response.status_code == 201

    data = response.json()
    assert data["first_name"] == "John"
    assert data["last_name"] == "Doe"
    assert data["license_number"] == "LIC-12345"
    assert "id" in data


# ----------------------
# GET LIST
# ----------------------
def test_get_drivers(client, manager_token):
    create_driver(client, manager_token)

    response = client.get(
        "/drivers",
        headers={"Authorization": f"Bearer {manager_token}"}
    )

    assert response.status_code == 200

    data = response.json()
    assert "items" in data
    assert len(data["items"]) >= 1


# ----------------------
# GET DETAIL
# ----------------------
def test_get_driver_detail(client, manager_token):
    created = create_driver(client, manager_token)
    driver_id = created.json()["id"]

    response = client.get(
        f"/drivers/{driver_id}",
        headers={"Authorization": f"Bearer {manager_token}"}
    )

    assert response.status_code == 200
    assert response.json()["id"] == driver_id


# ----------------------
# UPDATE
# ----------------------
def test_update_driver(client, manager_token):
    created = create_driver(client, manager_token)
    driver_id = created.json()["id"]

    response = client.put(
        f"/drivers/{driver_id}",
        json={
            "first_name": "Jane",
            "status": "inactive"
        },
        headers={"Authorization": f"Bearer {manager_token}"}
    )

    assert response.status_code == 200

    data = response.json()
    assert data["first_name"] == "Jane"
    assert data["status"] == "inactive"


# ----------------------
# DELETE
# ----------------------
def test_delete_driver(client, manager_token):
    created = create_driver(client, manager_token)
    driver_id = created.json()["id"]

    response = client.delete(
        f"/drivers/{driver_id}",
        headers={"Authorization": f"Bearer {manager_token}"}
    )

    assert response.status_code == 200

    # verify deletion
    response = client.get(
        f"/drivers/{driver_id}",
        headers={"Authorization": f"Bearer {manager_token}"}
    )

    assert response.status_code == 404


# ----------------------
# DUPLICATE LICENSE TEST
# ----------------------
def test_duplicate_license(client, manager_token):
    create_driver(client, manager_token)

    response = create_driver(client, manager_token)

    assert response.status_code == 400
    assert "Driver already exists" in response.json()["detail"]