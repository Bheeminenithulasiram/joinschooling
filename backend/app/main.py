"""FastAPI entrypoint for EduConnect."""
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import logging
from app.api.v1 import ai_finder, applications, auth, colleges, internships, saved, users, health
from app.core.config import settings
from app.database.session import Base, engine
from app.middlewares.errors import install_error_handlers
from app.middlewares.security import SecurityHeadersMiddleware
from app.middlewares.logging import RequestIdMiddleware, configure_json_logging
from app.middlewares.ratelimit import install_rate_limiter


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    )

    configure_json_logging(level=logging.INFO)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    install_rate_limiter(app)
    app.add_middleware(RequestIdMiddleware)
    app.add_middleware(SecurityHeadersMiddleware)

    install_error_handlers(app)

    # Root & health
    @app.get("/", include_in_schema=False)
    def root():
        return {
            "name": settings.APP_NAME,
            "version": "1.0.0",
            "docs": "/docs",
            "api": settings.API_V1_PREFIX,
        }

    @app.get("/health", tags=["Meta"])
    def health_endpoint():
        return {"status": "ok"}

    # Routers
    api_prefix = settings.API_V1_PREFIX
    app.include_router(health.router)
    app.include_router(auth.router, prefix=api_prefix)
    app.include_router(users.router, prefix=api_prefix)
    app.include_router(colleges.router, prefix=api_prefix)
    app.include_router(colleges.admin_router, prefix=api_prefix)
    app.include_router(internships.router, prefix=api_prefix)
    app.include_router(internships.authoring_router, prefix=api_prefix)
    app.include_router(applications.router, prefix=api_prefix)
    app.include_router(saved.router, prefix=api_prefix)
    app.include_router(ai_finder.router, prefix=api_prefix)

    # Ensure tables exist and seed demo data on initial deploy
    Base.metadata.create_all(bind=engine)
    try:
        from app.database.seed import seed
        seed(reset=False)
    except Exception as e:
        logging.getLogger("uvicorn.error").warning(f"Auto-seed notification: {e}")

    return app


app = create_app()
