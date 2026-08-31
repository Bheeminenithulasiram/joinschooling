"""FastAPI dependencies: current user, role gates."""
from __future__ import annotations

from typing import Iterable, Optional

from fastapi import Depends, Header, Cookie, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import JWTError, decode_token
from app.database.session import get_db
from app.models import User


def get_current_user(
    authorization: Optional[str] = Header(default=None),
    ec_at: Optional[str] = Cookie(default=None),
    db: Session = Depends(get_db),
) -> User:
    token = None
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1].strip()
    elif ec_at:
        token = ec_at

    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    try:
        payload = decode_token(token)
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token") from exc

    if payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Wrong token type")

    user = db.query(User).filter(User.id == payload["sub"], User.deleted_at.is_(None)).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")
    return user


def get_optional_user(
    authorization: Optional[str] = Header(default=None),
    ec_at: Optional[str] = Cookie(default=None),
    db: Session = Depends(get_db),
) -> Optional[User]:
    token = None
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1].strip()
    elif ec_at:
        token = ec_at

    if not token:
        return None
    try:
        return get_current_user(authorization=authorization, ec_at=ec_at, db=db)
    except HTTPException:
        return None


def require_role(*roles: str):
    """Dependency factory: assert current user has one of the roles."""

    allowed: Iterable[str] = roles

    def _guard(user: User = Depends(get_current_user)) -> User:
        if user.role not in allowed:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
        return user

    return _guard
