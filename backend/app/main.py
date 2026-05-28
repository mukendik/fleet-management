from fastapi import FastAPI
from app.api.routes.auth import router as auth_router

from app.core.database import Base, engine

app = FastAPI(
    title="Fleet Manager API",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {
        "message": "Fleet Manager API running"
    }
app.include_router(auth_router)

