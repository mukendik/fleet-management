def create_vehicle(client, token, name="BMW X5", plate="AA-123-BB"):
    return client.post(
        "/vehicles",
        json={
            "name": name,
            "plate_number": plate,
            "brand": "BMW",
            "model": "X5",
            "year": 2024,
            "mileage": 100000,
            "fuel_type": "diesel",
            "status": "active"
        },
        headers={"Authorization": f"Bearer {token}"}
    )