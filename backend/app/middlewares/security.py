"""Production-grade security headers.

Add this middleware to `app.main:create_app`:

    from app.middlewares.security import SecurityHeadersMiddleware
    app.add_middleware(SecurityHeadersMiddleware)
"""
from __future__ import annotations

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


# CSP tuned for a Next.js SSR frontend served from same origin. Adjust
# `connect-src` if you introduce a separate API origin.
_DEFAULT_CSP = (
    "default-src 'self'; "
    "img-src 'self' data: https:; "
    "font-src 'self' data:; "
    "style-src 'self' 'unsafe-inline'; "
    "script-src 'self'; "
    "connect-src 'self'; "
    "frame-ancestors 'none'; "
    "base-uri 'self'; "
    "form-action 'self'"
)

_HEADERS = {
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-site",
    "Content-Security-Policy": _DEFAULT_CSP,
}


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        # Never overwrite headers the app explicitly set (e.g. per-route CSP for
        # docs), only fill in the ones that are missing.
        for k, v in _HEADERS.items():
            if k == "Content-Security-Policy" and request.url.path in ("/docs", "/redoc"):
                continue
            response.headers.setdefault(k, v)
        return response
