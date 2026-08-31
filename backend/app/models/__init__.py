"""SQLAlchemy ORM models. Mirrors schema.sql from the blueprint.

For dev portability we use portable types (String/JSON) so the same models
work on SQLite (dev) and PostgreSQL (prod). In production the Alembic
migration should convert JSON -> JSONB and add GIN indexes per schema.sql.
"""
from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any, List, Optional

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum as SAEnum,
    ForeignKey,
    Integer,
    JSON,
    Numeric,
    SmallInteger,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


def _uuid() -> str:
    return str(uuid.uuid4())


UserRole = SAEnum("student", "admin", "recruiter", "mentor", "college_rep", name="user_role")
ApplicationStatus = SAEnum(
    "draft", "submitted", "under_review", "shortlisted", "rejected",
    "accepted", "withdrawn", name="application_status",
)
WorkMode = SAEnum("remote", "hybrid", "onsite", name="work_mode")
CollegeType = SAEnum("government", "private", "deemed", "autonomous", name="college_type")
SavedKind = SAEnum(
    "college", "internship", "workshop", "hackathon",
    "scholarship", "roadmap", "blog", name="saved_kind",
)


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class SoftDeleteMixin:
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


class User(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    phone: Mapped[Optional[str]] = mapped_column(String(20), unique=True, nullable=True)
    password_hash: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    google_id: Mapped[Optional[str]] = mapped_column(String(255), unique=True, nullable=True)
    role: Mapped[str] = mapped_column(UserRole, nullable=False, default="student")
    is_email_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    last_login_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    student = relationship("Student", uselist=False, back_populates="user", cascade="all, delete-orphan")
    college_rep = relationship("CollegeRepresentative", uselist=False, back_populates="user", cascade="all, delete-orphan")
    recruiter_profile = relationship("CompanyRecruiter", uselist=False, back_populates="user", cascade="all, delete-orphan")
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
    email_verification_tokens = relationship("EmailVerificationToken", back_populates="user", cascade="all, delete-orphan")


class EmailVerificationToken(Base):
    __tablename__ = "email_verification_tokens"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    token_hash: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    used_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="email_verification_tokens")


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    token_hash: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    user_agent: Mapped[Optional[str]] = mapped_column(Text)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45))
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    revoked_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="refresh_tokens")


class Student(Base, TimestampMixin):
    __tablename__ = "students"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    first_name: Mapped[str] = mapped_column(String(80), nullable=False)
    last_name: Mapped[str] = mapped_column(String(80), nullable=False)
    avatar_url: Mapped[Optional[str]] = mapped_column(Text)
    headline: Mapped[Optional[str]] = mapped_column(String(160))
    bio: Mapped[Optional[str]] = mapped_column(Text)
    tenth_percentage: Mapped[Optional[float]] = mapped_column(Numeric(5, 2))
    twelfth_percentage: Mapped[Optional[float]] = mapped_column(Numeric(5, 2))
    degree: Mapped[Optional[str]] = mapped_column(String(120))
    cgpa: Mapped[Optional[float]] = mapped_column(Numeric(4, 2))
    graduation_year: Mapped[Optional[int]] = mapped_column(SmallInteger)
    preferred_course: Mapped[Optional[str]] = mapped_column(String(120))
    budget_min_lpa: Mapped[Optional[float]] = mapped_column(Numeric(6, 2))
    budget_max_lpa: Mapped[Optional[float]] = mapped_column(Numeric(6, 2))
    state: Mapped[Optional[str]] = mapped_column(String(80))
    city: Mapped[Optional[str]] = mapped_column(String(80))
    hostel_required: Mapped[Optional[bool]] = mapped_column(Boolean)
    expected_package_lpa: Mapped[Optional[float]] = mapped_column(Numeric(6, 2))
    preferred_companies: Mapped[List[str]] = mapped_column(JSON, default=list)
    skills: Mapped[List[str]] = mapped_column(JSON, default=list)
    resume_url: Mapped[Optional[str]] = mapped_column(Text)
    linkedin_url: Mapped[Optional[str]] = mapped_column(Text)
    github_url: Mapped[Optional[str]] = mapped_column(Text)

    user = relationship("User", back_populates="student")


class CollegeRepresentative(Base, TimestampMixin):
    __tablename__ = "college_representatives"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    college_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("colleges.id", ondelete="SET NULL"), nullable=True, index=True)
    college_name: Mapped[str] = mapped_column(String(200), nullable=False)
    first_name: Mapped[str] = mapped_column(String(80), nullable=False)
    last_name: Mapped[str] = mapped_column(String(80), nullable=False)
    designation: Mapped[str] = mapped_column(String(120), nullable=False)
    official_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    website_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    user = relationship("User", back_populates="college_rep")
    college = relationship("College")


