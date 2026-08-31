"""Rate limiter based on slowapi.

Usage (wire once in app.main:create_app):

    from app.middlewares.ratelimit import limiter, install_rate_limiter
    install_rate_limiter(app)

Then decorate individual auth routes:

    from app.middlewares.ratelimit import limiter

    @router.post("/login")
    @limiter.limit("5/minute;20/hour")
    async def login(request: Request, ...):
        ...

The `request` parameter is required for slowapi to key by client IP.
"""
from __future__ import annotations

from typing import Optional

from fastapi import FastAPI, Request
from starlette.responses import JSONResponse

try:
    from slowapi import Limiter
    from slowapi.errors import RateLimitExceeded
    from slowapi.middleware import SlowAPIMiddleware
    from slowapi.util import get_remote_address
    _HAS_SLOWAPI = True
except ImportError:  # pragma: no cover - graceful degradation
    _HAS_SLOWAPI = False


def _key(request: Request) -> str:
    # Prefer authenticated user id if present, else client IP.
    uid: Optional[str] = getattr(request.state, "user_id", None)
    if uid:
        return f"user:{uid}"
    return f"ip:{get_remote_address(request)}"  # type: ignore[misc]


if _HAS_SLOWAPI:
    limiter = Limiter(
        key_func=_key,
        default_limits=["200/minute", "5000/hour"],
        headers_enabled=True,
    )
else:  # pragma: no cover
    limiter = None  # type: ignore[assignment]


async def _rate_limit_exceeded_handler(request: Request, exc):  # type: ignore[override]
    """RFC 7807-ish response body."""
    retry_after = getattr(exc, "retry_after", None)
    payload = {
        "type": "about:blank",
        "title": "Too Many Requests",
        "status": 429,
        "detail": "Rate limit exceeded. Try again shortly.",
    }
    headers = {}
    if retry_after:
        headers["Retry-After"] = str(retry_after)
    return JSONResponse(payload, status_code=429, headers=headers)


def install_rate_limiter(app: FastAPI) -> None:
    """Attach the limiter to the FastAPI app. No-op if slowapi is missing."""
    if not _HAS_SLOWAPI:
        return
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    app.add_middleware(SlowAPIMiddleware)
