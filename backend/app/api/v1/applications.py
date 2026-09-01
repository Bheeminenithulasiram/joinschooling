"""Applications: list mine + status updates."""
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database.session import get_db
from app.models import Application, User
from app.schemas import ApplicationOut

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
    return [ApplicationOut.model_validate(r) for r in rows]
