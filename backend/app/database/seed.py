"""Seed the DB with demo colleges, companies, internships and an admin user."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone

from slugify import slugify
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.database.session import Base, SessionLocal, engine
from app.models import College, Company, Internship, Student, User


DEMO_COLLEGES = [
    {
        "name": "VNR VJIET",
        "short_name": "VNR",
        "type": "private",
        "state": "Telangana",
        "city": "Hyderabad",
        "naac_grade": "A++",
        "nirf_rank": 113,
        "avg_package_lpa": 8.5,
        "highest_package_lpa": 45.0,
        "placement_percent": 92.0,
        "hostel_available": True,
        "hostel_fee_lpa": 1.2,
        "facilities": ["Library", "Sports", "Wi-Fi", "Hostel", "Auditorium"],
        "rating": 4.4,
        "reviews_count": 682,
        "about": "Autonomous engineering institute affiliated with JNTUH known for strong CS placements.",
        "is_featured": True,
        "logo_url": "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=200&h=200&fit=crop",
        "banner_url": "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&h=400&fit=crop",
    },
    {
        "name": "GITAM University",
        "short_name": "GITAM",
        "type": "deemed",
        "state": "Andhra Pradesh",
        "city": "Visakhapatnam",
        "naac_grade": "A+",
        "nirf_rank": 76,
        "avg_package_lpa": 7.2,
        "highest_package_lpa": 39.0,
        "placement_percent": 89.0,
        "hostel_available": True,
        "hostel_fee_lpa": 1.4,
        "facilities": ["Library", "Sports", "Wi-Fi", "Hostel", "Medical"],
        "rating": 4.3,
        "reviews_count": 510,
        "logo_url": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=200&h=200&fit=crop",
        "banner_url": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&h=400&fit=crop",
    },
    {
        "name": "KL University",
        "short_name": "KLU",
        "type": "deemed",
        "state": "Andhra Pradesh",
        "city": "Vijayawada",
        "naac_grade": "A++",
        "nirf_rank": 50,
        "avg_package_lpa": 6.8,
        "highest_package_lpa": 42.0,
        "placement_percent": 85.0,
        "hostel_available": True,
        "hostel_fee_lpa": 1.3,
        "facilities": ["Library", "Sports", "Wi-Fi", "Hostel", "Innovation Lab"],
        "rating": 4.2,
        "reviews_count": 421,
        "logo_url": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=200&h=200&fit=crop",
        "banner_url": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&h=400&fit=crop",
    },
    {
        "name": "BVRIT Hyderabad",
        "short_name": "BVRIT",
        "type": "autonomous",
        "state": "Telangana",
        "city": "Hyderabad",
        "naac_grade": "A",
        "avg_package_lpa": 6.5,
        "highest_package_lpa": 30.0,
        "placement_percent": 80.0,
        "hostel_available": True,
        "hostel_fee_lpa": 1.1,
        "facilities": ["Library", "Sports", "Wi-Fi", "Hostel"],
        "rating": 4.1,
        "reviews_count": 298,
        "logo_url": "https://images.unsplash.com/photo-1589161410160-3f43408514b8?q=80&w=200&h=200&fit=crop",
        "banner_url": "https://images.unsplash.com/photo-1589161410160-3f43408514b8?q=80&w=1200&h=400&fit=crop",
    },
    {
        "name": "IIT Bombay",
        "short_name": "IITB",
        "type": "government",
        "state": "Maharashtra",
        "city": "Mumbai",
        "naac_grade": "A++",
        "nirf_rank": 3,
        "avg_package_lpa": 21.5,
        "highest_package_lpa": 210.0,
        "placement_percent": 96.0,
        "hostel_available": True,
        "hostel_fee_lpa": 0.5,
        "facilities": ["Library", "Sports", "Wi-Fi", "Hostel", "Research Labs"],
        "rating": 4.9,
        "reviews_count": 3211,
        "is_featured": True,
        "logo_url": "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=200&h=200&fit=crop",
        "banner_url": "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1200&h=400&fit=crop",
    },
]

DEMO_COMPANIES = [
    {"name": "Amazon", "industry": "Technology", "logo_url": "https://logo.clearbit.com/amazon.com", "website": "https://amazon.jobs"},
    {"name": "Microsoft", "industry": "Technology", "logo_url": "https://logo.clearbit.com/microsoft.com", "website": "https://careers.microsoft.com"},
    {"name": "TCS", "industry": "Consulting", "logo_url": "https://logo.clearbit.com/tcs.com", "website": "https://tcs.com/careers"},
    {"name": "Google", "industry": "Technology", "logo_url": "https://logo.clearbit.com/google.com", "website": "https://careers.google.com"},
    {"name": "Infosys", "industry": "Consulting", "logo_url": "https://logo.clearbit.com/infosys.com", "website": "https://infosys.com/careers"},
    {"name": "ZS Associates", "industry": "Consulting", "logo_url": "https://logo.clearbit.com/zs.com", "website": "https://zs.com/careers"},
]

DEMO_INTERNSHIPS = [
    {
        "company": "Amazon",
        "title": "Software Development Intern",
        "domain": "Software",
        "work_mode": "remote",
        "duration_months": 2,
        "stipend_min": 30000,
        "stipend_max": 30000,
        "location_city": "Hyderabad",
        "location_state": "Telangana",
        "description": "Work with a talented team on real-world Software Development projects.",
        "skills": ["Java", "DSA", "Problem Solving"],
        "requirements": ["Strong DSA", "Java or Python", "2024/2025 batch"],
        "responsibilities": ["Develop & maintain software", "Collaborate cross-functionally", "Code reviews"],
        "benefits": ["PPO potential", "Mentorship", "Certificate"],
        "eligibility_batches": ["2024", "2025"],
    },
    {
        "company": "Microsoft",
        "title": "Software Engineering Intern",
        "domain": "Software",
        "work_mode": "hybrid",
        "duration_months": 6,
        "stipend_min": 120000,
        "stipend_max": 120000,
        "location_city": "Bangalore",
        "location_state": "Karnataka",
        "description": "Contribute to Azure or M365 team as a Software Engineering Intern.",
        "skills": ["C++", "DSA", "System Design"],
        "requirements": ["Excellent problem solving", "OOP fundamentals"],
        "responsibilities": ["Ship features", "Own service reliability"],
        "benefits": ["PPO", "Housing stipend"],
        "eligibility_batches": ["2025"],
    },
    {
        "company": "TCS",
        "title": "Data Science Intern",
        "domain": "Data",
        "work_mode": "hybrid",
        "duration_months": 3,
        "stipend_min": 25000,
        "stipend_max": 25000,
        "location_city": "Hyderabad",
        "location_state": "Telangana",
        "description": "Build ML pipelines on real client data.",
        "skills": ["Python", "ML", "Statistics"],
        "requirements": ["Python + pandas", "Statistics fundamentals"],
        "responsibilities": ["Model building", "Data cleaning", "Dashboards"],
        "benefits": ["Certificate"],
        "eligibility_batches": ["2024", "2025"],
    },
    {
        "company": "ZS Associates",
        "title": "Business Analytics Associate",
        "domain": "Analytics",
        "work_mode": "hybrid",
        "duration_months": 4,
        "stipend_min": 30000,
        "stipend_max": 30000,
        "location_city": "Pune",
        "location_state": "Maharashtra",
        "description": "Solve business problems for pharma clients using Excel/SQL.",
        "skills": ["Excel", "SQL", "Analytics"],
        "requirements": ["Excellent communication", "SQL"],
        "responsibilities": ["Client analytics", "Deck building"],
        "benefits": ["PPO potential"],
        "eligibility_batches": ["2024", "2025"],
    },
]


def _get_or_create_college(db: Session, payload: dict) -> College:
    slug = slugify(payload["name"])
    row = db.query(College).filter(College.slug == slug).first()
    if row:
        return row
    row = College(slug=slug, country="India", **payload)
    db.add(row)
    return row


def _get_or_create_company(db: Session, payload: dict) -> Company:
    slug = slugify(payload["name"])
    row = db.query(Company).filter(Company.slug == slug).first()
    if row:
        return row
    row = Company(slug=slug, is_verified=True, **payload)
    db.add(row)
    return row


def _get_or_create_internship(db: Session, company: Company, payload: dict) -> Internship:
    slug = slugify(payload["title"] + "-" + company.slug)
    row = db.query(Internship).filter(Internship.slug == slug).first()
    if row:
        return row
    row = Internship(
        company_id=company.id,
        title=payload["title"],
        slug=slug,
        domain=payload["domain"],
        work_mode=payload["work_mode"],
        duration_months=payload["duration_months"],
        stipend_min=payload["stipend_min"],
        stipend_max=payload["stipend_max"],
        location_city=payload["location_city"],
        location_state=payload["location_state"],
        description=payload["description"],
        skills=payload["skills"],
        requirements=payload["requirements"],
        responsibilities=payload["responsibilities"],
        benefits=payload["benefits"],
        eligibility_batches=payload["eligibility_batches"],
        apply_deadline=datetime.now(tz=timezone.utc) + timedelta(days=30),
    )
    db.add(row)
    return row


def _ensure_users(db: Session) -> None:
    if not db.query(User).filter(User.email == "admin@educonnect.dev").first():
        admin = User(
            email="admin@educonnect.dev",
            password_hash=hash_password("admin1234"),
            role="admin",
            is_email_verified=True,
        )
        db.add(admin)
    if not db.query(User).filter(User.email == "student@educonnect.dev").first():
        student = User(
            email="student@educonnect.dev",
            password_hash=hash_password("student1234"),
            role="student",
            is_email_verified=True,
        )
        db.add(student)
        db.flush()
        db.add(Student(
            user_id=student.id, first_name="Ravi", last_name="Kumar",
            state="Telangana", city="Hyderabad",
            twelfth_percentage=89, cgpa=8.6,
            preferred_course="Computer Science Engineering",
            budget_min_lpa=1.0, budget_max_lpa=3.0,
            hostel_required=True, expected_package_lpa=12,
            skills=["Python", "React", "DSA"],
        ))


def seed(reset: bool = False) -> None:
    if reset:
        Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        for c in DEMO_COLLEGES:
            _get_or_create_college(db, c)
        db.flush()

        companies = {c["name"]: _get_or_create_company(db, c) for c in DEMO_COMPANIES}
        db.flush()

        for i in DEMO_INTERNSHIPS:
            _get_or_create_internship(db, companies[i["company"]], i)

        _ensure_users(db)
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    import sys
    seed(reset="--reset" in sys.argv)
    print("Seeded successfully")
