# EduConnect — Phase 1 Architecture Blueprint

Vibrant education-marketplace SaaS. Next.js 15 frontend, FastAPI backend, PostgreSQL, Redis, Celery.
This document is the authoritative reference for folder layout, service boundaries, database design and the API contract that Phases 2–5 will implement.

---

## 1. High-Level Architecture

```
                         ┌──────────────────────────┐
                         │      Cloudflare CDN      │
                         └────────────┬─────────────┘
                                      │
                       ┌──────────────▼───────────────┐
                       │   Next.js 15 (Vercel)        │
                       │   RSC + Client Components    │
                       │   TanStack Query · ShadCN    │
                       └───────┬──────────────────────┘
                               │  HTTPS · JWT (Bearer)
                               ▼
                       ┌──────────────────────────────┐        ┌──────────────┐
                       │   FastAPI (Railway/Render)   │◀──────▶│ Redis Cache  │
                       │   REST · OpenAPI · OAuth2    │        └──────────────┘
                       │   SQLAlchemy · Pydantic v2   │
                       └───────┬─────────────┬────────┘
                               │             │ enqueue
                               ▼             ▼
                    ┌────────────────┐  ┌────────────────┐
                    │ PostgreSQL 15  │  │  Celery Worker │
                    │ (Neon/Supabase)│  │  emails · AI   │
                    └────────────────┘  │  finder · TTS  │
                                        └────────┬───────┘
                                                 │
                                                 ▼
                                        ┌────────────────┐
                                        │  Cloudinary    │
                                        │  (media store) │
                                        └────────────────┘
```

### Key decisions
- **RSC-first frontend** — SEO-critical pages (landing, college/internship listings & details, blogs) are Server Components streamed from Vercel edge; interactive pages (dashboard, AI finder, comparison, admin) are Client Components hydrated with TanStack Query.
- **JWT + rotating refresh tokens** — access token 15 min, refresh 30 days, stored in httpOnly cookie; refresh table (`refresh_tokens`) supports revocation per device.
- **Role-based access** — enum column `users.role` → FastAPI dependency `require_role("admin")` guards routes.
- **Redis** — API response cache (public college/internship lists), rate-limit buckets, Celery broker.
- **Celery** — email delivery, OTP dispatch, AI finder scoring, PDF report generation.
- **Search** — Postgres `pg_trgm` + GIN on names/skills is sufficient for MVP; upgrade to OpenSearch when >100k rows.

---

## 2. Folder Structure

### Frontend (`/frontend`)
```
frontend/
├── app/                          # Next.js App Router
│   ├── (marketing)/
│   │   ├── page.tsx              # Landing
│   │   └── faq/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── reset/page.tsx
│   ├── colleges/
│   │   ├── page.tsx              # Listing (RSC)
│   │   ├── [slug]/page.tsx       # Detail (RSC)
│   │   └── compare/page.tsx      # Client
│   ├── internships/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── workshops/    …
│   ├── hackathons/   …
│   ├── scholarships/ …
│   ├── career-hub/
│   │   ├── roadmaps/[slug]/page.tsx
│   │   ├── resume-builder/page.tsx
│   │   └── ats-checker/page.tsx
│   ├── ai-finder/page.tsx        # 10-step form → results
│   ├── dashboard/
│   │   ├── layout.tsx            # Sidebar shell
│   │   ├── page.tsx              # Overview
│   │   ├── profile/page.tsx
│   │   ├── applications/page.tsx
│   │   ├── saved/page.tsx
│   │   ├── analytics/page.tsx
│   │   └── settings/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── (colleges|users|internships|reports)/page.tsx
│   ├── api/                      # Route handlers (proxy, revalidate)
│   ├── layout.tsx                # Root: fonts, theme, toaster
│   └── globals.css
├── components/
│   ├── ui/                       # ShadCN primitives
│   ├── site/                     # Header, Footer, Nav
│   ├── college/                  # CollegeCard, FiltersPanel, CompareTable
│   ├── internship/               # InternshipCard, ApplyDrawer
│   ├── dashboard/                # StatCard, SidebarNav, AnalyticsChart
│   ├── ai-finder/                # StepForm, MatchCard
│   └── charts/                   # Recharts wrappers
├── hooks/                        # useAuth, useDebounce, useInView
├── contexts/                     # ThemeContext, AuthContext
├── services/                     # API clients (axios), TanStack query keys
├── lib/                          # api.ts, cn.ts, seo.ts, env.ts
├── utils/                        # formatting, currency, dates
├── types/                        # generated from OpenAPI (openapi-typescript)
├── styles/                       # tailwind.css, animations.css
└── public/                       # logos, illustrations, og images
```

