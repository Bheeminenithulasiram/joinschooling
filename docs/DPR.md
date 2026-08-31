# Detailed Project Report (DPR)
## EduConnect — AI-Powered Education & Careers Marketplace

**Document version:** 1.0
**Date:** 2026-08-03
**Prepared by:** EduConnect Engineering
**Status:** Post-MVP, entering hardening phase

---

## 1. Executive Summary

EduConnect is a full-stack web platform that unifies three fragmented journeys for Indian students — **discovering colleges, applying to internships, and receiving AI-driven personalised guidance**. The MVP is live at `https://q3mfa8bs.mule.page/`, covering seven core routes and a functional backend of ~40 REST endpoints. Phase 5 hardening (rate-limiting, security headers, structured logging, containerisation) brings the platform to parity with incumbents such as Internshala, Shiksha, and CollegeDunia.

| Metric | Value |
|---|---|
| Product category | EdTech + Careers marketplace (B2C, freemium) |
| Target user | Indian undergrads (17–24), Tier-2/3 dominant |
| TAM (India, 2026) | ~43 M enrolled undergrads |
| SAM | ~12 M students actively seeking internships / higher-ed |
| MVP status | Deployed, publicly accessible |
| Codebase | 2 services (FastAPI + Next.js 15), ~9 K LOC |
| Tech readiness level (TRL) | 6 — system demo in operational environment |

---

## 2. Problem Statement

Indian students juggle 5–7 disconnected platforms to research a college, verify placement claims, hunt internships, and get mentorship. Each platform monetises one slice; none owns the full funnel. Consequences:

- **Discovery gap:** 68 % of Tier-2/3 students choose colleges from a shortlist of ≤ 3 (source: NSSO 2023 tertiary survey).
- **Trust gap:** placement percentages published by colleges are unaudited; students rely on Reddit/YouTube for ground truth.
- **Access gap:** 82 % of paid internships are captured by top 200 colleges; smaller-college students never see them.
- **Guidance gap:** counselling costs ₹5 K–₹40 K per session, pricing out most of the SAM.

---

## 3. Objectives

| # | Objective | KPI (12 months post-launch) |
|---|---|---|
| O1 | Aggregate ≥ 3 000 verified colleges with normalised placement data | ≥ 3 000 college slugs indexed |
| O2 | Aggregate ≥ 10 000 active internships/month | ≥ 10 000 live listings |
| O3 | Deliver AI-Finder recommendations at < 3 s median latency | p50 ≤ 3 s, p95 ≤ 6 s |
| O4 | Reach 500 K MAU within 12 months of public launch | ≥ 500 K MAU |
| O5 | Convert 4 % of MAU to at least one application | ≥ 20 K MoM applications |
| O6 | Achieve NPS ≥ 40 by month 12 | Rolling 90-day NPS ≥ 40 |

---

## 4. Scope

### 4.1 In scope (v1.0)

- College discovery, filtering, and detail pages with ISR (5-min).
- Internship listing, detail, and application flow with cover-letter server actions.
- Student auth (email + password), password reset, email verification.
- AI Finder — GPT-backed recommendation of colleges + internships with match-score and admission-probability.
- Student dashboard with saved items, application tracker, notifications.
- Admin CMS for college/internship curation (Phase 6).

### 4.2 Out of scope (v1.0)

- Payment gateway integration for paid mentorship (Phase 7).
- Employer / recruiter portal (Phase 7).
- Mobile native apps — PWA-only until MAU ≥ 100 K.
- WhatsApp bot integration.

---

## 5. Stakeholders

| Stakeholder | Interest | Influence |
|---|---|---|
| Undergraduate students | Primary users | High |
| Placement / TPO officers | Data contributors | Medium |
| Employers (paying side) | Revenue source | High |
| Ed-Tech investors | Funding | High |
| MoE / AICTE | Regulatory | Medium |
| Content moderators | Ops | Medium |

---

## 6. Technical Architecture

### 6.1 Component overview

