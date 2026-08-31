-- =====================================================================
-- EduConnect - PostgreSQL Schema (Phase 1 Blueprint)
-- Fully normalized, indexed, with audit fields and soft deletes.
-- Target: PostgreSQL 15+
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";     -- fuzzy text search
CREATE EXTENSION IF NOT EXISTS "citext";      -- case-insensitive email

-- ---------- ENUM TYPES ----------
CREATE TYPE user_role       AS ENUM ('student', 'admin', 'recruiter', 'mentor');
CREATE TYPE application_status AS ENUM ('draft','submitted','under_review','shortlisted','rejected','accepted','withdrawn');
CREATE TYPE work_mode       AS ENUM ('remote','hybrid','onsite');
CREATE TYPE college_type    AS ENUM ('government','private','deemed','autonomous');
CREATE TYPE gender          AS ENUM ('male','female','other','prefer_not_to_say');
CREATE TYPE notification_ch AS ENUM ('in_app','email','push','sms');
CREATE TYPE saved_kind      AS ENUM ('college','internship','workshop','hackathon','scholarship','roadmap','blog');

-- =====================================================================
-- CORE IDENTITY
-- =====================================================================
CREATE TABLE users (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email             CITEXT UNIQUE NOT NULL,
    phone             VARCHAR(20) UNIQUE,
    password_hash     TEXT,                    -- nullable for pure OAuth users
    google_id         TEXT UNIQUE,
    role              user_role NOT NULL DEFAULT 'student',
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at     TIMESTAMPTZ,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at        TIMESTAMPTZ
);
CREATE INDEX idx_users_role       ON users(role) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_created_at ON users(created_at DESC);

