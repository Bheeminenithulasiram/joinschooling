"""AI College Finder endpoints."""
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database.session import get_db
from app.models import AiFinderRun, User
from app.schemas import AiFinderRequest, AiFinderResponse
from app.services import ai_finder as ai_finder_service

router = APIRouter(prefix="/ai/college-finder", tags=["AI Finder"])


@router.post("", response_model=AiFinderResponse)
def run(
    payload: AiFinderRequest,
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> AiFinderResponse:
    if current.role != "student":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Students only")
    return ai_finder_service.run(db, current.id, payload)


@router.get("/history")
def history(current: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = (
        db.query(AiFinderRun)
        .filter(AiFinderRun.student_id == current.id)
        .order_by(desc(AiFinderRun.created_at))
        .limit(20)
        .all()
    )
    return [
        {
            "id": r.id,
            "created_at": r.created_at,
            "model_version": r.model_version,
            "input_payload": r.input_payload,
            "results": r.results,
        }
        for r in rows
    ]
