"""Current user endpoints: /me + dashboard aggregation."""
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database.session import get_db
from app.models import (
    Application,
    College,
    Notification,
    SavedItem,
    Student,
    User,
)
from app.schemas import (
    ApplicationOut,
    CollegeCard,
    DashboardSnapshot,
    DashboardStats,
    StudentProfile,
    StudentProfileUpdate,
    UserOut,
    NotificationOut,
)

router = APIRouter(tags=["Users"])


def _to_user_out(user: User) -> UserOut:
    profile = StudentProfile.model_validate(user.student) if user.student else None
    return UserOut(
        id=user.id,
        email=user.email,
        role=user.role,
        is_email_verified=user.is_email_verified,
        profile=profile,
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
    if not current.student:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only students can update profile here")
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(current.student, key, value)
    db.commit()
    db.refresh(current)
    return _to_user_out(current)


@router.get("/me/dashboard", response_model=DashboardSnapshot)
def dashboard(current: User = Depends(get_current_user), db: Session = Depends(get_db)) -> DashboardSnapshot:
    if current.role != "student":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Dashboard is student-only")

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

    # Recommended colleges: state match if student has a state, else featured
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


@router.get("/me/notifications", response_model=List[NotificationOut])
def my_notifications(current: User = Depends(get_current_user), db: Session = Depends(get_db)) -> List[NotificationOut]:
    if current.role != "student":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Students only")
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
        Notification.read_at.is_(None)
    ).update({Notification.read_at: datetime.now(tz=timezone.utc)}, synchronize_session=False)
    db.commit()
