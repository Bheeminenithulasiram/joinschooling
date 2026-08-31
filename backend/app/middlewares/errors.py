"""Uniform error envelope (RFC 7807)."""
from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


def install_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(HTTPException)
    async def http_exception_handler(_: Request, exc: HTTPException):
        body = {
            "type": "about:blank",
            "title": exc.detail if isinstance(exc.detail, str) else "HTTP error",
            "status": exc.status_code,
            "detail": exc.detail if not isinstance(exc.detail, str) else None,
        }
        return JSONResponse(
            status_code=exc.status_code,
            content=body,
            media_type="application/problem+json",
            headers=exc.headers,
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(_: Request, exc: RequestValidationError):
        body = {
            "type": "about:blank",
            "title": "Validation error",
            "status": 422,
            "errors": [
                {"loc": list(e.get("loc", [])), "msg": e.get("msg"), "type": e.get("type")}
                for e in exc.errors()
            ],
        }
        return JSONResponse(status_code=422, content=body, media_type="application/problem+json")
