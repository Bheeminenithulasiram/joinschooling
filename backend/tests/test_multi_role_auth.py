"""Comprehensive test suite for Multi-Role Auth, Email Verification, Showcase, and Atomic Rollbacks."""
import uuid
import pytest
from fastapi.testclient import TestClient

from app.database.session import Base, SessionLocal, engine
from app.main import create_app
from app.middlewares.ratelimit import limiter
from app.models import User

app = create_app()
limiter.enabled = False
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield


def test_student_registration_and_login():
    uid = uuid.uuid4().hex[:8]
    email = f"student_{uid}@example.com"
    reg_resp = client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": "Password123!",
            "confirm_password": "Password123!",
            "first_name": "Karthik",
            "last_name": "Rao",
            "role": "student",
            "preferred_course": "B.Tech CSE",
        },
    )
    assert reg_resp.status_code == 201
    data = reg_resp.json()
    assert "access_token" in data
    assert data["role"] == "student"

    # Profile lookup
    me_resp = client.get("/api/v1/me", headers={"Authorization": f"Bearer {data['access_token']}"})
    assert me_resp.status_code == 200
    me_data = me_resp.json()
    assert me_data["role"] == "student"
    assert me_data["student"]["first_name"] == "Karthik"


def test_password_mismatch_leaves_zero_db_records():
    uid = uuid.uuid4().hex[:8]
    email = f"mismatch_{uid}@example.com"
    reg_resp = client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": "Password123!",
            "confirm_password": "CompletelyDifferentPassword456!",
            "first_name": "Failed",
            "last_name": "User",
            "role": "student",
        },
    )
    assert reg_resp.status_code == 422

    # Verify zero records in DB
    db = SessionLocal()
    try:
        user_in_db = db.query(User).filter(User.email == email).first()
        assert user_in_db is None, "Failed registration must NOT persist any record in DB!"
    finally:
        db.close()


def test_college_rep_registration():
    uid = uuid.uuid4().hex[:8]
    email = f"dean_{uid}@example.com"
    reg_resp = client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": "Password123!",
            "confirm_password": "Password123!",
            "first_name": "Dr. Ramesh",
            "last_name": "Reddy",
            "role": "college_rep",
            "college_name": "IIT Bombay",
            "designation": "Dean of Admissions",
            "official_email": f"dean_{uid}@iitb.ac.in",
        },
    )
    assert reg_resp.status_code == 201
    data = reg_resp.json()
    assert data["role"] == "college_rep"

    # College Dashboard
    dash_resp = client.get("/api/v1/me/college-dashboard", headers={"Authorization": f"Bearer {data['access_token']}"})
    assert dash_resp.status_code == 200
    dash_data = dash_resp.json()
    assert "representative" in dash_data
    assert dash_data["representative"]["designation"] == "Dean of Admissions"


def test_recruiter_registration():
    uid = uuid.uuid4().hex[:8]
    email = f"recruiter_{uid}@example.com"
    reg_resp = client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": "Password123!",
            "confirm_password": "Password123!",
            "first_name": "Sarah",
            "last_name": "Jenkins",
            "role": "recruiter",
            "company_name": "Amazon",
            "designation": "Technical Recruiter",
            "industry": "E-Commerce / Cloud",
        },
    )
    assert reg_resp.status_code == 201
    data = reg_resp.json()
    assert data["role"] == "recruiter"

    # Recruiter Dashboard
    dash_resp = client.get("/api/v1/me/recruiter-dashboard", headers={"Authorization": f"Bearer {data['access_token']}"})
    assert dash_resp.status_code == 200
    dash_data = dash_resp.json()
    assert "recruiter" in dash_data
    assert dash_data["recruiter"]["company_name"] == "Amazon"


def test_block_admin_public_registration():
    uid = uuid.uuid4().hex[:8]
    email = f"malicious_{uid}@example.com"
    reg_resp = client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": "Password123!",
            "confirm_password": "Password123!",
            "first_name": "Bad",
            "last_name": "Actor",
            "role": "admin",
        },
    )
    assert reg_resp.status_code in (403, 422)


def test_google_auth_flow():
    import jwt
    uid = uuid.uuid4().hex[:8]
    email = f"google_{uid}@gmail.com"
    mock_token = jwt.encode(
        {"sub": f"google-uid-{uid}", "email": email, "given_name": "Google", "family_name": "User"},
        "key",
        algorithm="HS256",
    )
    
    auth_resp = client.post(
        "/api/v1/auth/google",
        json={"credential": mock_token, "role": "student"},
    )
    assert auth_resp.status_code == 200
    data = auth_resp.json()
    assert "access_token" in data
    assert data["email"] == email


def test_auth_showcase_endpoint():
    resp = client.get("/api/v1/auth/showcase")
    assert resp.status_code == 200
    data = resp.json()
    assert "colleges" in data
    assert "companies" in data
    assert "stats" in data
    assert data["stats"]["total_colleges"] >= 1
