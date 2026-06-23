#!/bin/bash

set -e

echo "🛑 Stop containers..."
docker compose down

echo "🚀 Build + start containers..."
docker compose up --build -d

echo "🔄 Restart backend..."
docker compose restart backend

echo "📦 Run migrations (alembic)..."
docker exec -it fleet_backend alembic revision --autogenerate -m "update"
docker exec -it fleet_backend alembic upgrade head

echo "🏢 Cleaning demo data..."
docker exec -it fleet_postgres psql -U fleet_user -d fleet_db -c "DELETE FROM users;"
docker exec -it fleet_postgres psql -U fleet_user -d fleet_db -c "DELETE FROM vehicles"


echo "🏢 Insert demo data..."
docker exec -it fleet_postgres psql -U fleet_user -d fleet_db -c "INSERT INTO companies (name) VALUES ('Demo Company');"
docker exec -it fleet_postgres psql -U fleet_user -d fleet_db -c "INSERT INTO companies (name) VALUES ('Real Company');"

echo "✅ Done"
