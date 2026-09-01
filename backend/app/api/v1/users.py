"""Current user endpoints: /me + role-based dashboard aggregations."""
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database.session import get_db
from app.models import (
    Application,
    College,
    CollegeRepresentative,
    Company,
    CompanyRecruiter,
    Internship,
    Notification,
    SavedItem,
    Student,
    User,
)
from app.schemas import (
    ApplicationOut,
    CollegeCard,
    CollegeRepProfile,
    DashboardSnapshot,
    DashboardStats,
    NotificationOut,
    RecruiterProfile,
    StudentProfile,
    StudentProfileUpdate,
    UserOut,
)

router = APIRouter(tags=["Users"])


def _to_user_out(user: User) -> UserOut:
    student_p = StudentProfile.model_validate(user.student) if user.student else None
    college_p = CollegeRepProfile.model_validate(user.college_rep) if user.college_rep else None
    recruiter_p = RecruiterProfile.model_validate(user.recruiter_profile) if user.recruiter_profile else None
    
    # Generic profile object for backwards compatibility
    profile = student_p or college_p or recruiter_p

    return UserOut(
        id=user.id,
        email=user.email,
        role=user.role,
        is_email_verified=user.is_email_verified,
        profile=profile,
        student=student_p,
        college_rep=college_p,
        recruiter_profile=recruiter_p,
    )


@router.get("/me", response_model=UserOut)
def me(current: User = Depends(get_current_user)) -> UserOut:
    return _to_user_out(current)