### Backend (`/backend`)
```
backend/
├── app/
│   ├── main.py                   # FastAPI entrypoint, mounts routers
│   ├── api/
│   │   └── v1/
│   │       ├── auth.py
│   │       ├── users.py
│   │       ├── colleges.py
│   │       ├── compare.py
│   │       ├── ai_finder.py
│   │       ├── internships.py
│   │       ├── workshops.py
│   │       ├── hackathons.py
│   │       ├── scholarships.py
│   │       ├── roadmaps.py
│   │       ├── applications.py
│   │       ├── saved.py
│   │       ├── reviews.py
│   │       ├── alumni.py
│   │       ├── notifications.py
│   │       └── admin.py
│   ├── core/                     # settings, security (jwt, oauth), logging
│   ├── models/                   # SQLAlchemy ORM (mirrors schema.sql)
│   ├── schemas/                  # Pydantic v2 request/response DTOs
│   ├── repositories/             # DB access (thin, testable)
│   ├── services/                 # Business logic (application_service, ai_finder_service, notification_service)
│   ├── database/                 # session.py, base.py, seeds/
│   ├── middlewares/              # cors, rate_limit, request_id, error_handler
│   ├── auth/                     # jwt.py, oauth_google.py, deps.py
│   ├── tasks/                    # Celery tasks (email, otp, ai_finder, reports)
│   ├── utils/                    # slugify, pagination, storage, mailer
│   └── migrations/               # Alembic
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## 3. Database Design

Full DDL: **[schema.sql](schema.sql)**. Highlights:

- **UUID PKs** everywhere for shardable IDs and safe URL exposure.
- **Soft delete** on business entities (`deleted_at`), hard delete only for tokens/OTP.
- **Audit fields** (`created_at`, `updated_at`) auto-maintained by trigger `touch_updated_at()`.
- **Extensions**: `uuid-ossp`, `pg_trgm` (trigram fuzzy search), `citext` (case-insensitive email).
- **Full-text-ish search** via GIN + `gin_trgm_ops` on `colleges.name`, `internships.title`, `companies.name`.
- **Polymorphic-ish `applications`** — one table with `(target_kind, target_id)`; enforced UNIQUE on `(student_id, target_kind, target_id)`.
- **`ai_finder_runs`** persists every recommendation call for reproducibility, model-version A/B and dashboards.
- **Enums** for role, work_mode, application_status, college_type, gender, saved_kind, notification_ch.

### ER Diagram

```
                    ┌────────┐
                    │ users  │─────────────┐
                    └────┬───┘             │
              ┌─────────┼──────────┐       │
              ▼         ▼          ▼       │
        ┌──────────┐┌────────┐┌──────────┐ │
        │students  ││admins  ││recruiters│─┘ (belongs to companies)
        └────┬─────┘└────────┘└──────────┘
             │
   ┌─────────┼─────────────┬────────────────┐
   ▼         ▼             ▼                ▼
┌──────────┐┌──────────┐┌────────────┐┌───────────┐
│applications││saved_items││reviews    ││notifications│
└────┬───────┘└─────┬────┘└─────┬─────┘└───────────┘
     │              │           │
     │ target_kind + target_id  │
     ▼              ▼           ▼
 (internships | colleges | workshops | hackathons | scholarships)

┌──────────┐  1..N   ┌────────┐  1..N   ┌───────────┐
│colleges  │────────▶│courses │         │placements │◀─── colleges
└────┬─────┘         └────────┘         └───────────┘
     │  M..N (college_top_recruiters)
     ▼
┌──────────┐
│companies │─────1..N────▶ internships
└──────────┘

