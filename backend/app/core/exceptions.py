from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError

import logging

logger = logging.getLogger("fleet-api")


# -------------------------
# HTTP ERROR (400 / 401 / 403 / 404 ...)
# -------------------------
async def http_exception_handler(
    request: Request,
    exc: HTTPException
):
    logger.warning(
        f"HTTP {exc.status_code} on {request.url.path}: {exc.detail}"
    )

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "HTTP_ERROR",
            "message": exc.detail,
        },
    )


# -------------------------
# VALIDATION ERROR (422)
# -------------------------
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Validation error on {request.url.path}: {exc.errors()}")

    formatted_errors = []

    for err in exc.errors():
        field = err.get("loc", ["unknown"])[-1]
        formatted_errors.append({
            "field": field,
            "message": err.get("msg")
        })

    return JSONResponse(
        status_code=422,
        content={
            "error": "VALIDATION_ERROR",
            "message": "Invalid request payload",
            "details": formatted_errors,
        },
    )


# -------------------------
# DATABASE ERROR
# -------------------------
async def integrity_exception_handler(
    request: Request,
    exc: IntegrityError
):
    logger.error(
        f"DB Integrity error on {request.url.path}: {str(exc)}"
    )

    return JSONResponse(
        status_code=400,
        content={
            "error": "DATABASE_ERROR",
            "message": "Database constraint violation",
        },
    )


# -------------------------
# GLOBAL ERROR (500)
# -------------------------
async def global_exception_handler(
    request: Request,
    exc: Exception
):
    logger.exception(
        f"Unhandled error on {request.url.path}"
    )

    return JSONResponse(
        status_code=500,
        content={
            "error": "INTERNAL_SERVER_ERROR",
            "message": "Unexpected server error",
        },
    )


# -------------------------
# REGISTER
# -------------------------
def register_exception_handlers(app):

    app.add_exception_handler(
        HTTPException,
        http_exception_handler
    )

    app.add_exception_handler(
        RequestValidationError,
        validation_exception_handler
    )

    app.add_exception_handler(
        IntegrityError,
        integrity_exception_handler
    )

    app.add_exception_handler(
        Exception,
        global_exception_handler
    )