from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import vehicles
from app.api.routes.auth import router as auth_router

from app.core.database import Base, engine
from app.core.exceptions import register_exception_handlers


# ----------------------------
# APP INIT (SAAS READY)
# ----------------------------
app = FastAPI(
    title="Fleet Manager API",
    version="0.2.0",
    description="""
Fleet Manager API is a multi-tenant SaaS for vehicle fleet management.

Core features:
- JWT Authentication (Access + Refresh tokens)
- Multi-tenant architecture (company isolation)
- Vehicle lifecycle management (CRUD)
- Pagination, filtering, search
- Maintenance tracking (insurance, technical inspection, mileage)
- SaaS-ready scalable backend
""",
    contact={
        "name": "Ghislain Mukendi",
        "email": "contact@qualitydevzone.fr",
    },
)


# ----------------------------
# EXCEPTION HANDLING
# ----------------------------
register_exception_handlers(app)


# ----------------------------
# DATABASE INIT (DEV ONLY)
# ----------------------------
@app.on_event("startup")
def startup_event():
    # ⚠️ en prod -> remplacer par Alembic
    Base.metadata.create_all(bind=engine)


# ----------------------------
# ROOT ENDPOINT
# ----------------------------
@app.get("/", tags=["Health"])
def root():
    return {
        "status": "ok",
        "message": "Fleet Manager API running 🚗"
    }


# ----------------------------
# CORS CONFIG (SAAS SAFE)
# ----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------------------
# ROUTES
# ----------------------------
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(vehicles.router, prefix="/vehicles", tags=["Vehicles"])