```
┌────────────────┐   HTTPS   ┌───────────────────┐   internal   ┌────────────┐
│  Browser / PWA │──────────▶│  Next.js 15 (SSR) │─────────────▶│  FastAPI   │
└────────────────┘           │  App Router, RSC  │  /api/v1/*   │  Python 12 │
                             └───────────────────┘              └──────┬─────┘
                                    │ httpOnly cookies                 │
                                    ▼                                  ▼
                             ┌───────────────┐              ┌────────────────────┐
                             │ Server actions│              │  Postgres 16       │
                             └───────────────┘              │  Redis (cache/rate)│
                                                            │  S3 (uploads)      │
                                                            │  OpenAI (AI Finder)│
                                                            └────────────────────┘
```

### 6.2 Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js 15 App Router, React 19, Tailwind, TypeScript | SSR + streaming, industry standard |
| Backend | FastAPI, SQLAlchemy 2.x, Pydantic v2, Uvicorn | High performance, typed contracts |
| Database | Postgres 16 (SQLite dev) | Mature, JSONB for flexible profile schema |
| Auth | Argon2id + PyJWT, httpOnly cookies, rotating refresh tokens | OWASP-aligned |
| AI | OpenAI GPT-4 class via streaming | Best latency/quality tradeoff for guidance |
| Cache / rate-limit | Redis + slowapi | Standard combo |
| Object storage | S3 / Cloudflare R2 | Cost-efficient, egress-friendly |
| Observability | Sentry, structured JSON logs, X-Request-ID | Root-cause under 15 min |
| CI/CD | GitHub Actions → Docker → mule-pages / Fly.io | Simple, fast rollbacks |

### 6.3 Data model (high level)

`users`, `student_profiles`, `colleges`, `courses`, `companies`, `internships`, `applications`, `saved_items`, `notifications`, `refresh_tokens`, `ai_runs`. Full schema in `output/schema.sql`.

### 6.4 API surface

40 REST endpoints under `/api/v1`, grouped: `auth`, `me`, `colleges`, `internships`, `applications`, `saved`, `ai`, `notifications`. Full contract in `output/openapi.yaml`.

### 6.5 Non-functional requirements

| NFR | Target |
|---|---|
| Availability | 99.5 % monthly |
| p95 API latency | ≤ 300 ms (non-AI), ≤ 6 s (AI) |
| RPO / RTO | 15 min / 60 min |
| Concurrent users | 5 000 (single region, single node stretch) |
| WCAG conformance | 2.1 AA |
| Security | OWASP Top 10 covered; annual pen-test |

---

## 7. Implementation Phases

| Phase | Scope | Status |
|---|---|---|
| 1 — Blueprint | Architecture, schema, OpenAPI, page inventory | Done |
| 2 — Backend | FastAPI service, 40 endpoints, JWT auth | Done |
| 3 — Frontend | Next.js 15 SSR, 7 route groups | Done |
| 4 — Wire-up | Server actions, cookie auth, RSC data fetch | Done |
| 5 — Hardening | Rate limits, headers, logging, Docker, CI | In progress |
| 6 — CMS / Admin | Internal tooling for content ops | Planned |
| 7 — Monetisation | Employer portal, paid mentorship, ads | Planned |
| 8 — Native / regional | PWA polish, Hindi + 4 regional languages | Planned |

---

## 8. Timeline (12-month plan)

```
Month  1  2  3  4  5  6  7  8  9  10 11 12
Phase 5 ██████
Phase 6       ████████
Phase 7                ██████████
Phase 8                            ██████
Beta launch          ▲
Public launch                ▲
Series-A raise                            ▲
```

Milestones: Beta at M3, Public at M6, 100 K MAU at M9, Series-A close at M12.

---

## 9. Team & Roles

| Role | FTE | Responsibility |
|---|---|---|
| Product Lead | 1 | Roadmap, user research, GTM |
| Backend Engineer (Sr.) | 1 | FastAPI, DB, integrations |
| Backend Engineer | 1 | Services, tests, DevOps |
| Frontend Engineer (Sr.) | 1 | Next.js, design system |
| Frontend Engineer | 1 | Feature velocity, a11y |
| ML / AI Engineer | 1 | AI-Finder, prompt eval, guardrails |
| Designer (UX/UI) | 1 | Figma system, research |
| Content / Ops | 2 | College data curation, moderation |
| Growth / Marketing | 1 | SEO, campus reps |
| **Total** | **10** | |

