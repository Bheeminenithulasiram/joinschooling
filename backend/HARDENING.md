# Backend Hardening — Wire-up Guide

The Phase-5 modules are shipped as **additive** files. They plug into the
existing app without touching business logic. Below is the one-file diff a
maintainer applies to activate them.

Files added in this pass:

| Path | Purpose |
|---|---|
| `app/middlewares/security.py`   | HSTS, CSP, X-Frame-Options, Referrer-Policy, COOP, CORP, Permissions-Policy |
| `app/middlewares/logging.py`    | JSON access log + `X-Request-ID` |
| `app/middlewares/ratelimit.py`  | slowapi limiter with user-id fallback |
| `app/api/v1/health.py`          | `/healthz`, `/readyz`, `/version` |
| `pyproject.toml`                | ruff + mypy + pytest config |
| `Makefile`                      | dev workflow shortcuts |
| `.env.production.example`       | production env template |
| `Dockerfile.prod`               | multi-stage image, non-root, HEALTHCHECK |
| `.dockerignore`                 | trim build context |

## 1. Activate middleware in `app/main.py`

Inside `create_app()`, after the CORS middleware is added:

```python
import logging
from app.middlewares.security   import SecurityHeadersMiddleware
from app.middlewares.logging    import RequestIdMiddleware, configure_json_logging
from app.middlewares.ratelimit  import install_rate_limiter
from app.api.v1 import health

configure_json_logging(level=logging.INFO)
install_rate_limiter(app)
app.add_middleware(RequestIdMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.include_router(health.router)
```

Order matters: security headers should run *outermost* so they apply to
error responses too. FastAPI/Starlette runs `add_middleware` last-in-first-out,
so add `SecurityHeadersMiddleware` **last**.

## 2. Rate-limit the auth routes

In `app/api/v1/auth.py`:

```python
from fastapi import Request
from app.middlewares.ratelimit import limiter

@router.post("/login")
@limiter.limit("5/minute;20/hour")
async def login(request: Request, ...):
    ...

@router.post("/register")
@limiter.limit("3/minute;10/hour")
async def register(request: Request, ...):
    ...

@router.post("/refresh")
@limiter.limit("30/minute")
async def refresh(request: Request, ...):
    ...
```

The `request: Request` parameter is required for slowapi to key by client IP.

## 3. Fail-fast on weak JWT_SECRET

In `app/core/config.py`, append to `Settings`:

```python
from pydantic import model_validator

@model_validator(mode="after")
def _validate_secret(self):
    if self.APP_ENV != "development":
        if self.JWT_SECRET in {"change-me", ""} or len(self.JWT_SECRET) < 32:
            raise ValueError(
                "JWT_SECRET must be >=32 chars and not the placeholder in non-development environments"
            )
    return self
```

## 4. Install new runtime deps

Append to `requirements.txt`:

```
slowapi==0.1.9
PyJWT==2.9.0
gunicorn>=22
```

Remove `python-jose[cryptography]` after migrating `app/core/security.py`
to PyJWT (see playbook §3.2).

## 5. Verify

```bash
make lint && make type && make test
uvicorn app.main:app &
curl -i http://localhost:8000/healthz
curl -sI http://localhost:8000/api/v1/colleges | grep -Ei 'x-request-id|strict-transport|content-security'
for i in $(seq 1 7); do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST http://localhost:8000/api/v1/auth/login \
    -H 'content-type: application/json' \
    -d '{"email":"a@b.c","password":"x"}'
done
# expect: 6th and 7th to be 429
```

Success criteria:
- Every response carries `X-Request-ID`.
- HSTS, CSP, X-Content-Type-Options are present on every response.
- `/healthz` returns 200 uptime info; `/readyz` returns 200 when DB is up.
- 6th `/auth/login` per minute → HTTP 429 with `Retry-After` header.
- Access log emits one JSON line per request with `rid`, `method`, `path`, `status`, `dur_ms`.
