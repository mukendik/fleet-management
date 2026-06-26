#!/bin/bash

set -e

echo "🧹 Stopping containers..."
docker compose down

echo "🚀 Building containers..."
docker compose build

echo "🔥 Starting services..."
docker compose up -d

echo "⏳ Waiting for DB..."
sleep 5

echo "📦 Applying migrations..."
docker exec fleet_backend alembic upgrade head

echo "🏢 Insert demo data..."
docker exec -it fleet_postgres psql -U fleet_user -d fleet_db -c "INSERT INTO companies (name) VALUES ('Demo Company');"
docker exec -it fleet_postgres psql -U fleet_user -d fleet_db -c "INSERT INTO companies (name) VALUES ('Real Company');"

echo "✅ Backend running at:"
echo "   👉 http://localhost:8000"
echo "   👉 http://localhost:8000/docs"