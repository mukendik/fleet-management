from fastapi import FastAPI
from app.api.routes import vehicles
from app.models import user
from app.api.routes.auth import router as auth_router

from app.core.database import Base, engine
from app.core.exceptions import register_exception_handlers


app = FastAPI(
    title="Fleet Manager API",
    description="""
API de gestion de flotte automobile.

Fonctionnalités :
- Authentification JWT
- Gestion des véhicules
- Pagination
- Recherche
- Filtres
- Multi-tenant
""",
    version="1.0.0",
    contact={
        "name": "Ghislain Mukendi",
        "email": "contact@qualitydevzone.fr",
    },
)

register_exception_handlers(app)

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {
        "message": "Fleet Manager API running"
    }
app.include_router(auth_router)
app.include_router(vehicles.router)



