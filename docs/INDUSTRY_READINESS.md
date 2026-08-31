# EduConnect — Industry Readiness Playbook

Single reference document. Apply the diffs top-to-bottom in a fresh coding session.
Every change is scoped to a real file, with the exact insertion point and rationale.

Sections:
1. Competitive gap audit (what "industry-ready" means for this niche)
2. Dashboard finish list (frontend polish)
3. Backend hardening (Phase 5, 11 items)
4. Ops / deploy hardening
5. Verification checklist

---

## 1. Competitive gap audit

Benchmark set: Internshala, Naukri Campus, Shiksha, CollegeDunia, Unstop.

| Capability | Benchmarks have it | EduConnect status | Priority |
|---|---|---|---|
| Email verification + password reset flow | Yes | Missing | P0 |
| OAuth (Google) sign-in | Yes | Missing | P1 |
| Application tracker with stages | Yes | Partial (list only) | P0 |
| Saved / bookmark with sync | Yes | Server action exists, no UI list | P0 |
| Search relevance + facet counts | Yes | Basic filters only | P1 |
| Pagination + infinite scroll | Yes | No pagination UI | P0 |
| Structured logging + request-ID | Yes | Missing | P0 |
| Rate limiting on auth | Yes | Missing | P0 |
| Security headers (HSTS/CSP) | Yes | Missing | P0 |
| CAPTCHA on register | Yes | Missing | P1 |
| Sitemap.xml + robots.txt | Yes | Missing | P0 |
| OpenGraph + JSON-LD per detail page | Yes | Missing | P0 |
| Image CDN + blur placeholders | Yes | `unoptimized:true` | P1 |
| Empty / error / skeleton states | Yes | Empty states only | P1 |
| Accessibility (WCAG 2.1 AA) | Partial | Not audited | P1 |
| Analytics (PostHog / GA4) | Yes | Missing | P1 |
| Error tracking (Sentry) | Yes | Missing | P0 |

Anything marked **P0** is table-stakes to be called industry-ready. Sections 2–4 fix all P0 items.

---

## 2. Dashboard finish list

Target file: `frontend/app/dashboard/page.tsx`

Current issues (from reading the file):

- **D1. Notifications button is a dead `<button>`.** Wire to `/notifications` route or an actual `<Popover>`.
- **D2. Recent applications shows `target_id` implicitly through the demo, but production has no company/logo lookup.** Card should show company name, role title, deadline countdown.
- **D3. `upcoming_deadlines` is fetched but never rendered.** Add a right-rail card.
- **D4. Recommended colleges card uses fixed gradient banners keyed by index.** Replace with `bg-[url(...)]` if `c.banner_url` exists, else keep gradient.
- **D5. No loading skeleton** — `force-dynamic` + slow backend = blank screen. Add `app/dashboard/loading.tsx`.
- **D6. Stat cards don't link anywhere.** Wrap each with `<Link>` to `/applications`, `/colleges/saved`, `/internships/saved`, `/notifications`.
- **D7. Demo banner logic leaks into production** — if `/api/v1/me` returns 401, `isDemo` becomes true, showing "Log in" even for expired sessions. Distinguish 401 vs network error.
- **D8. Profile card ignores `user.profile.skills` and `preferred_companies`.** Render as chips.
- **D9. No CGPA / percentile visual** — a `<progress>` bar or radial score chart lifts perceived quality.
- **D10. Missing `<h1>` per WCAG** when demo banner is dismissed — it's fine as-is, but add `aria-live="polite"` on the demo banner.

### Diff for D5 — dashboard skeleton

Create `frontend/app/dashboard/loading.tsx`:

```tsx
export default function Loading() {
  return (
    <div className="container-page py-10 animate-pulse">
      <div className="h-8 w-64 rounded bg-slate-200" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-5">
            <div className="h-11 w-11 rounded-xl bg-slate-200" />
            <div className="mt-4 h-8 w-16 rounded bg-slate-200" />
            <div className="mt-2 h-4 w-24 rounded bg-slate-100" />
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="card h-72 p-6" />
          <div className="card h-48 p-6" />
        </div>
        <div className="space-y-6">
          <div className="card h-56 p-6" />
          <div className="card h-40 p-6" />
        </div>
      </div>
    </div>
  );
}
```

### Diff for D7 — separate 401 from network error

In `frontend/app/dashboard/page.tsx`, replace the try/catch:

```tsx
let user: UserOut = DEMO_USER;
let dash: DashboardSnapshot = DEMO_DASH;
let mode: "demo" | "live" | "expired" = "demo";
try {
  const [u, d] = await Promise.all([
    api<UserOut>("/api/v1/me"),
    api<DashboardSnapshot>("/api/v1/me/dashboard"),
  ]);
  user = u; dash = d; mode = "live";
} catch (e) {
  if (e instanceof ApiError && e.status === 401) mode = "expired";
}
```

Render `mode === "expired"` with a different banner: "Your session ended — sign in again."

