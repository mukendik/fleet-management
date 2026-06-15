from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# -----------------------
# ENGINE
# -----------------------
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
)

# -----------------------
# SESSION
# -----------------------
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# -----------------------
# DEPENDENCY
# -----------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()