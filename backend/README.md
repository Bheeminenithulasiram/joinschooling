# EduConnect Backend (Phase 2)

FastAPI service implementing the Phase 1 blueprint. Runnable on SQLite for local dev; swap `DATABASE_URL` to Postgres for prod.

## Quickstart

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

# Seed demo data (colleges, companies, internships, users)
python -m app.database.seed

# Run
uvicorn app.main:app --reload --port 8000
```

Visit **http://localhost:8000/docs** for Swagger.

## Demo credentials

| Role    | Email                          | Password       |
| ------- | ------------------------------ | -------------- |
| Admin   | admin@educonnect.dev           | admin1234      |
| Student | student@educonnect.dev         | student1234    |

## Endpoints implemented

| Group      | Method | Path                                     |
| ---------- | ------ | ---------------------------------------- |
| Auth       | POST   | `/api/v1/auth/register`                  |
|            | POST   | `/api/v1/auth/login`                     |
|            | POST   | `/api/v1/auth/refresh`                   |
|            | POST   | `/api/v1/auth/logout`                    |
| Users      | GET    | `/api/v1/me`                             |
|            | PATCH  | `/api/v1/me`                             |
|            | GET    | `/api/v1/me/dashboard`                   |
| Colleges   | GET    | `/api/v1/colleges`                       |
|            | GET    | `/api/v1/colleges/{slug}`                |
|            | GET    | `/api/v1/colleges/compare?ids=a,b,c`     |
|            | POST   | `/api/v1/admin/colleges` (admin)         |
| Internships| GET    | `/api/v1/internships`                    |
|            | GET    | `/api/v1/internships/{slug}`             |
|            | POST   | `/api/v1/internships/{id}/apply`         |
| Apps       | GET    | `/api/v1/applications`                   |
| Saved      | GET/POST/DELETE | `/api/v1/saved(/{id})`          |
| AI Finder  | POST   | `/api/v1/ai/college-finder`              |
|            | GET    | `/api/v1/ai/college-finder/history`      |

## Layout

```
app/
├── main.py           entrypoint
├── core/             config, security, deps
├── database/         session, seed
├── models/           SQLAlchemy ORM
├── schemas/          Pydantic DTOs
├── services/         business logic
├── middlewares/      error envelope (RFC 7807)
└── api/v1/           routers (auth, users, colleges, internships, ...)
```

## Notes

- **Portability**: models use portable types so the same code runs on SQLite (dev) & Postgres (prod). In production, use `schema.sql` (from Phase 1) + Alembic migrations to add GIN indexes and JSONB columns.
- **Auth**: JWT (HS256) with rotating refresh tokens. Access lifetime 15m, refresh 30d, hashes stored in `refresh_tokens`.
- **Errors**: uniform `application/problem+json` envelope.
- **AI Finder**: deterministic weighted rubric (`services/ai_finder.py`) with runs persisted to `ai_finder_runs`.