class CompanyRecruiter(Base, TimestampMixin):
    __tablename__ = "company_recruiters"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    company_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("companies.id", ondelete="SET NULL"), nullable=True, index=True)
    company_name: Mapped[str] = mapped_column(String(160), nullable=False)
    first_name: Mapped[str] = mapped_column(String(80), nullable=False)
    last_name: Mapped[str] = mapped_column(String(80), nullable=False)
    designation: Mapped[str] = mapped_column(String(120), nullable=False)
    industry: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    website_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    user = relationship("User", back_populates="recruiter_profile")
    company = relationship("Company")


class Company(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "companies"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    name: Mapped[str] = mapped_column(String(160), unique=True, nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(180), unique=True, nullable=False, index=True)
    logo_url: Mapped[Optional[str]] = mapped_column(Text)
    website: Mapped[Optional[str]] = mapped_column(Text)
    industry: Mapped[Optional[str]] = mapped_column(String(120))
    hq_city: Mapped[Optional[str]] = mapped_column(String(80))
    hq_country: Mapped[Optional[str]] = mapped_column(String(80))
    about: Mapped[Optional[str]] = mapped_column(Text)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)


class College(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "colleges"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(220), unique=True, nullable=False, index=True)
    short_name: Mapped[Optional[str]] = mapped_column(String(60))
    logo_url: Mapped[Optional[str]] = mapped_column(Text)
    banner_url: Mapped[Optional[str]] = mapped_column(Text)
    type: Mapped[str] = mapped_column(CollegeType, nullable=False)
    established_year: Mapped[Optional[int]] = mapped_column(SmallInteger)
    approved_by: Mapped[List[str]] = mapped_column(JSON, default=list)
    naac_grade: Mapped[Optional[str]] = mapped_column(String(5))
    nirf_rank: Mapped[Optional[int]] = mapped_column(Integer, index=True)
    city: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    state: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    country: Mapped[str] = mapped_column(String(80), nullable=False, default="India")
    address: Mapped[Optional[str]] = mapped_column(Text)
    website: Mapped[Optional[str]] = mapped_column(Text)
    email: Mapped[Optional[str]] = mapped_column(String(255))
    phone: Mapped[Optional[str]] = mapped_column(String(20))
    about: Mapped[Optional[str]] = mapped_column(Text)
    infrastructure: Mapped[dict] = mapped_column(JSON, default=dict)
    facilities: Mapped[List[str]] = mapped_column(JSON, default=list)
    hostel_available: Mapped[bool] = mapped_column(Boolean, default=False)
    hostel_fee_lpa: Mapped[Optional[float]] = mapped_column(Numeric(6, 2))
    avg_package_lpa: Mapped[Optional[float]] = mapped_column(Numeric(6, 2), index=True)
    highest_package_lpa: Mapped[Optional[float]] = mapped_column(Numeric(6, 2))
    placement_percent: Mapped[Optional[float]] = mapped_column(Numeric(5, 2))
    total_students: Mapped[Optional[int]] = mapped_column(Integer)
    rating: Mapped[float] = mapped_column(Numeric(3, 2), default=0)
    reviews_count: Mapped[int] = mapped_column(Integer, default=0)
    admission_process: Mapped[Optional[str]] = mapped_column(Text)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)

    courses = relationship("Course", back_populates="college", cascade="all, delete-orphan")
    placements = relationship("Placement", back_populates="college", cascade="all, delete-orphan")


