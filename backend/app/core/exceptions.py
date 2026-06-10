from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from psycopg2.errors import UniqueViolation


def register_exception_handlers(app: FastAPI):

    @app.exception_handler(IntegrityError)
    async def integrity_error_handler(
        request: Request,
        exc: IntegrityError
    ):

        orig = getattr(exc, "orig", None)

        if isinstance(orig, UniqueViolation):
            return JSONResponse(
                status_code=400,
                content={
                    "detail": "Resource already exists"
                }
            )

        return JSONResponse(
            status_code=500,
            content={
                "detail": "Database error"
            }
        )