alumni_profiles ── belongs to → users, colleges, companies
ai_finder_runs  ── belongs to → students
```

---

## 4. API Design

Full spec: **[openapi.yaml](openapi.yaml)**. Design principles:

| Concern            | Convention |
| ------------------ | ---------- |
| Versioning         | URL prefix `/api/v1`; breaking changes bump to `/v2` |
| Auth               | `Authorization: Bearer <access>`; refresh via `/auth/refresh` |
| Errors             | RFC 7807 `application/problem+json` `{type,title,status,detail,errors[]}` |
| Pagination         | `?page=&page_size=` → `{items, pagination:{total,has_next}}`; max 100/page |
| Filtering          | Flat query params (`?state=&type=&min_rating=`) |
| Sorting            | `?sort=rating` / `?sort=-avg_package` |
| Idempotency        | POST `/applications`, `/saved` use natural UNIQUEs → 409 on duplicate |
| Rate limits        | 60 req/min per IP anon, 300 req/min per user; `/auth/*` 10 req/min |
| Cache              | Public GETs (`/colleges`, `/internships`) → 60s Redis + `Cache-Control: public, max-age=60, stale-while-revalidate=300` |
| Validation         | Pydantic v2 strict; 422 body echoes field errors |
| Docs               | `/docs` (Swagger), `/redoc`, `/openapi.json` |

### Priority module contracts

**AI College Finder** — `POST /ai/college-finder`
- Input: profile answers (10th %, 12th %, CGPA, course, budget, state, hostel, expected package).
- Pipeline: candidate-generate by course+state → score with weighted rubric (academics 30%, budget fit 20%, placement fit 25%, location 10%, facilities 15%) → optional LLM re-rank → persist `ai_finder_runs`.
- Output: array of `{college, match_score, pros[], cons[], predicted_package_lpa, admission_probability}`.

**College Listing** — `GET /colleges`
- Filters: `q, state, city, type, min_fees, max_fees, hostel, min_rating`.
- Sort: `rating | avg_package | nirf_rank | fees_asc | fees_desc`.
- Response: paged `CollegeCard[]` (light payload for grid).

**College Detail** — `GET /colleges/{slug}`
- Aggregate: `CollegeDetail` = card + about + infra + courses[] + placements[] + gallery[] + top_recruiters[] + admission_process. Reviews fetched separately via `GET /reviews?kind=college&target_id=...` to keep detail cache stable.

**Student Dashboard** — `GET /me/dashboard`
- Single aggregated payload: stats, recent applications, recommended colleges, upcoming deadlines. Reduces waterfall on hydration.

---

## 5. Security

- Passwords: `argon2id` via passlib (fallback bcrypt).
- JWT: RS256, keys rotated in Secrets Manager, `kid` header.
- CORS: allowlist Vercel prod + preview URLs.
- Input: Pydantic strict; SQL injection prevented by ORM + parametrized queries.
- XSS: React auto-escaping; markdown blogs sanitized with `bleach`.
- CSRF: state-changing endpoints require Bearer token (not cookie) → CSRF not applicable for API; NextAuth cookie routes use double-submit token.
- Rate limiting: Redis token-bucket middleware.
- Audit: every mutation writes to `activity_log`.

## 6. Performance

- **Frontend**: Next.js RSC + `next/image` (AVIF/WebP) + route-level `revalidate = 300` for public pages; skeleton loaders on client fetches; dynamic imports for AI Finder chart bundle.
- **Backend**: SQLAlchemy `selectin` loads to kill N+1; Redis cache-aside for public GETs; connection pool `pool_size=20, max_overflow=30`.
- **DB**: composite indexes on hot filters (`state,city`, `is_active,posted_at`, `kind,target_id`); GIN on arrays/trigrams; materialized view `mv_college_rating_agg` refreshed nightly for sort-by-rating.

## 7. Delivery Roadmap

| Phase | Deliverables |
| ----- | ------------ |
| **1** | ✅ Architecture, folder structure, `schema.sql`, `openapi.yaml`, this doc |
| **2** | FastAPI: auth, users, colleges, internships, applications, saved; Alembic baseline; unit + integration tests |
| **3** | Next.js: design system (tokens, ShadCN theme), landing, colleges list/detail, internships list/detail, auth flows |
| **4** | Student dashboard, AI College Finder (form + engine + results), College Compare, Admin dashboard |
| **5** | Workshops/Hackathons/Scholarships/Roadmaps, alumni, notifications, PWA, analytics exports, load tests, deploy pipelines |
