from fastapi import FastAPI

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
