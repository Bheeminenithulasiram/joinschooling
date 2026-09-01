"""Comprehensive unit and authorization tests for role-based dashboards and resource ownership."""
import uuid
import pytest
from fastapi.testclient import TestClient

from app.core.security import create_access_token
from app.database.session import Base, SessionLocal, engine
from app.main import create_app
from app.middlewares.ratelimit import limiter
from app.models import (
    College,
    CollegeRepresentative,
    Company,
    CompanyRecruiter,
    Student,
    User,
)

app = create_app()
limiter.enabled = False
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture
def auth_users():
    """Create authentic users for each role: student, college_rep, recruiter, admin."""
    db_session = SessionLocal()
    try:
        uid = uuid.uuid4().hex[:8]

        # 1. Company
        comp_a = Company(name=f"Alpha Corp {uid}", slug=f"alpha-corp-{uid}", industry="Tech", website="https://alpha.com")
        comp_b = Company(name=f"Beta LLC {uid}", slug=f"beta-llc-{uid}", industry="Finance", website="https://beta.com")
        db_session.add_all([comp_a, comp_b])

        # 2. College
        college_a = College(
            name=f"VNR VJIET {uid}",
            slug=f"vnr-vjiet-{uid}",
            short_name="VNR",
            type="private",
            state="Telangana",
            city="Hyderabad",
            is_published=True,
        )
        db_session.add(college_a)
        db_session.flush()

        # 3. Student User
        student_user = User(
            email=f"student_{uid}@joinschooling.com",
            password_hash="fakehash123",
            role="student",
            is_active=True,
            is_email_verified=True,
        )
        db_session.add(student_user)
        db_session.flush()
        student_profile = Student(user_id=student_user.id, first_name="Aarav", last_name="Sharma")
        db_session.add(student_profile)

        # 4. College Rep User
        college_rep_user = User(
            email=f"rep_{uid}@joinschooling.com",
            password_hash="fakehash123",
            role="college_rep",
            is_active=True,
            is_email_verified=True,
        )
        db_session.add(college_rep_user)
        db_session.flush()
        college_rep_profile = CollegeRepresentative(
            user_id=college_rep_user.id,
            college_id=college_a.id,
            college_name=college_a.name,
            first_name="Dr. Rajiv",
            last_name="Reddy",
            designation="Dean of Admissions",
            is_verified=True,
        )
        db_session.add(college_rep_profile)

        # 5. Recruiter User
        recruiter_user = User(
            email=f"recruiter_{uid}@joinschooling.com",
            password_hash="fakehash123",
            role="recruiter",
            is_active=True,
            is_email_verified=True,
        )
        db_session.add(recruiter_user)
        db_session.flush()
        recruiter_profile = CompanyRecruiter(
            user_id=recruiter_user.id,
            company_id=comp_a.id,
            company_name=comp_a.name,
            first_name="Priya",
            last_name="Nair",
            designation="Lead Recruiter",
            is_verified=True,
        )
        db_session.add(recruiter_profile)

        # 6. Admin User
        admin_user = User(
            email=f"admin_{uid}@joinschooling.com",
            password_hash="fakehash123",
            role="admin",
            is_active=True,
            is_email_verified=True,
        )
        db_session.add(admin_user)
        db_session.commit()

        # Generate access tokens
        student_token, _ = create_access_token(student_user.id, "student")
        college_rep_token, _ = create_access_token(college_rep_user.id, "college_rep")
        recruiter_token, _ = create_access_token(recruiter_user.id, "recruiter")
        admin_token, _ = create_access_token(admin_user.id, "admin")

        return {
            "student": {"id": student_user.id, "token": student_token},
            "college_rep": {"id": college_rep_user.id, "token": college_rep_token, "college_id": college_a.id, "college_name": college_a.name},
            "recruiter": {"id": recruiter_user.id, "token": recruiter_token, "company_a_id": comp_a.id, "company_b_id": comp_b.id},
            "admin": {"id": admin_user.id, "token": admin_token},
        }
    finally:
        db_session.close()


