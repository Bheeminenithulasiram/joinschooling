"""Password hashing + JWT token helpers."""
from __future__ import annotations

import secrets
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Tuple

import jwt

JWTError = jwt.PyJWTError
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return pwd_context.verify(plain, hashed)
    except Exception:  # pragma: no cover - malformed hash
        return False


def _create_token(subject: str, expires_delta: timedelta, extra: Dict[str, Any] | None = None) -> str:
    now = datetime.now(tz=timezone.utc)
    payload: Dict[str, Any] = {
        "sub": subject,
        "iat": int(now.timestamp()),
        "exp": int((now + expires_delta).timestamp()),
        "jti": secrets.token_urlsafe(16),
    }
    if extra:
        payload.update(extra)
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_access_token(user_id: str, role: str) -> Tuple[str, int]:
    delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = _create_token(user_id, delta, {"role": role, "type": "access"})
    return token, int(delta.total_seconds())


def create_refresh_token(user_id: str) -> Tuple[str, datetime]:
    delta = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    token = _create_token(user_id, delta, {"type": "refresh"})
    return token, datetime.now(tz=timezone.utc) + delta


def decode_token(token: str) -> Dict[str, Any]:
    """Decode a JWT — raises `jose.JWTError` on invalid / expired tokens."""
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])


__all__ = [
    "hash_password",
    "verify_password",
    "create_access_token",
    "create_refresh_token",
    "decode_token",
    "JWTError",
]
