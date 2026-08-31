"""Auth endpoints: register, login, refresh, logout."""
from fastapi import APIRouter, Depends, status, Request, Response
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas import AuthTokens, LoginRequest, RefreshRequest, RegisterRequest
from app.services import auth_service
from app.middlewares.ratelimit import limiter

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=AuthTokens, status_code=status.HTTP_201_CREATED)
@limiter.limit("3/minute;10/hour")
def register(request: Request, response: Response, payload: RegisterRequest, db: Session = Depends(get_db)) -> AuthTokens:
    return auth_service.register(db, payload)


@router.post("/login", response_model=AuthTokens)
@limiter.limit("5/minute;20/hour")
def login(request: Request, response: Response, payload: LoginRequest, db: Session = Depends(get_db)) -> AuthTokens:
    return auth_service.login(db, payload)


@router.post("/refresh", response_model=AuthTokens)
@limiter.limit("30/minute")
def refresh(request: Request, response: Response, payload: RefreshRequest, db: Session = Depends(get_db)) -> AuthTokens:
    return auth_service.refresh(db, payload.refresh_token)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(payload: RefreshRequest, db: Session = Depends(get_db)) -> None:
    auth_service.logout(db, payload.refresh_token)
