from app.schemas.user import UserCreate


def test_user_schema():
    user = UserCreate(
        email="test@test.com",
        password="123456",
        company_id=1
    )

    assert user.email == "test@test.com"
