"""Business logic for colleges: listing filters, detail, compare."""
from __future__ import annotations

from typing import List, Optional, Tuple

from slugify import slugify
from sqlalchemy import and_, asc, desc, or_
from sqlalchemy.orm import Session, selectinload

from app.models import College
from app.schemas import Pagination


SORTS = {
    "rating": (College.rating, desc),
    "avg_package": (College.avg_package_lpa, desc),
    "nirf_rank": (College.nirf_rank, asc),
    "fees_asc": (College.hostel_fee_lpa, asc),
    "fees_desc": (College.hostel_fee_lpa, desc),
}


def list_colleges(
    db: Session,
    *,
    q: Optional[str] = None,
    state: Optional[str] = None,
    city: Optional[str] = None,
    type_: Optional[str] = None,
    hostel: Optional[bool] = None,
    min_rating: Optional[float] = None,
    sort: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
) -> Tuple[List[College], Pagination]:
    query = db.query(College).filter(College.deleted_at.is_(None), College.is_published.is_(True))

    if q:
        pattern = f"%{q}%"
        query = query.filter(or_(College.name.ilike(pattern), College.short_name.ilike(pattern)))
    if state:
        query = query.filter(College.state.ilike(state))
    if city:
        query = query.filter(College.city.ilike(city))
    if type_:
        query = query.filter(College.type == type_)
    if hostel is not None:
        query = query.filter(College.hostel_available.is_(hostel))
    if min_rating is not None:
        query = query.filter(College.rating >= min_rating)

    total = query.count()

    if sort and sort in SORTS:
        col, direction = SORTS[sort]
        query = query.order_by(direction(col))
    else:
        query = query.order_by(desc(College.rating))

    offset = (page - 1) * page_size
    items = query.offset(offset).limit(page_size).all()
    return items, Pagination(page=page, page_size=page_size, total=total, has_next=offset + len(items) < total)


def get_by_slug(db: Session, slug: str) -> Optional[College]:
    return (
        db.query(College)
        .options(selectinload(College.courses), selectinload(College.placements))
        .filter(College.slug == slug, College.deleted_at.is_(None))
        .first()
    )


def get_by_ids(db: Session, ids: List[str]) -> List[College]:
    if not ids:
        return []
    return (
        db.query(College)
        .options(selectinload(College.courses), selectinload(College.placements))
        .filter(and_(College.id.in_(ids), College.deleted_at.is_(None)))
        .all()
    )


def _unique_slug(db: Session, base: str) -> str:
    slug = base
    n = 2
    while db.query(College).filter(College.slug == slug).first() is not None:
        slug = f"{base}-{n}"
        n += 1
    return slug


def create_college(db: Session, payload) -> College:
    base_slug = slugify(payload.slug or payload.name)
    college = College(
        name=payload.name,
        slug=_unique_slug(db, base_slug),
        type=payload.type,
        city=payload.city,
        state=payload.state,
        country=payload.country,
        naac_grade=payload.naac_grade,
        nirf_rank=payload.nirf_rank,
        hostel_available=payload.hostel_available,
        avg_package_lpa=payload.avg_package_lpa,
        highest_package_lpa=payload.highest_package_lpa,
        placement_percent=payload.placement_percent,
        facilities=payload.facilities,
        about=payload.about,
    )
    db.add(college)
    db.commit()
    db.refresh(college)
    return college
