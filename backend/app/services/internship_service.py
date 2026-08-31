"""Internship listing + detail + apply."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import List, Optional, Tuple

from fastapi import HTTPException, status
from slugify import slugify
from sqlalchemy import asc, desc, or_
from sqlalchemy.orm import Session, selectinload

from app.models import Application, Internship
from app.schemas import Pagination


def list_internships(
    db: Session,
    *,
    q: Optional[str] = None,
    domain: Optional[str] = None,
    work_mode: Optional[str] = None,
    min_stipend: Optional[int] = None,
    duration_months: Optional[int] = None,
    company_id: Optional[str] = None,
    sort: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
) -> Tuple[List[Internship], Pagination]:
    query = (
        db.query(Internship)
        .options(selectinload(Internship.company))
        .filter(Internship.deleted_at.is_(None), Internship.is_active.is_(True))
    )
    if q:
        pattern = f"%{q}%"
        query = query.filter(or_(Internship.title.ilike(pattern), Internship.description.ilike(pattern)))
    if domain:
        query = query.filter(Internship.domain.ilike(domain))
    if work_mode:
        query = query.filter(Internship.work_mode == work_mode)
    if min_stipend is not None:
        query = query.filter(Internship.stipend_min >= min_stipend)
    if duration_months is not None:
        query = query.filter(Internship.duration_months == duration_months)
    if company_id:
        query = query.filter(Internship.company_id == company_id)

    total = query.count()

    if sort == "stipend_desc":
        query = query.order_by(desc(Internship.stipend_max))
    elif sort == "deadline":
        query = query.order_by(asc(Internship.apply_deadline))
    else:
        query = query.order_by(desc(Internship.posted_at))

    offset = (page - 1) * page_size
    items = query.offset(offset).limit(page_size).all()
    return items, Pagination(page=page, page_size=page_size, total=total, has_next=offset + len(items) < total)


def get_by_slug(db: Session, slug: str) -> Optional[Internship]:
    return (
        db.query(Internship)
        .options(selectinload(Internship.company))
        .filter(Internship.slug == slug, Internship.deleted_at.is_(None))
        .first()
    )


def _unique_slug(db: Session, base: str) -> str:
    slug = base
    n = 2
    while db.query(Internship).filter(Internship.slug == slug).first() is not None:
        slug = f"{base}-{n}"
        n += 1
    return slug


def create_internship(db: Session, payload, posted_by: Optional[str] = None) -> Internship:
    base_slug = slugify(payload.slug or payload.title)
    internship = Internship(
        company_id=payload.company_id,
        posted_by=posted_by,
        title=payload.title,
        slug=_unique_slug(db, base_slug),
        domain=payload.domain,
        work_mode=payload.work_mode,
        duration_months=payload.duration_months,
        description=payload.description,
        stipend_min=payload.stipend_min,
        stipend_max=payload.stipend_max,
        location_city=payload.location_city,
        location_state=payload.location_state,
        skills=payload.skills,
        requirements=payload.requirements,
        responsibilities=payload.responsibilities,
        benefits=payload.benefits,
        eligibility_batches=payload.eligibility_batches,
        apply_deadline=payload.apply_deadline,
    )
    db.add(internship)
    db.commit()
    db.refresh(internship)
    return internship


def apply_to_internship(db: Session, student_id: str, internship_id: str, payload) -> Application:
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship or not internship.is_active or internship.deleted_at:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Internship not found")
    if internship.apply_deadline:
        deadline = internship.apply_deadline
        if deadline.tzinfo is None:
            deadline = deadline.replace(tzinfo=timezone.utc)
        if deadline < datetime.now(tz=timezone.utc):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Application deadline has passed")

    existing = (
        db.query(Application)
        .filter(
            Application.student_id == student_id,
            Application.target_kind == "internship",
            Application.target_id == internship_id,
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Already applied")

    app = Application(
        student_id=student_id,
        target_kind="internship",
        target_id=internship_id,
        status="submitted",
        cover_letter=payload.cover_letter,
        resume_url=payload.resume_url,
        answers=payload.answers,
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return app
