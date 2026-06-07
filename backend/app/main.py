from fastapi import FastAPI
from app.api.routes import vehicles
from app.models import user
from app.api.routes.auth import router as auth_router

from app.core.database import Base, engine


app = FastAPI(
    title="Fleet Manager API",
    version="1.0.0"
)

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

