"""Authentication service: registration, login, refresh."""
from __future__ import annotations

import hashlib
from datetime import datetime, timezone
from typing import Tuple

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import (
    JWTError,
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models import RefreshToken, Student, User
from app.schemas import AuthTokens, LoginRequest, RegisterRequest


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def _issue_tokens(db: Session, user: User) -> AuthTokens:
    access, expires_in = create_access_token(user.id, user.role)
    refresh, refresh_exp = create_refresh_token(user.id)
    db.add(
        RefreshToken(
            user_id=user.id,
            token_hash=_hash_token(refresh),
            expires_at=refresh_exp,
        )
    )
    user.last_login_at = datetime.now(tz=timezone.utc)
    db.commit()
    return AuthTokens(access_token=access, refresh_token=refresh, expires_in=expires_in)


def register(db: Session, data: RegisterRequest) -> AuthTokens:
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        phone=data.phone,
        role="student",
        is_email_verified=False,
        is_active=True,
    )
    db.add(user)
    db.flush()
    db.add(Student(user_id=user.id, first_name=data.first_name, last_name=data.last_name))
    return _issue_tokens(db, user)


def login(db: Session, data: LoginRequest) -> AuthTokens:
    user = db.query(User).filter(User.email == data.email, User.deleted_at.is_(None)).first()
    if not user or not user.password_hash or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account disabled")
    return _issue_tokens(db, user)


def refresh(db: Session, refresh_token: str) -> AuthTokens:
    try:
        payload = decode_token(refresh_token)
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token") from exc
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Wrong token type")

    token_hash = _hash_token(refresh_token)
    record = (
        db.query(RefreshToken)
        .filter(RefreshToken.token_hash == token_hash, RefreshToken.revoked_at.is_(None))
        .first()
    )
    if not record:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token revoked")
    expires_at = record.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(tz=timezone.utc):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired")

    # Rotate: revoke current, issue new pair
    record.revoked_at = datetime.now(tz=timezone.utc)
    user = db.query(User).get(record.user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User missing")
    return _issue_tokens(db, user)


def logout(db: Session, refresh_token: str) -> None:
    token_hash = _hash_token(refresh_token)
    record = db.query(RefreshToken).filter(RefreshToken.token_hash == token_hash).first()
    if record and record.revoked_at is None:
        record.revoked_at = datetime.now(tz=timezone.utc)
        db.commit()
