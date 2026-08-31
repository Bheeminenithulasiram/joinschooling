"""Internship endpoints + apply."""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, require_role
from app.database.session import get_db
from app.models import User
from app.schemas import (
    ApplicationOut,
    ApplyRequest,
    InternshipCard,
    InternshipCreate,
    InternshipDetail,
    PagedInternships,
)
from app.services import internship_service

router = APIRouter(prefix="/internships", tags=["Internships"])


@router.get("", response_model=PagedInternships)
def list_internships(
    q: Optional[str] = None,
    domain: Optional[str] = None,
    work_mode: Optional[str] = None,
    min_stipend: Optional[int] = None,
    duration_months: Optional[int] = None,
    company_id: Optional[str] = None,
    sort: Optional[str] = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
) -> PagedInternships:
    items, pagination = internship_service.list_internships(
        db,
        q=q, domain=domain, work_mode=work_mode,
        min_stipend=min_stipend, duration_months=duration_months,
        company_id=company_id, sort=sort,
        page=page, page_size=page_size,
    )
    return PagedInternships(items=[InternshipCard.model_validate(i) for i in items], pagination=pagination)


@router.get("/{slug}", response_model=InternshipDetail)
def detail(slug: str, db: Session = Depends(get_db)) -> InternshipDetail:
    row = internship_service.get_by_slug(db, slug)
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Internship not found")
    return InternshipDetail.model_validate(row)


@router.post("/{internship_id}/apply", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def apply(
    internship_id: str,
    payload: ApplyRequest,
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ApplicationOut:
    if current.role != "student":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Students only")
    app = internship_service.apply_to_internship(db, current.id, internship_id, payload)
    return ApplicationOut.model_validate(app)


# Admin / recruiter authoring
authoring_router = APIRouter(prefix="/internships", tags=["Internships"])


@authoring_router.post(
    "",
    response_model=InternshipCard,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_role("admin", "recruiter"))],
)
def create_internship(
    payload: InternshipCreate,
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> InternshipCard:
    row = internship_service.create_internship(db, payload, posted_by=current.id)
    return InternshipCard.model_validate(row)