class Course(Base):
    __tablename__ = "courses"
    __table_args__ = (UniqueConstraint("college_id", "name", "degree_level", name="uq_courses_college_name_level"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    college_id: Mapped[str] = mapped_column(String(36), ForeignKey("colleges.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    degree_level: Mapped[str] = mapped_column(String(40), nullable=False)
    duration_years: Mapped[float] = mapped_column(Numeric(3, 1), nullable=False)
    total_seats: Mapped[Optional[int]] = mapped_column(Integer)
    fees_per_year_lpa: Mapped[Optional[float]] = mapped_column(Numeric(6, 2))
    total_fees_lpa: Mapped[Optional[float]] = mapped_column(Numeric(6, 2))
    eligibility: Mapped[Optional[str]] = mapped_column(Text)
    entrance_exams: Mapped[List[str]] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    college = relationship("College", back_populates="courses")


class Placement(Base):
    __tablename__ = "placements"
    __table_args__ = (UniqueConstraint("college_id", "year", name="uq_placements_college_year"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    college_id: Mapped[str] = mapped_column(String(36), ForeignKey("colleges.id", ondelete="CASCADE"), nullable=False, index=True)
    year: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    students_placed: Mapped[Optional[int]] = mapped_column(Integer)
    total_eligible: Mapped[Optional[int]] = mapped_column(Integer)
    highest_package_lpa: Mapped[Optional[float]] = mapped_column(Numeric(6, 2))
    avg_package_lpa: Mapped[Optional[float]] = mapped_column(Numeric(6, 2))
    top_recruiters: Mapped[List[str]] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    college = relationship("College", back_populates="placements")


class Internship(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "internships"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    company_id: Mapped[str] = mapped_column(String(36), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    posted_by: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(240), unique=True, nullable=False, index=True)
    domain: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    location_city: Mapped[Optional[str]] = mapped_column(String(80))
    location_state: Mapped[Optional[str]] = mapped_column(String(80))
    work_mode: Mapped[str] = mapped_column(WorkMode, nullable=False, index=True)
    duration_months: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    stipend_min: Mapped[Optional[int]] = mapped_column(Integer)
    stipend_max: Mapped[Optional[int]] = mapped_column(Integer)
    stipend_currency: Mapped[str] = mapped_column(String(3), default="INR")
    openings: Mapped[int] = mapped_column(Integer, default=1)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    responsibilities: Mapped[List[str]] = mapped_column(JSON, default=list)
    requirements: Mapped[List[str]] = mapped_column(JSON, default=list)
    skills: Mapped[List[str]] = mapped_column(JSON, default=list)
    benefits: Mapped[List[str]] = mapped_column(JSON, default=list)
    eligibility_batches: Mapped[List[str]] = mapped_column(JSON, default=list)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    apply_deadline: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    posted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)

    company = relationship("Company")


class Application(Base):
    __tablename__ = "applications"
    __table_args__ = (UniqueConstraint("student_id", "target_kind", "target_id", name="uq_app_student_target"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    student_id: Mapped[str] = mapped_column(String(36), ForeignKey("students.user_id", ondelete="CASCADE"), nullable=False, index=True)
    target_kind: Mapped[str] = mapped_column(String(20), nullable=False)
    target_id: Mapped[str] = mapped_column(String(36), nullable=False)
    status: Mapped[str] = mapped_column(ApplicationStatus, nullable=False, default="submitted")
    cover_letter: Mapped[Optional[str]] = mapped_column(Text)
    resume_url: Mapped[Optional[str]] = mapped_column(Text)
    answers: Mapped[dict] = mapped_column(JSON, default=dict)
    reviewed_by: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id"))
    reviewed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class SavedItem(Base):
    __tablename__ = "saved_items"
    __table_args__ = (UniqueConstraint("user_id", "kind", "target_id", name="uq_saved_user_kind_target"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    kind: Mapped[str] = mapped_column(SavedKind, nullable=False)
    target_id: Mapped[str] = mapped_column(String(36), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Review(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "reviews"
    __table_args__ = (UniqueConstraint("user_id", "kind", "target_id", name="uq_review_user_kind_target"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    kind: Mapped[str] = mapped_column(SavedKind, nullable=False)
    target_id: Mapped[str] = mapped_column(String(36), nullable=False, index=True)
    rating: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    title: Mapped[Optional[str]] = mapped_column(String(180))
    body: Mapped[Optional[str]] = mapped_column(Text)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    channel: Mapped[str] = mapped_column(String(20), default="in_app")
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    body: Mapped[Optional[str]] = mapped_column(Text)
    action_url: Mapped[Optional[str]] = mapped_column(Text)
    metadata_json: Mapped[dict] = mapped_column("metadata", JSON, default=dict)
    read_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)


class AiFinderRun(Base):
    __tablename__ = "ai_finder_runs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    student_id: Mapped[str] = mapped_column(String(36), ForeignKey("students.user_id", ondelete="CASCADE"), nullable=False, index=True)
    input_payload: Mapped[dict] = mapped_column(JSON, nullable=False)
    model_version: Mapped[str] = mapped_column(String(40), nullable=False)
    results: Mapped[Any] = mapped_column(JSON, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)


__all__ = [
    "User", "RefreshToken", "EmailVerificationToken", "Student",
    "CollegeRepresentative", "CompanyRecruiter",
    "Company", "College", "Course", "Placement",
    "Internship", "Application", "SavedItem", "Review",
    "Notification", "AiFinderRun",
]
