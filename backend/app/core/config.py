"""Application settings loaded from environment variables."""
from functools import lru_cache
from typing import List, Union, Any

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

    # App
    APP_ENV: str = "development"
    APP_NAME: str = "EduConnect API"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = True

    # DB
    DATABASE_URL: str = "sqlite:///./educonnect.db"

    # Security
    JWT_SECRET: str = "change-me"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # CORS
    BACKEND_CORS_ORIGINS: Union[List[str], str] = Field(
        default_factory=lambda: ["http://localhost:3000"]
    )

    # Redis / Celery
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    # OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""

    # Email
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = "noreply@educonnect.example.com"

    # Rate limit
    RATE_LIMIT_ANON_PER_MIN: int = 60
    RATE_LIMIT_USER_PER_MIN: int = 300

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def _split_cors(cls, v):
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                try:
                    import json
                    return json.loads(v)
                except Exception:
                    pass
            return [o.strip() for o in v.split(",") if o.strip()]
        return v

    @model_validator(mode="after")
    def _validate_secret(self):
        if self.APP_ENV not in {"development", "test"}:
            if self.JWT_SECRET in {"change-me", ""} or len(self.JWT_SECRET) < 32:
                raise ValueError(
                    "JWT_SECRET must be >=32 chars and not the default when APP_ENV is production/staging"
                )
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
