from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError
import logging

logger = logging.getLogger("fleet-api")


# -------------------------
# VALIDATION ERROR (422)
# -------------------------
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Validation error on {request.url.path}: {exc.errors()}")

    return JSONResponse(
        status_code=422,
        content={
            "error": "VALIDATION_ERROR",
            "message": "Invalid request payload",
            "details": exc.errors(),
        },
    )


# -------------------------
# DATABASE ERROR
# -------------------------
async def integrity_exception_handler(request: Request, exc: IntegrityError):
    logger.error(f"DB Integrity error: {str(exc)}")

    return JSONResponse(
        status_code=400,
        content={
            "error": "DATABASE_ERROR",
            "message": "Database constraint violation",
        },
    )


# -------------------------
# GLOBAL ERROR (500 SAFE)
# -------------------------
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled error on {request.url.path}")

    return JSONResponse(
        status_code=500,
        content={
            "error": "INTERNAL_SERVER_ERROR",
            "message": "Unexpected server error",
        },
    )


def register_exception_handlers(app):
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(IntegrityError, integrity_exception_handler)
    app.add_exception_handler(Exception, global_exception_handler)