CREATE TABLE refresh_tokens (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash     TEXT NOT NULL,
    user_agent     TEXT,
    ip_address     INET,
    expires_at     TIMESTAMPTZ NOT NULL,
    revoked_at     TIMESTAMPTZ,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_refresh_user_id ON refresh_tokens(user_id);

CREATE TABLE otp_codes (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code_hash   TEXT NOT NULL,
    purpose     VARCHAR(32) NOT NULL,          -- 'email_verify','reset_pw','2fa'
    expires_at  TIMESTAMPTZ NOT NULL,
    consumed_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_otp_user_purpose ON otp_codes(user_id, purpose);

-- =====================================================================
-- PROFILES
-- =====================================================================
CREATE TABLE students (
    user_id            UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name         VARCHAR(80)  NOT NULL,
    last_name          VARCHAR(80)  NOT NULL,
    dob                DATE,
    gender             gender,
    avatar_url         TEXT,
    headline           VARCHAR(160),
    bio                TEXT,
    tenth_percentage   NUMERIC(5,2),
    twelfth_percentage NUMERIC(5,2),
    degree             VARCHAR(120),
    cgpa               NUMERIC(4,2),
    graduation_year    SMALLINT,
    preferred_course   VARCHAR(120),
    budget_min_lpa     NUMERIC(6,2),
    budget_max_lpa     NUMERIC(6,2),
    state              VARCHAR(80),
    city               VARCHAR(80),
    hostel_required    BOOLEAN,
    expected_package_lpa NUMERIC(6,2),
    preferred_companies TEXT[],
    skills             TEXT[],
    resume_url         TEXT,
    linkedin_url       TEXT,
    github_url         TEXT,
    portfolio_url      TEXT,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_students_state_city ON students(state, city);
CREATE INDEX idx_students_skills_gin ON students USING gin (skills);

CREATE TABLE recruiters (
    user_id      UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    company_id   UUID NOT NULL,                 -- FK added below
    full_name    VARCHAR(160) NOT NULL,
    designation  VARCHAR(120),
    phone        VARCHAR(20),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE admins (
    user_id     UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name   VARCHAR(160) NOT NULL,
    permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- COMPANIES
-- =====================================================================
CREATE TABLE companies (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name          VARCHAR(160) NOT NULL UNIQUE,
    slug          VARCHAR(180) NOT NULL UNIQUE,
    logo_url      TEXT,
    website       TEXT,
    industry      VARCHAR(120),
    hq_city       VARCHAR(80),
    hq_country    VARCHAR(80),
    size_range    VARCHAR(40),                  -- '1-10','11-50','51-200'...
    about         TEXT,
    is_verified   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at    TIMESTAMPTZ
);
CREATE INDEX idx_companies_name_trgm ON companies USING gin (name gin_trgm_ops);

ALTER TABLE recruiters
    ADD CONSTRAINT fk_recruiters_company
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;

-- =====================================================================
-- COLLEGES
-- =====================================================================
CREATE TABLE colleges (
    id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name               VARCHAR(200) NOT NULL,
    slug               VARCHAR(220) NOT NULL UNIQUE,
    short_name         VARCHAR(60),
    logo_url           TEXT,
    banner_url         TEXT,
    type               college_type NOT NULL,
    established_year   SMALLINT,
    affiliated_to      VARCHAR(200),
    approved_by        TEXT[],                  -- ['AICTE','UGC','NAAC']
    naac_grade         VARCHAR(5),
    nirf_rank          INT,
    city               VARCHAR(80) NOT NULL,
    state              VARCHAR(80) NOT NULL,
    country            VARCHAR(80) NOT NULL DEFAULT 'India',
    address            TEXT,
    latitude           NUMERIC(9,6),
    longitude          NUMERIC(9,6),
    website            TEXT,
    email              CITEXT,
    phone              VARCHAR(20),
    about              TEXT,
    infrastructure     JSONB NOT NULL DEFAULT '{}'::jsonb,  -- {library,labs,sports,wifi,...}
    facilities         TEXT[],
    hostel_available   BOOLEAN NOT NULL DEFAULT FALSE,
    hostel_fee_lpa     NUMERIC(6,2),
    avg_package_lpa    NUMERIC(6,2),
    highest_package_lpa NUMERIC(6,2),
    placement_percent  NUMERIC(5,2),
    total_students     INT,
    total_faculty      INT,
    student_faculty_ratio NUMERIC(5,2),
    rating             NUMERIC(3,2) NOT NULL DEFAULT 0,     -- computed avg
    reviews_count      INT NOT NULL DEFAULT 0,
    admission_process  TEXT,
    is_featured        BOOLEAN NOT NULL DEFAULT FALSE,
    is_published       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at         TIMESTAMPTZ
);
CREATE INDEX idx_colleges_state_city   ON colleges(state, city) WHERE deleted_at IS NULL;
CREATE INDEX idx_colleges_type         ON colleges(type);
CREATE INDEX idx_colleges_rating       ON colleges(rating DESC);
CREATE INDEX idx_colleges_avg_package  ON colleges(avg_package_lpa DESC);
CREATE INDEX idx_colleges_name_trgm    ON colleges USING gin (name gin_trgm_ops);
CREATE INDEX idx_colleges_facilities   ON colleges USING gin (facilities);

CREATE TABLE courses (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id     UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    name           VARCHAR(160) NOT NULL,
    degree_level   VARCHAR(40) NOT NULL,        -- 'UG','PG','Diploma','PhD'
    duration_years NUMERIC(3,1) NOT NULL,
    total_seats    INT,
    fees_per_year_lpa NUMERIC(6,2),
    total_fees_lpa NUMERIC(6,2),
    eligibility    TEXT,
    entrance_exams TEXT[],
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(college_id, name, degree_level)
);
CREATE INDEX idx_courses_college ON courses(college_id);

CREATE TABLE placements (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id          UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    year                SMALLINT NOT NULL,
    students_placed     INT,
    total_eligible      INT,
    highest_package_lpa NUMERIC(6,2),
    avg_package_lpa     NUMERIC(6,2),
    median_package_lpa  NUMERIC(6,2),
    top_recruiters      TEXT[],
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(college_id, year)
);

CREATE TABLE college_gallery (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id  UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    image_url   TEXT NOT NULL,
    caption     VARCHAR(200),
    sort_order  INT NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE college_top_recruiters (
    college_id  UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    company_id  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    PRIMARY KEY (college_id, company_id)
);

-- =====================================================================
-- INTERNSHIPS
-- =====================================================================
CREATE TABLE internships (
    id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id         UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    posted_by          UUID REFERENCES users(id),
    title              VARCHAR(200) NOT NULL,
    slug               VARCHAR(240) NOT NULL UNIQUE,
    domain             VARCHAR(120) NOT NULL,   -- 'Software','Data','Marketing'
    location_city      VARCHAR(80),
    location_state     VARCHAR(80),
    work_mode          work_mode NOT NULL,
    duration_months    SMALLINT NOT NULL,
    stipend_min        INT,
    stipend_max        INT,
    stipend_currency   CHAR(3) NOT NULL DEFAULT 'INR',
    openings           INT NOT NULL DEFAULT 1,
    experience_min_years NUMERIC(3,1) DEFAULT 0,
    description        TEXT NOT NULL,
    responsibilities   TEXT[],
    requirements       TEXT[],
    skills             TEXT[] NOT NULL DEFAULT '{}',
    benefits           TEXT[],
    perks              TEXT[],
    eligibility_batches TEXT[],                 -- ['2024','2025']
    is_active          BOOLEAN NOT NULL DEFAULT TRUE,
    apply_deadline     TIMESTAMPTZ,
    posted_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at         TIMESTAMPTZ
);
CREATE INDEX idx_internships_company        ON internships(company_id);
CREATE INDEX idx_internships_domain         ON internships(domain);
CREATE INDEX idx_internships_workmode       ON internships(work_mode);
CREATE INDEX idx_internships_active_posted  ON internships(is_active, posted_at DESC);
CREATE INDEX idx_internships_skills_gin     ON internships USING gin (skills);
CREATE INDEX idx_internships_title_trgm     ON internships USING gin (title gin_trgm_ops);

-- =====================================================================
-- APPLICATIONS (polymorphic-ish via target_kind)
-- =====================================================================
CREATE TABLE applications (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id    UUID NOT NULL REFERENCES students(user_id) ON DELETE CASCADE,
    target_kind   VARCHAR(20) NOT NULL,        -- 'internship','college','scholarship','hackathon','workshop'
    target_id     UUID NOT NULL,
    status        application_status NOT NULL DEFAULT 'submitted',
    cover_letter  TEXT,
    resume_url    TEXT,
    answers       JSONB NOT NULL DEFAULT '{}'::jsonb,
    reviewed_by   UUID REFERENCES users(id),
    reviewed_at   TIMESTAMPTZ,
    review_notes  TEXT,
    submitted_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(student_id, target_kind, target_id)
);
CREATE INDEX idx_applications_student ON applications(student_id);
CREATE INDEX idx_applications_target  ON applications(target_kind, target_id);
CREATE INDEX idx_applications_status  ON applications(status);

-- =====================================================================
-- HACKATHONS / WORKSHOPS / SCHOLARSHIPS / ROADMAPS / BLOGS
-- =====================================================================
CREATE TABLE hackathons (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title             VARCHAR(200) NOT NULL,
    slug              VARCHAR(240) NOT NULL UNIQUE,
    organiser         VARCHAR(200),
    banner_url        TEXT,
    description       TEXT,
    themes            TEXT[],
    rules             TEXT,
    prizes            JSONB NOT NULL DEFAULT '[]'::jsonb,  -- [{rank,title,amount}]
    sponsors          JSONB NOT NULL DEFAULT '[]'::jsonb,
    mode              work_mode NOT NULL DEFAULT 'onsite',
    location_city     VARCHAR(80),
    registration_start TIMESTAMPTZ,
    registration_end  TIMESTAMPTZ,
    event_start       TIMESTAMPTZ NOT NULL,
    event_end         TIMESTAMPTZ NOT NULL,
    max_team_size     SMALLINT,
    registration_fee  NUMERIC(10,2) NOT NULL DEFAULT 0,
    website           TEXT,
    is_published      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at        TIMESTAMPTZ
);
CREATE INDEX idx_hackathons_event_start ON hackathons(event_start DESC);

CREATE TABLE workshops (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title          VARCHAR(200) NOT NULL,
    slug           VARCHAR(240) NOT NULL UNIQUE,
    category       VARCHAR(80) NOT NULL,       -- 'Programming','AI/ML','Cloud','Design'
    banner_url     TEXT,
    description    TEXT,
    agenda         JSONB NOT NULL DEFAULT '[]'::jsonb,
    instructor_id  UUID REFERENCES users(id),
    instructor_bio TEXT,
    mode           work_mode NOT NULL DEFAULT 'online',
    duration_days  SMALLINT,
    starts_at      TIMESTAMPTZ NOT NULL,
    ends_at        TIMESTAMPTZ NOT NULL,
    seats_total    INT,
    seats_left     INT,
    price          NUMERIC(10,2) NOT NULL DEFAULT 0,
    currency       CHAR(3) NOT NULL DEFAULT 'INR',
    certificate    BOOLEAN NOT NULL DEFAULT FALSE,
    rating         NUMERIC(3,2) NOT NULL DEFAULT 0,
    reviews_count  INT NOT NULL DEFAULT 0,
    is_published   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at     TIMESTAMPTZ
);
CREATE INDEX idx_workshops_category ON workshops(category);
CREATE INDEX idx_workshops_starts   ON workshops(starts_at);

CREATE TABLE scholarships (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title             VARCHAR(200) NOT NULL,
    slug              VARCHAR(240) NOT NULL UNIQUE,
    provider          VARCHAR(200),
    banner_url        TEXT,
    description       TEXT,
    eligibility       TEXT,
    benefits          TEXT,
    amount            NUMERIC(12,2),
    currency          CHAR(3) NOT NULL DEFAULT 'INR',
    required_docs     TEXT[],
    application_url   TEXT,
    application_start TIMESTAMPTZ,
    application_end   TIMESTAMPTZ NOT NULL,
    tags              TEXT[],
    is_published      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at        TIMESTAMPTZ
);
CREATE INDEX idx_scholarships_deadline ON scholarships(application_end);
CREATE INDEX idx_scholarships_tags_gin ON scholarships USING gin (tags);

CREATE TABLE career_roadmaps (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title         VARCHAR(160) NOT NULL,        -- 'Full Stack Developer'
    slug          VARCHAR(200) NOT NULL UNIQUE,
    banner_url    TEXT,
    summary       TEXT,
    total_weeks   SMALLINT,
    difficulty    VARCHAR(20),                  -- 'beginner','intermediate','advanced'
    tags          TEXT[],
    stages        JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{stage,weeks,topics,resources,projects}]
    interview_qs  JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_published  BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at    TIMESTAMPTZ
);

CREATE TABLE blogs (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id     UUID REFERENCES users(id),
    title         VARCHAR(240) NOT NULL,
    slug          VARCHAR(280) NOT NULL UNIQUE,
    cover_url     TEXT,
    excerpt       VARCHAR(400),
    content_md    TEXT NOT NULL,
    tags          TEXT[],
    read_minutes  SMALLINT,
    views         BIGINT NOT NULL DEFAULT 0,
    is_published  BOOLEAN NOT NULL DEFAULT FALSE,
    published_at  TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at    TIMESTAMPTZ
);
CREATE INDEX idx_blogs_published ON blogs(is_published, published_at DESC);
CREATE INDEX idx_blogs_tags_gin  ON blogs USING gin (tags);

-- =====================================================================
-- ENGAGEMENT: SAVED, REVIEWS, RATINGS, NOTIFICATIONS, MESSAGES
-- =====================================================================
CREATE TABLE saved_items (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    kind        saved_kind NOT NULL,
    target_id   UUID NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, kind, target_id)
);
CREATE INDEX idx_saved_user_kind ON saved_items(user_id, kind);

CREATE TABLE reviews (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    kind        saved_kind NOT NULL,           -- college | workshop | ...
    target_id   UUID NOT NULL,
    rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title       VARCHAR(180),
    body        TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at  TIMESTAMPTZ,
    UNIQUE(user_id, kind, target_id)
);
CREATE INDEX idx_reviews_target ON reviews(kind, target_id);

CREATE TABLE notifications (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    channel     notification_ch NOT NULL DEFAULT 'in_app',
    title       VARCHAR(200) NOT NULL,
    body        TEXT,
    action_url  TEXT,
    metadata    JSONB NOT NULL DEFAULT '{}'::jsonb,
    read_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_notif_user_unread ON notifications(user_id, read_at NULLS FIRST, created_at DESC);

CREATE TABLE alumni_profiles (
    user_id       UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    college_id    UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    grad_year     SMALLINT NOT NULL,
    current_company UUID REFERENCES companies(id),
    current_role  VARCHAR(160),
    experience_years NUMERIC(4,1),
    linkedin_url  TEXT,
    open_to_mentor BOOLEAN NOT NULL DEFAULT FALSE,
    mentor_topics TEXT[],
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_alumni_college_year ON alumni_profiles(college_id, grad_year);
CREATE INDEX idx_alumni_mentor ON alumni_profiles(open_to_mentor) WHERE open_to_mentor = TRUE;

CREATE TABLE messages (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body        TEXT NOT NULL,
    read_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_messages_thread ON messages(sender_id, receiver_id, created_at DESC);

CREATE TABLE contact_messages (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(120) NOT NULL,
    email       CITEXT NOT NULL,
    subject     VARCHAR(200),
    message     TEXT NOT NULL,
    handled     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE faq (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category   VARCHAR(80) NOT NULL,
    question   VARCHAR(300) NOT NULL,
    answer     TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active  BOOLEAN NOT NULL DEFAULT TRUE
);

-- =====================================================================
-- AI FINDER: persist recommendation runs (auditable + cacheable)
-- =====================================================================
CREATE TABLE ai_finder_runs (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id     UUID NOT NULL REFERENCES students(user_id) ON DELETE CASCADE,
    input_payload  JSONB NOT NULL,               -- form answers
    model_version  VARCHAR(40) NOT NULL,
    results        JSONB NOT NULL,               -- [{college_id, score, pros, cons, predicted_package}]
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ai_finder_student ON ai_finder_runs(student_id, created_at DESC);

-- =====================================================================
-- AUDIT: generic activity log
-- =====================================================================
CREATE TABLE activity_log (
    id          BIGSERIAL PRIMARY KEY,
    user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    action      VARCHAR(80) NOT NULL,           -- 'login','apply','save','review'...
    entity      VARCHAR(40),
    entity_id   UUID,
    metadata    JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address  INET,
    user_agent  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_activity_user_time ON activity_log(user_id, created_at DESC);
CREATE INDEX idx_activity_entity    ON activity_log(entity, entity_id);

-- =====================================================================
-- TRIGGERS: keep updated_at fresh
-- =====================================================================
CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DO $$ DECLARE t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'users','students','companies','colleges','internships','applications',
    'hackathons','workshops','scholarships','career_roadmaps','blogs','reviews'
  ]) LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_%1$s_touch BEFORE UPDATE ON %1$s
       FOR EACH ROW EXECUTE FUNCTION touch_updated_at();', t);
  END LOOP;
END $$;
