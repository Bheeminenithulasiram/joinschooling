"""Auth endpoints: register, login, refresh, logout, google oauth, email verification."""
from fastapi import APIRouter, Depends, Request, Response, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.middlewares.ratelimit import limiter
from app.schemas import (
    AuthTokens,
    EmailVerifyRequest,
    GoogleAuthRequest,
    LoginRequest,
    RefreshRequest,
    RegisterRequest,
    ResendVerifyRequest,
)
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=AuthTokens, status_code=status.HTTP_201_CREATED)
@limiter.limit("3/minute;10/hour")
def register(
    request: Request,
    response: Response,
    payload: RegisterRequest,
    db: Session = Depends(get_db),
) -> AuthTokens:
    return auth_service.register(db, payload)


@router.post("/login", response_model=AuthTokens)
@limiter.limit("5/minute;20/hour")
def login(
    request: Request,
    response: Response,
    payload: LoginRequest,
    db: Session = Depends(get_db),
) -> AuthTokens:
    return auth_service.login(db, payload)


@router.post("/google", response_model=AuthTokens)
@limiter.limit("10/minute")
def google_auth(
    request: Request,
    response: Response,
    payload: GoogleAuthRequest,
    db: Session = Depends(get_db),
) -> AuthTokens:
    return auth_service.google_auth(db, payload.credential, payload.role)


@router.post("/verify-email", status_code=status.HTTP_200_OK)
def verify_email(
    payload: EmailVerifyRequest,
    db: Session = Depends(get_db),
) -> dict:
    auth_service.verify_email(db, payload.token)
    return {"status": "ok", "message": "Email successfully verified."}


@router.post("/resend-verification", status_code=status.HTTP_200_OK)
@limiter.limit("3/minute")
def resend_verification(
    request: Request,
    response: Response,
    payload: ResendVerifyRequest,
    db: Session = Depends(get_db),
) -> dict:
    auth_service.resend_verification(db, payload.email)
    return {"status": "ok", "message": "If an unverified account exists, a verification link has been sent."}


@router.post("/refresh", response_model=AuthTokens)
@limiter.limit("30/minute")
def refresh(
    request: Request,
    response: Response,
    payload: RefreshRequest,
    db: Session = Depends(get_db),
) -> AuthTokens:
    return auth_service.refresh(db, payload.refresh_token)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    payload: RefreshRequest,
    db: Session = Depends(get_db),
) -> None:
    auth_service.logout(db, payload.refresh_token)
