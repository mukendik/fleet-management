

def test_refresh_token(client):
   
   # 1. create  manager user 
    client.post("/auth/register", json={
    "email": "manager@gmail.com",
    "password": "123456",
    "company_id": 1, 
    "role":"manager"
    })

    # 2. create  driver user 
    client.post("/auth/register", json={
    "email": "driver@gmail.com",
    "password": "123456",
    "company_id": 1, 
    "role":"driver"
    })
    
   
    # 2. login
    login = client.post("/auth/login", json={
        "email": "manager@gmail.com",
        "password": "123456"
    })
    assert login.status_code == 200

    data = login.json()
    refresh_token = data["refresh_token"]

    # 3. refresh
    response = client.post("/auth/refresh", json={
        "refresh_token": refresh_token
    })

    assert response.status_code == 200
    body = response.json()

    assert "access_token" in body
    assert body["token_type"] == "bearer"