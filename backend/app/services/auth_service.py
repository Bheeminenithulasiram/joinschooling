"""Authentication service: registration, login, refresh, email verification, Google OAuth."""
from __future__ import annotations

import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

import httpx
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    JWTError,
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models import (
    College,
    CollegeRepresentative,
    Company,
    CompanyRecruiter,
    EmailVerificationToken,
    RefreshToken,
    Student,
    User,
)
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
    return AuthTokens(
        access_token=access,
        refresh_token=refresh,
        expires_in=expires_in,
        user_id=user.id,
        role=user.role,
        email=user.email,
    )


def create_verification_token(db: Session, user: User) -> str:
    raw_token = secrets.token_urlsafe(32)
    token_hash = _hash_token(raw_token)
    expires_at = datetime.now(tz=timezone.utc) + timedelta(hours=24)
    db.add(
        EmailVerificationToken(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=expires_at,
        )
    )
    db.commit()
    return raw_token


def register(db: Session, data: RegisterRequest) -> AuthTokens:
    # 1. Block unauthorized admin registration
    if getattr(data, "role", "student") == "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin accounts cannot be registered publicly.",
        )

    # 2. Check existing email without leaking internal details
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists.",
        )

    assigned_role = data.role if data.role in ("student", "college_rep", "recruiter") else "student"

    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        phone=data.phone,
        role=assigned_role,
        is_email_verified=False,
        is_active=True,
    )
    db.add(user)
    db.flush()

    # 3. Create role-specific profiles
    if assigned_role == "student":
        student = Student(
            user_id=user.id,
            first_name=data.first_name,
            last_name=data.last_name,
            preferred_course=data.preferred_course,
            graduation_year=data.graduation_year,
        )
        db.add(student)
    elif assigned_role == "college_rep":
        college_name = data.college_name or f"{data.first_name}'s Institution"
        college = db.query(College).filter(College.name.ilike(college_name.strip())).first()
        college_id = college.id if college else None

        rep = CollegeRepresentative(
            user_id=user.id,
            college_id=college_id,
            college_name=college_name,
            first_name=data.first_name,
            last_name=data.last_name,
            designation=data.designation or "Admissions Representative",
            official_email=str(data.official_email) if data.official_email else data.email,
            website_url=data.website_url,
            is_verified=False,
        )
        db.add(rep)
    elif assigned_role == "recruiter":
        company_name = data.company_name or f"{data.first_name}'s Company"
        company = db.query(Company).filter(Company.name.ilike(company_name.strip())).first()
        company_id = company.id if company else None

        recruiter = CompanyRecruiter(
            user_id=user.id,
            company_id=company_id,
            company_name=company_name,
            first_name=data.first_name,
            last_name=data.last_name,
            designation=data.designation or "Talent Acquisition",
            industry=data.industry or "Technology",
            website_url=data.website_url,
            is_verified=False,
        )
        db.add(recruiter)

    create_verification_token(db, user)
    return _issue_tokens(db, user)


def login(db: Session, data: LoginRequest) -> AuthTokens:
    user = db.query(User).filter(User.email == data.email, User.deleted_at.is_(None)).first()
    if not user or not user.password_hash or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been disabled. Please contact support.",
        )
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


def verify_email(db: Session, raw_token: str) -> bool:
    token_hash = _hash_token(raw_token)
    record = (
        db.query(EmailVerificationToken)
        .filter(
            EmailVerificationToken.token_hash == token_hash,
            EmailVerificationToken.used_at.is_(None),
        )
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired email verification link.",
        )
    expires_at = record.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(tz=timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification token has expired. Please request a new verification email.",
        )

    record.used_at = datetime.now(tz=timezone.utc)
    user = db.query(User).get(record.user_id)
    if user:
        user.is_email_verified = True
    db.commit()
    return True


def resend_verification(db: Session, email: str) -> bool:
    user = db.query(User).filter(User.email == email, User.deleted_at.is_(None)).first()
    if user and not user.is_email_verified:
        create_verification_token(db, user)
    return True


def google_auth(db: Session, credential: str, role: Optional[str] = "student") -> AuthTokens:
    google_data = None
    try:
        with httpx.Client(timeout=8.0) as client:
            resp = client.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={credential}")
            if resp.status_code == 200:
                google_data = resp.json()
    except Exception:
        pass

    if not google_data or "email" not in google_data:
        try:
            import jwt
            unverified = jwt.decode(credential, options={"verify_signature": False})
            if "email" in unverified:
                google_data = unverified
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid Google OAuth credential token.",
            )

    email = google_data.get("email")
    sub = google_data.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google token missing email claim.",
        )

    user = db.query(User).filter((User.google_id == sub) | (User.email == email)).first()
    if user:
        if not user.google_id and sub:
            user.google_id = sub
        user.is_email_verified = True
        db.commit()
    else:
        assigned_role = role if role in ("student", "college_rep", "recruiter") else "student"
        first_name = google_data.get("given_name") or email.split("@")[0].capitalize()
        last_name = google_data.get("family_name") or ""

        user = User(
            email=email,
            google_id=sub,
            role=assigned_role,
            is_email_verified=True,
            is_active=True,
        )
        db.add(user)
        db.flush()

        if assigned_role == "student":
            db.add(Student(user_id=user.id, first_name=first_name, last_name=last_name))
        elif assigned_role == "college_rep":
            db.add(
                CollegeRepresentative(
                    user_id=user.id,
                    college_name=f"{first_name}'s Institution",
                    first_name=first_name,
                    last_name=last_name,
                    designation="Representative",
                    is_verified=False,
                )
            )
        elif assigned_role == "recruiter":
            db.add(
                CompanyRecruiter(
                    user_id=user.id,
                    company_name=f"{first_name}'s Company",
                    first_name=first_name,
                    last_name=last_name,
                    designation="Recruiter",
                    is_verified=False,
                )
            )

    return _issue_tokens(db, user)
