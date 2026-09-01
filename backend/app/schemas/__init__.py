"""Pydantic v2 request/response DTOs."""
from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator


class Pagination(BaseModel):
    page: int
    page_size: int
    total: int
    has_next: bool


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    confirm_password: Optional[str] = Field(default=None, min_length=8, max_length=128)
    first_name: str = Field(min_length=1, max_length=80)
    last_name: str = Field(min_length=1, max_length=80)
    role: Literal["student", "college_rep", "recruiter"] = "student"
    phone: Optional[str] = Field(default=None, max_length=20)
    
    # Student specifics:
    preferred_course: Optional[str] = None
    graduation_year: Optional[int] = None
    # College Rep specifics:
    college_name: Optional[str] = None
    designation: Optional[str] = None
    official_email: Optional[EmailStr] = None
    website_url: Optional[str] = None
    # Recruiter specifics:
    company_name: Optional[str] = None
    industry: Optional[str] = None

    @model_validator(mode="after")
    def verify_password_match(self) -> "RegisterRequest":
        if self.confirm_password is not None and self.password != self.confirm_password:
            raise ValueError("Passwords do not match.")
        return self


class AuthShowcaseCollege(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    slug: str
    name: str
    short_name: Optional[str] = None
    city: str
    state: str
    type: str
    nirf_rank: Optional[int] = None
    naac_grade: Optional[str] = None
    avg_package_lpa: Optional[float] = None
    highest_package_lpa: Optional[float] = None
    placement_percent: Optional[float] = None
    rating: float
    reviews_count: int
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None


class AuthShowcaseCompany(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    industry: Optional[str] = None
    logo_url: Optional[str] = None
    website: Optional[str] = None


class AuthShowcaseStats(BaseModel):
    total_colleges: int
    total_companies: int
    total_internships: int
    highest_package_lpa: float
    avg_placement_percent: float


class AuthShowcaseResponse(BaseModel):
    colleges: List[AuthShowcaseCollege]
    companies: List[AuthShowcaseCompany]
    stats: AuthShowcaseStats



class GoogleAuthRequest(BaseModel):
    credential: str
    role: Optional[Literal["student", "college_rep", "recruiter"]] = "student"


class EmailVerifyRequest(BaseModel):
    token: str = Field(min_length=16, max_length=128)


class ResendVerifyRequest(BaseModel):
    email: EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    code: str
    new_password: str = Field(min_length=8, max_length=128)


class AuthTokens(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user_id: Optional[str] = None
    role: Optional[str] = None
    email: Optional[str] = None


class StudentProfile(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    first_name: str
    last_name: str
    avatar_url: Optional[str] = None
    headline: Optional[str] = None
    tenth_percentage: Optional[float] = None
    twelfth_percentage: Optional[float] = None
    cgpa: Optional[float] = None
    preferred_course: Optional[str] = None
    budget_min_lpa: Optional[float] = None
    budget_max_lpa: Optional[float] = None
    state: Optional[str] = None
    city: Optional[str] = None
    hostel_required: Optional[bool] = None
    expected_package_lpa: Optional[float] = None
    skills: List[str] = Field(default_factory=list)
    preferred_companies: List[str] = Field(default_factory=list)


class CollegeRepProfile(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    first_name: str
    last_name: str
    college_name: str
    designation: str
    official_email: Optional[str] = None
    website_url: Optional[str] = None
    is_verified: bool = False


class RecruiterProfile(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    first_name: str
    last_name: str
    company_name: str
    designation: str
    industry: Optional[str] = None
    website_url: Optional[str] = None
    is_verified: bool = False


class StudentProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    avatar_url: Optional[str] = None
    headline: Optional[str] = None
    tenth_percentage: Optional[float] = None
    twelfth_percentage: Optional[float] = None
    cgpa: Optional[float] = None
    preferred_course: Optional[str] = None
    budget_min_lpa: Optional[float] = None
    budget_max_lpa: Optional[float] = None
    state: Optional[str] = None
    city: Optional[str] = None
    hostel_required: Optional[bool] = None
    expected_package_lpa: Optional[float] = None
    skills: Optional[List[str]] = None
    preferred_companies: Optional[List[str]] = None


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    email: EmailStr
    role: str
    is_email_verified: bool
    profile: Optional[Any] = None
    student: Optional[StudentProfile] = None
    college_rep: Optional[CollegeRepProfile] = None
    recruiter_profile: Optional[RecruiterProfile] = None


class CollegeCard(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    slug: str
    name: str
    short_name: Optional[str] = None
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None
    city: str
    state: str
    type: str
    naac_grade: Optional[str] = None
    nirf_rank: Optional[int] = None
    avg_package_lpa: Optional[float] = None
    highest_package_lpa: Optional[float] = None
    placement_percent: Optional[float] = None
    rating: float
    reviews_count: int


class CourseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    degree_level: str
    duration_years: float
    total_seats: Optional[int] = None
    fees_per_year_lpa: Optional[float] = None
    entrance_exams: List[str] = Field(default_factory=list)


class PlacementYearOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    year: int
    students_placed: Optional[int] = None
    total_eligible: Optional[int] = None
    highest_package_lpa: Optional[float] = None
    avg_package_lpa: Optional[float] = None
    top_recruiters: List[str] = Field(default_factory=list)


class CollegeDetail(CollegeCard):
    about: Optional[str] = None
    website: Optional[str] = None
    infrastructure: Dict[str, Any] = Field(default_factory=dict)
    facilities: List[str] = Field(default_factory=list)
    hostel_available: bool = False
    hostel_fee_lpa: Optional[float] = None
    admission_process: Optional[str] = None
    courses: List[CourseOut] = Field(default_factory=list)
    placements: List[PlacementYearOut] = Field(default_factory=list)


class PagedColleges(BaseModel):
    items: List[CollegeCard]
    pagination: Pagination


class CollegeCreate(BaseModel):
    name: str
    slug: Optional[str] = None
    type: Literal["government", "private", "deemed", "autonomous"]
    city: str
    state: str
    country: str = "India"
    naac_grade: Optional[str] = None
    nirf_rank: Optional[int] = None
    hostel_available: bool = False
    avg_package_lpa: Optional[float] = None
    highest_package_lpa: Optional[float] = None
    placement_percent: Optional[float] = None
    facilities: List[str] = Field(default_factory=list)
    about: Optional[str] = None


class CompanyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    slug: str
    logo_url: Optional[str] = None
    industry: Optional[str] = None


class InternshipCard(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    slug: str
    title: str
    domain: str
    work_mode: str
    duration_months: int
    stipend_min: Optional[int] = None
    stipend_max: Optional[int] = None
    location_city: Optional[str] = None
    posted_at: datetime
    apply_deadline: Optional[datetime] = None
    company: Optional[CompanyOut] = None


class InternshipDetail(InternshipCard):
    description: str
    responsibilities: List[str] = Field(default_factory=list)
    requirements: List[str] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=list)
    benefits: List[str] = Field(default_factory=list)
    eligibility_batches: List[str] = Field(default_factory=list)


class PagedInternships(BaseModel):
    items: List[InternshipCard]
    pagination: Pagination


class InternshipCreate(BaseModel):
    company_id: str
    title: str
    slug: Optional[str] = None
    domain: str
    work_mode: Literal["remote", "hybrid", "onsite"]
    duration_months: int = Field(ge=1, le=24)
    description: str
    stipend_min: Optional[int] = Field(default=None, ge=0)
    stipend_max: Optional[int] = Field(default=None, ge=0)
    location_city: Optional[str] = None
    location_state: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    requirements: List[str] = Field(default_factory=list)
    responsibilities: List[str] = Field(default_factory=list)
    benefits: List[str] = Field(default_factory=list)
    eligibility_batches: List[str] = Field(default_factory=list)
    apply_deadline: Optional[datetime] = None


class ApplyRequest(BaseModel):
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    answers: Dict[str, Any] = Field(default_factory=dict)


class ApplicationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    target_kind: str
    target_id: str
    status: str
    submitted_at: datetime


class SavedCreate(BaseModel):
    kind: Literal["college", "internship", "workshop", "hackathon", "scholarship", "roadmap", "blog"]
    target_id: str


class SavedOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    kind: str
    target_id: str
    created_at: datetime


class DashboardStats(BaseModel):
    applications: int
    saved_colleges: int
    saved_internships: int
    unread_notifs: int


class DashboardSnapshot(BaseModel):
    stats: DashboardStats
    recent_applications: List[ApplicationOut]
    recommended_colleges: List[CollegeCard]
    upcoming_deadlines: List[Dict[str, Any]] = Field(default_factory=list)


class AiFinderRequest(BaseModel):
    tenth_percentage: float = Field(ge=0, le=100)
    twelfth_percentage: float = Field(ge=0, le=100)
    cgpa: Optional[float] = Field(default=None, ge=0, le=10)
    preferred_course: str
    budget_min_lpa: Optional[float] = Field(default=None, ge=0)
    budget_max_lpa: float = Field(gt=0)
    state: Optional[str] = None
    city: Optional[str] = None
    hostel_required: Optional[bool] = None
    expected_package_lpa: Optional[float] = Field(default=None, ge=0)
    preferred_companies: List[str] = Field(default_factory=list)


class AiFinderMatch(BaseModel):
    college: CollegeCard
    match_score: float
    pros: List[str] = Field(default_factory=list)
    cons: List[str] = Field(default_factory=list)
    predicted_package_lpa: Optional[float] = None
    admission_probability: Optional[float] = None


class AiFinderResponse(BaseModel):
    run_id: str
    recommendations: List[AiFinderMatch]


class ProblemDetail(BaseModel):
    type: str = "about:blank"
    title: str
    status: int
    detail: Optional[str] = None
    errors: Optional[List[Dict[str, Any]]] = None


class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    kind: str
    title: str
    body: Optional[str] = None
    href: Optional[str] = None
    read: bool
    created_at: datetime

    @model_validator(mode="before")
    @classmethod
    def _map_fields(cls, data: Any) -> Any:
        if not isinstance(data, dict):
            return {
                "id": data.id,
                "kind": getattr(data, "channel", "system"),
                "title": data.title,
                "body": data.body,
                "href": getattr(data, "action_url", None),
                "read": getattr(data, "read_at", None) is not None,
                "created_at": data.created_at,
            }
        return data
