"""Structured JSON access log + X-Request-ID.

Add to the app in `app.main:create_app`:

    import logging
    from app.middlewares.logging import RequestIdMiddleware, configure_json_logging
    configure_json_logging(level=logging.INFO)
    app.add_middleware(RequestIdMiddleware)

Each request produces one INFO log line like:

    {"rid":"…","method":"GET","path":"/api/v1/me","status":200,"dur_ms":12.4}
"""
from __future__ import annotations

import json
import logging
import time
import uuid
from typing import Any

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

_REQUEST_ID_HEADER = "X-Request-ID"
_LOG = logging.getLogger("app.access")


class _JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:  # noqa: D401
        base: dict[str, Any] = {
            "ts": self.formatTime(record, "%Y-%m-%dT%H:%M:%S%z"),
            "level": record.levelname,
            "logger": record.name,
        }
        # If msg is already a dict, merge it; otherwise put it under "msg".
        if isinstance(record.msg, dict):
            base.update(record.msg)
        else:
            base["msg"] = record.getMessage()
        if record.exc_info:
            base["exc"] = self.formatException(record.exc_info)
        return json.dumps(base, separators=(",", ":"), default=str)


def configure_json_logging(level: int = logging.INFO) -> None:
    """Reset root + uvicorn handlers to emit JSON lines."""
    handler = logging.StreamHandler()
    handler.setFormatter(_JsonFormatter())

    for name in ("", "uvicorn", "uvicorn.error", "uvicorn.access", "app", "app.access"):
        lg = logging.getLogger(name)
        lg.handlers = [handler]
        lg.setLevel(level)
        lg.propagate = False


class RequestIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        rid = request.headers.get(_REQUEST_ID_HEADER) or uuid.uuid4().hex
        request.state.request_id = rid
        started = time.perf_counter()

        try:
            response = await call_next(request)
        except Exception:  # pragma: no cover — re-raised for exception handlers
            _LOG.exception({
                "rid": rid,
                "method": request.method,
                "path": request.url.path,
                "event": "unhandled_exception",
            })
            raise

        dur_ms = round((time.perf_counter() - started) * 1000, 2)
        _LOG.info({
            "rid": rid,
            "method": request.method,
            "path": request.url.path,
            "status": response.status_code,
            "dur_ms": dur_ms,
            "client": request.client.host if request.client else None,
        })
        response.headers[_REQUEST_ID_HEADER] = rid
        return response