def test_student_dashboard_authorization(auth_users):
    """Student can access student dashboard, but is forbidden from college, recruiter, and admin dashboards."""
    student_headers = {"Authorization": f"Bearer {auth_users['student']['token']}"}

    # 1. Student dashboard -> ALLOW
    res = client.get("/api/v1/me/dashboard", headers=student_headers)
    assert res.status_code == 200
    data = res.json()
    assert "stats" in data
    assert "recent_applications" in data

    # 2. College dashboard -> FORBIDDEN (403)
    res = client.get("/api/v1/me/college-dashboard", headers=student_headers)
    assert res.status_code == 403

    # 3. Recruiter dashboard -> FORBIDDEN (403)
    res = client.get("/api/v1/me/recruiter-dashboard", headers=student_headers)
    assert res.status_code == 403

    # 4. Admin dashboard -> FORBIDDEN (403)
    res = client.get("/api/v1/me/admin-dashboard", headers=student_headers)
    assert res.status_code == 403


def test_college_rep_dashboard_authorization(auth_users):
    """College Rep can access college dashboard, but is forbidden from student, recruiter, and admin dashboards."""
    rep_headers = {"Authorization": f"Bearer {auth_users['college_rep']['token']}"}

    # 1. College dashboard -> ALLOW
    res = client.get("/api/v1/me/college-dashboard", headers=rep_headers)
    assert res.status_code == 200
    data = res.json()
    assert "VNR VJIET" in data["representative"]["college_name"]
    assert "stats" in data

    # 2. Student dashboard -> FORBIDDEN (403)
    res = client.get("/api/v1/me/dashboard", headers=rep_headers)
    assert res.status_code == 403

    # 3. Recruiter dashboard -> FORBIDDEN (403)
    res = client.get("/api/v1/me/recruiter-dashboard", headers=rep_headers)
    assert res.status_code == 403

    # 4. Admin dashboard -> FORBIDDEN (403)
    res = client.get("/api/v1/me/admin-dashboard", headers=rep_headers)
    assert res.status_code == 403


def test_recruiter_dashboard_authorization(auth_users):
    """Recruiter can access recruiter dashboard, but is forbidden from student, college, and admin dashboards."""
    recruiter_headers = {"Authorization": f"Bearer {auth_users['recruiter']['token']}"}

    # 1. Recruiter dashboard -> ALLOW
    res = client.get("/api/v1/me/recruiter-dashboard", headers=recruiter_headers)
    assert res.status_code == 200
    data = res.json()
    assert "Alpha Corp" in data["recruiter"]["company_name"]
    assert "active_postings" in data["stats"]

    # 2. Student dashboard -> FORBIDDEN (403)
    res = client.get("/api/v1/me/dashboard", headers=recruiter_headers)
    assert res.status_code == 403

    # 3. College dashboard -> FORBIDDEN (403)
    res = client.get("/api/v1/me/college-dashboard", headers=recruiter_headers)
    assert res.status_code == 403

    # 4. Admin dashboard -> FORBIDDEN (403)
    res = client.get("/api/v1/me/admin-dashboard", headers=recruiter_headers)
    assert res.status_code == 403


def test_admin_dashboard_authorization(auth_users):
    """Admin has access to admin dashboard and supervisory oversight."""
    admin_headers = {"Authorization": f"Bearer {auth_users['admin']['token']}"}

    # 1. Admin dashboard -> ALLOW
    res = client.get("/api/v1/me/admin-dashboard", headers=admin_headers)
    assert res.status_code == 200
    data = res.json()
    assert "users" in data["stats"]
    assert "colleges" in data["stats"]
    assert "companies" in data["stats"]

    # 2. Can also supervise other dashboards
    res_student = client.get("/api/v1/me/dashboard", headers=admin_headers)
    assert res_student.status_code == 200

    res_college = client.get("/api/v1/me/college-dashboard", headers=admin_headers)
    assert res_college.status_code == 200

    res_recruiter = client.get("/api/v1/me/recruiter-dashboard", headers=admin_headers)
    assert res_recruiter.status_code == 200


def test_recruiter_resource_ownership(auth_users):
    """Recruiter cannot post opportunities on behalf of a company they do not own."""
    recruiter_headers = {"Authorization": f"Bearer {auth_users['recruiter']['token']}"}
    comp_b_id = auth_users["recruiter"]["company_b_id"]

    # Attempting to post an internship for Company B -> FORBIDDEN (403)
    payload_fraud = {
        "company_id": comp_b_id,
        "title": "Unauthorized Software Engineer Intern",
        "domain": "Software Engineering",
        "work_mode": "remote",
        "duration_months": 3,
        "description": "Unauthorized posting test.",
    }
    res = client.post("/api/v1/internships", json=payload_fraud, headers=recruiter_headers)
    assert res.status_code == 403
