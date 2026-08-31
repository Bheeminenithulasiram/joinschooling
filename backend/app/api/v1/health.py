"""Kubernetes-style probes.

- /healthz  - liveness (always 200 if the process can respond)
- /readyz   - readiness (200 only if DB is reachable)
- /version  - build/version info for support triage

Wire into `main.py`:

    from app.api.v1 import health
    app.include_router(health.router)
"""
from __future__ import annotations

import os
import time
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Response
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database.session import get_db

router = APIRouter(tags=["Meta"])

_STARTED_AT = time.time()
_APP_VERSION = os.environ.get("APP_VERSION", "1.0.0")
_GIT_SHA = os.environ.get("GIT_SHA", "dev")


@router.get("/healthz")
def healthz() -> dict:
    return {
        "status": "ok",
        "uptime_s": round(time.time() - _STARTED_AT, 2),
        "ts": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/readyz")
def readyz(response: Response, db: Session = Depends(get_db)) -> dict:
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ready", "db": "ok"}
    except Exception as e:  # pragma: no cover
        response.status_code = 503
        return {"status": "not_ready", "db": "error", "detail": str(e)[:200]}


@router.get("/version")
def version() -> dict:
    return {
        "name": "EduConnect API",
        "version": _APP_VERSION,
        "git_sha": _GIT_SHA,
        "python_env": os.environ.get("APP_ENV", "development"),
    }
