"""College endpoints: list, detail, compare, admin CRUD."""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.deps import require_role
from app.database.session import get_db
from app.schemas import (
    CollegeCard,
    CollegeCreate,
    CollegeDetail,
    PagedColleges,
    Pagination,
)
from app.services import college_service

router = APIRouter(prefix="/colleges", tags=["Colleges"])


@router.get("", response_model=PagedColleges)
def list_colleges(
    q: Optional[str] = None,
    state: Optional[str] = None,
    city: Optional[str] = None,
    type: Optional[str] = Query(default=None, alias="type"),
    hostel: Optional[bool] = None,
    min_rating: Optional[float] = Query(default=None, ge=0, le=5),
    sort: Optional[str] = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
) -> PagedColleges:
    items, pagination = college_service.list_colleges(
        db,
        q=q, state=state, city=city, type_=type,
        hostel=hostel, min_rating=min_rating, sort=sort,
        page=page, page_size=page_size,
    )
    return PagedColleges(items=[CollegeCard.model_validate(c) for c in items], pagination=pagination)


@router.get("/compare")
def compare(
    ids: str = Query(..., description="Comma-separated college IDs (2-4)"),
    db: Session = Depends(get_db),
):
    id_list = [x for x in ids.split(",") if x]
    if not (2 <= len(id_list) <= 4):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Provide 2 to 4 IDs")
    colleges = college_service.get_by_ids(db, id_list)
    return {"colleges": [CollegeDetail.model_validate(c) for c in colleges]}


@router.get("/{slug}", response_model=CollegeDetail)
def college_detail(slug: str, db: Session = Depends(get_db)) -> CollegeDetail:
    college = college_service.get_by_slug(db, slug)
    if not college:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="College not found")
    return CollegeDetail.model_validate(college)


# ------- Admin -------
admin_router = APIRouter(prefix="/admin/colleges", tags=["Admin"])


@admin_router.post("", response_model=CollegeCard, status_code=status.HTTP_201_CREATED,
                   dependencies=[Depends(require_role("admin"))])
def admin_create(payload: CollegeCreate, db: Session = Depends(get_db)) -> CollegeCard:
    return CollegeCard.model_validate(college_service.create_college(db, payload))