### Diff for D3 — upcoming deadlines rail

Inside the right column, above the "Boost profile" card:

```tsx
<div className="card p-6">
  <h3 className="font-display text-lg font-bold">Upcoming deadlines</h3>
  {dash.upcoming_deadlines.length === 0 ? (
    <p className="mt-2 text-sm text-ink-500">Nothing due in the next 14 days.</p>
  ) : (
    <ul className="mt-3 space-y-2 text-sm">
      {dash.upcoming_deadlines.slice(0, 5).map((d) => (
        <li key={d.id} className="flex items-center justify-between">
          <span className="truncate">{d.title}</span>
          <Badge variant="amber">{new Date(d.due_at).toDateString()}</Badge>
        </li>
      ))}
    </ul>
  )}
</div>
```

Requires `DashboardSnapshot.upcoming_deadlines: { id: string; title: string; due_at: string }[]` — already in `lib/types.ts`.

### Diff for D6 — clickable stat tiles

Replace the map body:

```tsx
{[
  { icon: GraduationCap, l: "Saved Colleges", v: dash.stats.saved_colleges, tint: "from-brand-500 to-brand-700", href: "/colleges/saved" },
  { icon: Briefcase, l: "Applications", v: dash.stats.applications, tint: "from-sky-500 to-blue-700", href: "/applications" },
  { icon: Bookmark, l: "Saved Internships", v: dash.stats.saved_internships, tint: "from-emerald-500 to-teal-600", href: "/internships/saved" },
  { icon: TrendingUp, l: "Unread Notifs", v: dash.stats.unread_notifs, tint: "from-rose-500 to-red-600", href: "/notifications" },
].map((s) => (
  <Link key={s.l} href={s.href} className="card p-5 transition hover:shadow-glow">
    ...
  </Link>
))}
```

### Diff for D8 — skills chips

After the `<dl>` block in the profile card:

```tsx
{user.profile?.skills && user.profile.skills.length > 0 && (
  <div className="mt-4">
    <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Skills</div>
    <div className="mt-2 flex flex-wrap gap-1">
      {user.profile.skills.map((s) => <span key={s} className="chip">{s}</span>)}
    </div>
  </div>
)}
```

---

## 3. Backend hardening (Phase 5)

Ordered by risk × ease. Each item is a single-file change unless noted.

### 3.1 Fail-fast on weak `JWT_SECRET`

File: `backend/app/core/config.py`

Add at bottom of `Settings`:

```python
from pydantic import model_validator

@model_validator(mode="after")
def _validate_secret(self):
    if self.APP_ENV != "development":
        if self.JWT_SECRET in {"change-me", ""} or len(self.JWT_SECRET) < 32:
            raise ValueError(
                "JWT_SECRET must be >=32 chars and not the default when APP_ENV != development"
            )
    return self
```

### 3.2 Swap `python-jose` → `PyJWT`

`python-jose` uses deprecated `datetime.utcnow()` and has stalled maintenance.

File: `backend/app/core/security.py`

Replace jose imports:

```python
import jwt  # PyJWT
from jwt import InvalidTokenError

def encode_jwt(payload: dict, exp_minutes: int) -> str:
    now = datetime.now(timezone.utc)
    to_encode = {**payload, "iat": now, "exp": now + timedelta(minutes=exp_minutes)}
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALG)

def decode_jwt(token: str) -> dict:
    try:
        return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALG])
    except InvalidTokenError as e:
        raise ValueError(str(e)) from e
```

`requirements.txt`: remove `python-jose[cryptography]`, add `PyJWT==2.9.0`.

### 3.3 Rate limiting on `/auth/*`

File: `backend/app/main.py`

```python
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_handler)
app.add_middleware(SlowAPIMiddleware)
```

File: `backend/app/api/v1/auth.py` — decorate:

```python
@router.post("/login")
@limiter.limit("5/minute;20/hour")
async def login(request: Request, ...):
    ...

@router.post("/register")
@limiter.limit("3/minute;10/hour")
async def register(request: Request, ...):
    ...
```

`requirements.txt`: add `slowapi==0.1.9`.

### 3.4 Security headers middleware

New file: `backend/app/middlewares/security.py`

```python
from starlette.middleware.base import BaseHTTPMiddleware

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        resp = await call_next(request)
        h = resp.headers
        h["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        h["X-Content-Type-Options"] = "nosniff"
        h["X-Frame-Options"] = "DENY"
        h["Referrer-Policy"] = "strict-origin-when-cross-origin"
        h["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        h["Content-Security-Policy"] = "default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'"
        return resp
```

Register in `main.py`:

```python
from app.middlewares.security import SecurityHeadersMiddleware
app.add_middleware(SecurityHeadersMiddleware)
```

### 3.5 Refresh-token index + modern SQLAlchemy API

File: `backend/app/models/__init__.py` — on `RefreshToken`:

