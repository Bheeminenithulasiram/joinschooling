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
