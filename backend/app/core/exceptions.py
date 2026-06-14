from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse


# -----------------------------
# STANDARD RESPONSE
# -----------------------------
def error_response(status_code: int, message: str, code: str = None):
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "error": {
                "message": message,
                "code": code,
            }
        }
    )


# -----------------------------
# HTTP EXCEPTION
# -----------------------------
async def http_exception_handler(request: Request, exc: HTTPException):
    return error_response(
        status_code=exc.status_code,
        message=str(exc.detail),
        code="HTTP_ERROR"
    )


# -----------------------------
# GENERIC EXCEPTION
# -----------------------------
async def generic_exception_handler(request: Request, exc: Exception):
    return error_response(
        status_code=500,
        message="Internal server error",
        code="SERVER_ERROR"
    )


# -----------------------------
# REGISTER FUNCTION (IMPORTANT)
# -----------------------------
def register_exception_handlers(app):
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(Exception, generic_exception_handler)