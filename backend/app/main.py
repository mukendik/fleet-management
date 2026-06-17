import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import vehicles, drivers
from app.api.routes.auth import router as auth_router

from app.core.logging import setup_logging
from app.core.exceptions import register_exception_handlers
from app.core.database import engine
from app.core.exceptions import global_exception_handler


# ----------------------------
# LOGGING
# ----------------------------
setup_logging()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ----------------------------
# APP INIT
# ----------------------------
app = FastAPI(
    title="Fleet Manager API",
    version="0.2.0",
    description="""
# 🚗 Fleet Manager API

SaaS multi-tenant de gestion de flotte de véhicules et chauffeurs.

---

## 📦 Fonctionnalités principales

### 🔐 Authentification
- JWT Access / Refresh tokens
- Protection des routes via rôles (admin / manager)
- Sécurisation OAuth2 Password Flow

---

### 🚗 Vehicles
- CRUD complet des véhicules
- Filtrage par statut, marque, recherche
- Pagination (page / limit)
- Gestion des VIN, immatriculation, kilométrage
- Statuts : active / maintenance / inactive

---

### 👨‍✈️ Drivers
- CRUD complet des chauffeurs
- Recherche (nom, permis, email)
- Filtrage par statut
- Unicité du numéro de permis par entreprise
- Gestion des dates d’expiration de permis

---

### 🏢 Multi-tenancy
- Isolation des données par `company_id`
- Chaque utilisateur voit uniquement sa flotte

---

### 📊 Pagination & Filtering
- `page` / `limit` sur toutes les listes
- `search` textuel
- filtres dynamiques (status, brand, etc.)

---

### ⚙️ Architecture
- FastAPI
- SQLAlchemy ORM
- PostgreSQL / SQLite (dev)
- Pydantic schemas
- Dependency injection propre

---

## 🧪 Environnement
- Base URL: `/`
- Auth endpoint: `/auth/login`
- Vehicles: `/vehicles`
- Drivers: `/drivers`

---

## 👨‍💻 Contact
Ghislain Mukendi — contact@qualitydevzone.fr
""",
    contact={
        "name": "Ghislain Mukendi",
        "email": "contact@qualitydevzone.fr",
    },
)


# ----------------------------
# EXCEPTION HANDLING (CLEAN FIX)
# ----------------------------
register_exception_handlers(app)

app.add_exception_handler(HTTPException, global_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)


# ----------------------------
# DATABASE INIT (DEV ONLY)
# ----------------------------
@app.on_event("startup")
def startup_event():
    from app.models.base import Base
    from app.models.company import Company
    from app.models.user import User
    from app.models.vehicle import Vehicle
    from app.models.driver import Driver
    logger.info("Starting Fleet Manager API...")

    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database connected & tables created")
    except Exception as e:
        logger.exception("Database startup failed")
        raise e


# ----------------------------
# ROOT
# ----------------------------
@app.get("/", tags=["Health"])
def root():
    return {
        "status": "ok",
        "message": "Fleet Manager API running 🚗"
    }


# ----------------------------
# CORS
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
app.include_router(drivers.router, prefix="/drivers", tags=["Drivers"])