---

## 10. Cost Estimate

### 10.1 One-time capex (₹ lakh, first 6 months)

| Item | Cost |
|---|---|
| Design system, brand, legal setup | 4.0 |
| Initial data seeding (3 K colleges) | 6.0 |
| Security audit + pen-test | 3.5 |
| Total | **13.5** |

### 10.2 Recurring opex (₹ lakh / month at 100 K MAU)

| Item | Cost |
|---|---|
| Salaries (10 FTE, blended) | 22.0 |
| Cloud (app + DB + Redis + S3) | 1.6 |
| OpenAI usage (AI Finder, 50 K runs) | 2.5 |
| Email + SMS (Sendgrid + MSG91) | 0.4 |
| Sentry, PostHog, misc SaaS | 0.6 |
| Marketing (SEO + campus program) | 4.0 |
| Total | **31.1** |

### 10.3 12-month burn estimate

~₹4.05 Cr (capex 13.5 L + opex 31.1 L × 12).

---

## 11. Revenue Model

| Stream | Trigger | Take-rate / price |
|---|---|---|
| Employer subscriptions | Post > 3 listings/month | ₹15 K–₹75 K / month |
| Featured placement | Sponsored college / internship | CPM ₹250 |
| Premium student | Advanced AI, unlimited applications | ₹299 / month |
| Data insights (anon) | B2B dashboards for TPOs | ₹1 L / college / year |

**Unit economics (v1 assumption)**: CAC ₹35, ARPU / MAU ₹9 → payback < 4 months.

---

## 12. Risks & Mitigation

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Placement data disputes | High | Medium | Show source + verification date; college self-serve correction |
| R2 | AI hallucination in guidance | High | High | RAG on curated corpus; disclaimers; feedback loop |
| R3 | Scraping / bot abuse | High | Medium | slowapi rate limits, Cloudflare, CAPTCHA on register |
| R4 | Employer supply cold-start | High | High | Bootstrap with 50 pilot employers, subsidised pricing |
| R5 | Regulatory (data protection DPDP Act) | Medium | High | Data minimisation, consent flows, DPO on retainer |
| R6 | Talent retention | Medium | High | ESOPs pool 8 %, remote-first, quarterly reviews |
| R7 | Cloud cost overrun on AI | Medium | Medium | Per-user daily quota; cache identical prompts; distil smaller model |

---

## 13. Compliance & Security

- **DPDP Act 2023** — explicit consent, purpose limitation, deletion API.
- **OWASP Top 10** — covered by Phase 5 hardening (auth, headers, rate limits).
- **PCI-DSS** — deferred until Phase 7 (payments); Razorpay handles PAN scope.
- **Accessibility** — WCAG 2.1 AA target, axe-core CI check.
- **Logging & retention** — 30 days hot, 365 days cold, PII redacted at ingest.

---

## 14. Success Metrics & Reporting

**North-star metric:** Weekly active applicants — users who applied ≥ 1 internship or saved ≥ 1 college that week.

Weekly dashboard tracks:

- MAU, WAU, DAU/MAU stickiness
- Signup → verified conversion
- AI-Finder run → application conversion
- p95 latency per route
- Error budget burn (SLO 99.5 %)
- Support ticket volume by category

---

## 15. Exit / Sustainability

- **Series-A target (M12):** ₹40 Cr at ₹200 Cr post — funds 24 months runway + team scale-out.
- **Path to break-even:** ~1.2 M MAU with 3 % premium conversion + 200 paying employers → covers ₹35 L/month opex at that scale.
- **Strategic exits (5-yr):** acquisition by Naukri (Info Edge), UpGrad, or PhysicsWallah.

---

## 16. Appendices

- **A.** System architecture diagram — `output/architecture.md`
- **B.** OpenAPI contract — `output/openapi.yaml`
- **C.** Database schema — `output/schema.sql`
- **D.** Industry readiness playbook — `output/docs/INDUSTRY_READINESS.md`
- **E.** Deployed MVP — `https://q3mfa8bs.mule.page/`

---

*End of Detailed Project Report.*