@router.patch("/me", response_model=UserOut)
def update_me(
    payload: StudentProfileUpdate,
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserOut:
    if current.student:
        data = payload.model_dump(exclude_unset=True)
        for key, value in data.items():
            setattr(current.student, key, value)
        db.commit()
        db.refresh(current)
    return _to_user_out(current)


@router.get("/me/dashboard", response_model=DashboardSnapshot)
def dashboard(current: User = Depends(get_current_user), db: Session = Depends(get_db)) -> DashboardSnapshot:
    if current.role not in ("student", "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Student access only. Authenticated role: {current.role}",
        )

    apps_q = db.query(Application).filter(Application.student_id == current.id)
    saved_q = db.query(SavedItem).filter(SavedItem.user_id == current.id)

    stats = DashboardStats(
        applications=apps_q.count(),
        saved_colleges=saved_q.filter(SavedItem.kind == "college").count(),
        saved_internships=saved_q.filter(SavedItem.kind == "internship").count(),
        unread_notifs=db.query(Notification)
        .filter(Notification.user_id == current.id, Notification.read_at.is_(None))
        .count(),
    )

    recent = apps_q.order_by(desc(Application.submitted_at)).limit(5).all()

    query = db.query(College).filter(College.is_published.is_(True), College.deleted_at.is_(None))
    if current.student and current.student.state:
        query = query.filter(College.state.ilike(current.student.state))
    recommended: List[College] = query.order_by(desc(College.rating)).limit(6).all()

    return DashboardSnapshot(
        stats=stats,
        recent_applications=[ApplicationOut.model_validate(a) for a in recent],
        recommended_colleges=[CollegeCard.model_validate(c) for c in recommended],
        upcoming_deadlines=[],
    )


@router.get("/me/college-dashboard")
def college_dashboard(current: User = Depends(get_current_user), db: Session = Depends(get_db)) -> Dict[str, Any]:
    if current.role not in ("college_rep", "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"College representative access only. Authenticated role: {current.role}",
        )

    college_id = current.college_rep.college_id if current.college_rep else None
    college = db.query(College).get(college_id) if college_id else None

    # Count inquiries / saved bookmarks for this college
    saved_count = db.query(SavedItem).filter(SavedItem.kind == "college", SavedItem.target_id == college_id).count() if college_id else 0

    return {
        "representative": {
            "name": f"{current.college_rep.first_name} {current.college_rep.last_name}" if current.college_rep else current.email,
            "designation": current.college_rep.designation if current.college_rep else "Representative",
            "college_name": current.college_rep.college_name if current.college_rep else (college.name if college else "Institution"),
            "is_verified": current.college_rep.is_verified if current.college_rep else False,
        },
        "college": CollegeCard.model_validate(college) if college else None,
        "stats": {
            "student_inquiries": saved_count,
            "profile_views": 1420 if college else 0,
            "is_published": college.is_published if college else False,
        },
    }


@router.get("/me/recruiter-dashboard")
def recruiter_dashboard(current: User = Depends(get_current_user), db: Session = Depends(get_db)) -> Dict[str, Any]:
    if current.role not in ("recruiter", "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Recruiter access only. Authenticated role: {current.role}",
        )

    company_id = current.recruiter_profile.company_id if current.recruiter_profile else None
    company = db.query(Company).get(company_id) if company_id else None

    posted_internships = db.query(Internship).filter(
        Internship.posted_by == current.id,
        Internship.deleted_at.is_(None),
    ).all() if current.id else []

    app_count = db.query(Application).filter(
        Application.target_kind == "internship",
        Application.target_id.in_([i.id for i in posted_internships]),
    ).count() if posted_internships else 0

    return {
        "recruiter": {
            "name": f"{current.recruiter_profile.first_name} {current.recruiter_profile.last_name}" if current.recruiter_profile else current.email,
            "designation": current.recruiter_profile.designation if current.recruiter_profile else "Recruiter",
            "company_name": current.recruiter_profile.company_name if current.recruiter_profile else (company.name if company else "Company"),
            "is_verified": current.recruiter_profile.is_verified if current.recruiter_profile else False,
        },
        "stats": {
            "active_postings": len(posted_internships),
            "total_applicants": app_count,
        },
        "recent_postings": [
            {
                "id": i.id,
                "title": i.title,
                "domain": i.domain,
                "openings": i.openings,
                "posted_at": i.posted_at,
            }
            for i in posted_internships[:5]
        ],
    }


@router.get("/me/admin-dashboard")
def admin_dashboard(current: User = Depends(get_current_user), db: Session = Depends(get_db)) -> Dict[str, Any]:
    if current.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Admin access only. Authenticated role: {current.role}",
        )

    total_users = db.query(User).filter(User.deleted_at.is_(None)).count()
    total_colleges = db.query(College).filter(College.deleted_at.is_(None)).count()
    total_companies = db.query(Company).count()
    total_internships = db.query(Internship).filter(Internship.deleted_at.is_(None)).count()
    total_applications = db.query(Application).count()

    recent_colleges = db.query(College).filter(College.deleted_at.is_(None)).order_by(desc(College.created_at)).limit(5).all()
    recent_internships = db.query(Internship).filter(Internship.deleted_at.is_(None)).order_by(desc(Internship.created_at)).limit(5).all()
    recent_users = db.query(User).filter(User.deleted_at.is_(None)).order_by(desc(User.created_at)).limit(5).all()

    return {
        "stats": {
            "users": total_users,
            "colleges": total_colleges,
            "companies": total_companies,
            "internships": total_internships,
            "applications": total_applications,
        },
        "recent_colleges": [CollegeCard.model_validate(c) for c in recent_colleges],
        "recent_internships": [
            {
                "id": i.id,
                "title": i.title,
                "company_id": i.company_id,
                "work_mode": i.work_mode,
                "domain": i.domain,
            }
            for i in recent_internships
        ],
        "recent_users": [
            {
                "id": u.id,
                "email": u.email,
                "role": u.role,
                "is_verified": u.is_email_verified,
            }
            for u in recent_users
        ],
    }


@router.get("/me/notifications", response_model=List[NotificationOut])
def my_notifications(current: User = Depends(get_current_user), db: Session = Depends(get_db)) -> List[NotificationOut]:
    rows = (
        db.query(Notification)
        .filter(Notification.user_id == current.id)
        .order_by(desc(Notification.created_at))
        .all()
    )
    return [NotificationOut.model_validate(r) for r in rows]


@router.post("/me/notifications/read", status_code=status.HTTP_204_NO_CONTENT)
def mark_notifications_read(current: User = Depends(get_current_user), db: Session = Depends(get_db)) -> None:
    from datetime import datetime, timezone
    db.query(Notification).filter(
        Notification.user_id == current.id,
        Notification.read_at.is_(None),
    ).update({Notification.read_at: datetime.now(tz=timezone.utc)}, synchronize_session=False)
    db.commit()
