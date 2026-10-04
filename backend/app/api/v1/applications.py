"""Applications: list mine + status updates."""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc, or_
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database.session import get_db
from app.models import Application, Internship, Student, User
from app.schemas import ApplicationOut, ApplicationStatusUpdate

router = APIRouter(prefix="/applications", tags=["Applications"])


@router.get("", response_model=List[ApplicationOut])
def my_applications(current: User = Depends(get_current_user), db: Session = Depends(get_db)) -> List[ApplicationOut]:
    if current.role not in ("student", "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Student access only. Authenticated role: {current.role}",
        )
    rows = (
        db.query(Application)
        .filter(Application.student_id == current.id)
        .order_by(desc(Application.submitted_at))
        .all()
    )
    internship_ids = [r.target_id for r in rows if r.target_kind == "internship"]
    internships_map = {i.id: i for i in db.query(Internship).filter(Internship.id.in_(internship_ids)).all()} if internship_ids else {}
    results = []
    for r in rows:
        out = ApplicationOut.model_validate(r)
        if r.target_kind == "internship" and r.target_id in internships_map:
            out.target_title = internships_map[r.target_id].title
        results.append(out)
    return results


@router.get("/candidates", response_model=List[ApplicationOut])
def recruiter_candidates(
    internship_id: Optional[str] = None,
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> List[ApplicationOut]:
    if current.role not in ("recruiter", "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Recruiter access only. Authenticated role: {current.role}",
        )

    # Resource ownership: find all internships belonging to this recruiter's company
    company_id = current.recruiter_profile.company_id if current.recruiter_profile else None
    filters = [Internship.posted_by == current.id]
    if company_id:
        filters.append(Internship.company_id == company_id)

    owned_internships = db.query(Internship).filter(or_(*filters)).all()
    owned_ids = [i.id for i in owned_internships]

    if not owned_ids and current.role != "admin":
        return []

    query = db.query(Application).filter(Application.target_kind == "internship")
    if current.role != "admin":
        query = query.filter(Application.target_id.in_(owned_ids))

    if internship_id:
        query = query.filter(Application.target_id == internship_id)

    apps = query.order_by(desc(Application.submitted_at)).all()
    if not apps:
        return []

    student_ids = list({a.student_id for a in apps})
    target_ids = list({a.target_id for a in apps})

    students_map = {s.user_id: s for s in db.query(Student).filter(Student.user_id.in_(student_ids)).all()}
    users_map = {u.id: u for u in db.query(User).filter(User.id.in_(student_ids)).all()}
    internships_map = {i.id: i for i in db.query(Internship).filter(Internship.id.in_(target_ids)).all()}

    results = []
    for a in apps:
        out = ApplicationOut.model_validate(a)
        student = students_map.get(a.student_id)
        student_user = users_map.get(a.student_id)
        internship = internships_map.get(a.target_id)
        if student:
            out.student_name = f"{student.first_name} {student.last_name}"
            out.student_cgpa = float(student.cgpa) if student.cgpa else None
        if student_user:
            out.student_email = student_user.email
        if internship:
            out.target_title = internship.title
        results.append(out)

    return results


@router.patch("/{application_id}/status", response_model=ApplicationOut)
def update_application_status(
    application_id: str,
    payload: ApplicationStatusUpdate,
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ApplicationOut:
    if current.role not in ("recruiter", "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only corporate recruiters and administrators can update application status.",
        )

    app = db.query(Application).get(application_id)
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application record not found.")

    # Resource ownership check for recruiters
    if current.role == "recruiter":
        internship = db.query(Internship).get(app.target_id)
        if not internship:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Target internship not found.")

        recruiter = current.recruiter_profile
        is_owner = (
            internship.posted_by == current.id
            or (recruiter and recruiter.company_id and internship.company_id == recruiter.company_id)
        )
        if not is_owner:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to manage candidates for another company's postings.",
            )

    app.status = payload.status
    db.commit()
    db.refresh(app)
    return ApplicationOut.model_validate(app)
