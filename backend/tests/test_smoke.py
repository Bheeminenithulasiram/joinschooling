"""End-to-end smoke test using SQLite. Requires: httpx.

Run: PYTHONPATH=. pytest -q  (or run this file directly)
"""
from __future__ import annotations

import os
import tempfile

import pytest

# Force sqlite BEFORE importing app modules
_tmp = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
_tmp.close()
os.environ["DATABASE_URL"] = f"sqlite:///{_tmp.name}"
os.environ["APP_ENV"] = "test"
os.environ["JWT_SECRET"] = "test-secret-for-smoke-only-123"

from fastapi.testclient import TestClient  # noqa: E402

from app.database.seed import seed  # noqa: E402
from app.main import app  # noqa: E402


@pytest.fixture(scope="module")
def client():
    seed(reset=True)
    with TestClient(app) as c:
        yield c


def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_list_colleges(client):
    r = client.get("/api/v1/colleges")
    assert r.status_code == 200
    body = r.json()
    assert body["pagination"]["total"] >= 5
    assert body["items"][0]["name"]


def test_college_detail(client):
    r = client.get("/api/v1/colleges/vnr-vjiet")
    assert r.status_code == 200
    body = r.json()
    assert body["slug"] == "vnr-vjiet"
    assert body["placement_percent"] == 92.0


def test_list_internships(client):
    r = client.get("/api/v1/internships?work_mode=hybrid")
    assert r.status_code == 200
    body = r.json()
    assert body["pagination"]["total"] >= 1
    for item in body["items"]:
        assert item["work_mode"] == "hybrid"


def test_register_login_and_me(client):
    email = "e2e@example.com"
    r = client.post("/api/v1/auth/register", json={
        "email": email, "password": "password123",
        "first_name": "Test", "last_name": "User",
    })
    assert r.status_code == 201, r.text
    tokens = r.json()
    assert tokens["access_token"] and tokens["refresh_token"]

    r = client.post("/api/v1/auth/login", json={"email": email, "password": "password123"})
    assert r.status_code == 200
    tokens = r.json()

    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    r = client.get("/api/v1/me", headers=headers)
    assert r.status_code == 200
    body = r.json()
    assert body["email"] == email
    assert body["role"] == "student"
    assert body["profile"]["first_name"] == "Test"


def test_refresh_flow(client):
    r = client.post("/api/v1/auth/login", json={"email": "student@educonnect.dev", "password": "student1234"})
    tokens = r.json()

    r = client.post("/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]})
    assert r.status_code == 200
    new = r.json()
    assert new["refresh_token"] != tokens["refresh_token"]

    # Old refresh token now revoked
    r = client.post("/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]})
    assert r.status_code == 401


def test_ai_finder(client):
    r = client.post("/api/v1/auth/login", json={"email": "student@educonnect.dev", "password": "student1234"})
    token = r.json()["access_token"]

    r = client.post(
        "/api/v1/ai/college-finder",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "tenth_percentage": 94,
            "twelfth_percentage": 89,
            "cgpa": 8.6,
            "preferred_course": "Computer Science Engineering",
            "budget_max_lpa": 3.0,
            "state": "Telangana",
            "hostel_required": True,
            "expected_package_lpa": 12,
            "preferred_companies": ["Amazon", "Microsoft"],
        },
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["run_id"]
    assert len(body["recommendations"]) >= 1
    top = body["recommendations"][0]
    assert 0 <= top["match_score"] <= 1
    assert 0 <= top["admission_probability"] <= 1


def test_dashboard(client):
    r = client.post("/api/v1/auth/login", json={"email": "student@educonnect.dev", "password": "student1234"})
    token = r.json()["access_token"]

    r = client.get("/api/v1/me/dashboard", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    body = r.json()
    assert "stats" in body
    assert len(body["recommended_colleges"]) > 0


def test_saved_and_internship_apply(client):
    r = client.post("/api/v1/auth/login", json={"email": "student@educonnect.dev", "password": "student1234"})
    token = r.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # save a college
    colleges = client.get("/api/v1/colleges").json()["items"]
    r = client.post("/api/v1/saved", headers=headers, json={"kind": "college", "target_id": colleges[0]["id"]})
    assert r.status_code == 201

    # duplicate save -> 409
    r = client.post("/api/v1/saved", headers=headers, json={"kind": "college", "target_id": colleges[0]["id"]})
    assert r.status_code == 409

    # apply to an internship
    internships = client.get("/api/v1/internships").json()["items"]
    intern_id = internships[0]["id"]
    r = client.post(
        f"/api/v1/internships/{intern_id}/apply",
        headers=headers,
        json={"cover_letter": "I'm excited to join!", "answers": {"notice_period": "immediate"}},
    )
    assert r.status_code == 201, r.text
    app_row = r.json()
    assert app_row["target_kind"] == "internship"
    assert app_row["status"] == "submitted"

    # duplicate apply -> 409
    r = client.post(
        f"/api/v1/internships/{intern_id}/apply",
        headers=headers, json={"cover_letter": "again"},
    )
    assert r.status_code == 409

    r = client.get("/api/v1/applications", headers=headers)
    assert r.status_code == 200
    assert any(a["target_id"] == intern_id for a in r.json())
