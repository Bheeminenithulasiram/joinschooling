"""Wishlist / saved items."""
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database.session import get_db
from app.models import SavedItem, User
from app.schemas import SavedCreate, SavedOut

router = APIRouter(prefix="/saved", tags=["Saved"])


@router.get("", response_model=List[SavedOut])
def list_saved(current: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = (
        db.query(SavedItem)
        .filter(SavedItem.user_id == current.id)
        .order_by(desc(SavedItem.created_at))
        .all()
    )
    return [SavedOut.model_validate(r) for r in rows]


@router.get("/colleges")
def list_saved_colleges(current: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from app.models import College
    from app.schemas import CollegeCard
    
    saved_rows = (
        db.query(SavedItem)
        .filter(SavedItem.user_id == current.id, SavedItem.kind == "college")
        .order_by(desc(SavedItem.created_at))
        .all()
    )
    college_ids = [r.target_id for r in saved_rows]
    if not college_ids:
        return []
    
    colleges = db.query(College).filter(College.id.in_(college_ids), College.deleted_at.is_(None)).all()
    col_map = {c.id: c for c in colleges}
    ordered = [col_map[cid] for cid in college_ids if cid in col_map]
    return [CollegeCard.model_validate(c) for c in ordered]


@router.get("/internships")
def list_saved_internships(current: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from app.models import Internship
    from app.schemas import InternshipCard
    
    saved_rows = (
        db.query(SavedItem)
        .filter(SavedItem.user_id == current.id, SavedItem.kind == "internship")
        .order_by(desc(SavedItem.created_at))
        .all()
    )
    internship_ids = [r.target_id for r in saved_rows]
    if not internship_ids:
        return []
    
    internships = db.query(Internship).filter(Internship.id.in_(internship_ids), Internship.deleted_at.is_(None)).all()
    int_map = {i.id: i for i in internships}
    ordered = [int_map[iid] for iid in internship_ids if iid in int_map]
    return [InternshipCard.model_validate(i) for i in ordered]


@router.post("", response_model=SavedOut, status_code=status.HTTP_201_CREATED)
def save(payload: SavedCreate, current: User = Depends(get_current_user), db: Session = Depends(get_db)) -> SavedOut:
    from app.models import College, Internship
    
    exists = True
    if payload.kind == "college":
        exists = db.query(College).filter(College.id == payload.target_id, College.deleted_at.is_(None)).first() is not None
    elif payload.kind == "internship":
        exists = db.query(Internship).filter(Internship.id == payload.target_id, Internship.deleted_at.is_(None)).first() is not None

    if not exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{payload.kind.capitalize()} not found")

    row = SavedItem(user_id=current.id, kind=payload.kind, target_id=payload.target_id)
    db.add(row)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Already saved")
    db.refresh(row)
    return SavedOut.model_validate(row)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def unsave(item_id: str, current: User = Depends(get_current_user), db: Session = Depends(get_db)) -> None:
    row = db.query(SavedItem).filter(SavedItem.id == item_id, SavedItem.user_id == current.id).first()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    db.delete(row)
    db.commit()