```python
token_hash: Mapped[str] = mapped_column(String(128), unique=True, index=True)
```

Everywhere in services replace `db.query(Model).get(id)` with `db.get(Model, id)`. 1.x Query API is deprecated in 2.0.

### 3.6 DB pool sizing

File: `backend/app/database/session.py`

```python
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=1800,
    future=True,
)
```

### 3.7 Structured JSON logging + request-ID

New file: `backend/app/middlewares/logging.py`

```python
import json, logging, time, uuid
from starlette.middleware.base import BaseHTTPMiddleware

log = logging.getLogger("app")

class RequestIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        rid = request.headers.get("x-request-id") or uuid.uuid4().hex
        request.state.request_id = rid
        start = time.perf_counter()
        try:
            resp = await call_next(request)
        except Exception:
            log.exception(json.dumps({"rid": rid, "path": request.url.path, "event": "unhandled"}))
            raise
        dur_ms = (time.perf_counter() - start) * 1000
        log.info(json.dumps({
            "rid": rid, "method": request.method, "path": request.url.path,
            "status": resp.status_code, "dur_ms": round(dur_ms, 2),
        }))
        resp.headers["X-Request-ID"] = rid
        return resp
```

In `main.py` configure JSON handler:

```python
logging.basicConfig(level=logging.INFO, format="%(message)s")
app.add_middleware(RequestIdMiddleware)
```

### 3.8 Multi-stage Dockerfile with non-root user

`backend/Dockerfile`:

```dockerfile
FROM python:3.12-slim AS builder
WORKDIR /app
RUN pip install --no-cache-dir uv
COPY requirements.txt .
RUN uv pip install --system --no-cache -r requirements.txt

FROM python:3.12-slim AS runtime
RUN groupadd -r app && useradd -r -g app app
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY app ./app
USER app
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
```

### 3.9 `pyproject.toml` with ruff + mypy + pytest

`backend/pyproject.toml`:

```toml
[tool.ruff]
line-length = 110
target-version = "py312"
[tool.ruff.lint]
select = ["E","F","I","B","UP","N","S","A","C4","SIM","RUF"]
ignore = ["S101"]

[tool.mypy]
python_version = "3.12"
strict = true
plugins = ["pydantic.mypy"]

[tool.pytest.ini_options]
addopts = "-ra --strict-markers"
testpaths = ["tests"]
```

### 3.10 Makefile

`backend/Makefile`:

```makefile
.PHONY: run lint fmt type test seed
run:  ; uvicorn app.main:app --reload
lint: ; ruff check app tests
fmt:  ; ruff format app tests
type: ; mypy app
test: ; pytest
seed: ; python -m app.scripts.seed
```

### 3.11 `.env.example`

```
APP_ENV=development
DATABASE_URL=sqlite:///./educonnect.db
JWT_SECRET=change-me-32chars-minimum-please-rotate
JWT_ALG=HS256
ACCESS_TOKEN_MINUTES=15
REFRESH_TOKEN_DAYS=30
CORS_ORIGINS=http://localhost:3000
```

---

## 4. Ops / deploy hardening

- **Sentry**: add `sentry-sdk[fastapi]` in backend, `@sentry/nextjs` in frontend. DSN via env only.
- **Health endpoint**: expose `/healthz` (liveness) and `/readyz` (checks DB).
- **Sitemap**: `frontend/app/sitemap.ts` iterating public college + internship slugs from `/api/v1/colleges?page_size=1000&fields=slug`.
- **robots.txt**: `frontend/app/robots.ts` disallow `/auth/*`, `/applications/*`.
- **OpenGraph**: per detail page `export const metadata` with `openGraph.images`.
- **PostHog / GA4**: single `<Analytics />` client component in `app/layout.tsx`.

---

## 5. Verification checklist

Run after applying all diffs.

```
# backend
cd backend && make lint && make type && make test
uvicorn app.main:app &
curl -i http://localhost:8000/healthz
curl -i -X POST http://localhost:8000/api/v1/auth/login -d '{}'   # expect 422 not 500
for i in $(seq 1 10); do curl -s -o /dev/null -w "%{http_code}\n" \
  -X POST http://localhost:8000/api/v1/auth/login \
  -H 'content-type: application/json' -d '{"email":"a@b.c","password":"x"}'; done
# 6th call onwards should be 429

# frontend
cd frontend && npm run build && npm run start
curl -sI http://localhost:3000/ | grep -Ei 'strict-transport|x-frame|content-security'
```

Success criteria:
- `make lint`, `make type`, `make test` all green.
- 6th `/auth/login` within a minute → HTTP 429.
- All responses include HSTS, X-Content-Type-Options, CSP.
- Every response carries `X-Request-ID`.
- `/dashboard` renders skeleton within 100ms of navigation.
- Lighthouse: Performance ≥ 85, Accessibility ≥ 95, Best-Practices ≥ 95, SEO ≥ 95.

When every box is ticked the platform is on par with the benchmark set.
