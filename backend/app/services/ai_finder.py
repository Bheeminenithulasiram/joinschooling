"""AI College Finder — weighted rubric.

Deterministic scoring for MVP. Weights per blueprint:
  academics 30% · budget 20% · placement 25% · location 10% · facilities 15%
Optional LLM re-rank can be layered on top later.
"""
from __future__ import annotations

from typing import Any, Dict, List

from sqlalchemy.orm import Session

from app.models import AiFinderRun, College
from app.schemas import AiFinderMatch, AiFinderRequest, AiFinderResponse, CollegeCard

MODEL_VERSION = "rubric-v1"

WEIGHTS = {"academics": 0.30, "budget": 0.20, "placement": 0.25, "location": 0.10, "facilities": 0.15}


def _score(payload: AiFinderRequest, c: College) -> Dict[str, Any]:
    # academics: min(90, twelfth+cgpa*10) fits 0..1
    twelfth = payload.twelfth_percentage or 0
    cgpa_norm = ((payload.cgpa or 0) / 10) * 100
    academics = max(0.0, min(1.0, (twelfth * 0.6 + cgpa_norm * 0.4) / 100))

    # budget: 1 if fee within [min,max], drop-off outside
    fee = float(c.hostel_fee_lpa or 0) or 1.5  # crude proxy when tuition unknown
    if payload.budget_min_lpa is not None and fee < payload.budget_min_lpa:
        budget = 0.7  # under budget still ok
    elif fee > payload.budget_max_lpa:
        overshoot = (fee - payload.budget_max_lpa) / payload.budget_max_lpa
        budget = max(0.0, 1.0 - overshoot)
    else:
        budget = 1.0

    # placement: proximity of avg_package to expected_package (or 0.6 base)
    avg_pkg = float(c.avg_package_lpa or 0)
    if payload.expected_package_lpa and payload.expected_package_lpa > 0:
        ratio = min(1.5, avg_pkg / payload.expected_package_lpa)
        placement = max(0.0, min(1.0, ratio))
    else:
        placement = min(1.0, avg_pkg / 15.0)

    # location: exact state match = 1.0, city bump = 1.0
    location = 0.6
    if payload.state and c.state and payload.state.lower() == c.state.lower():
        location = 0.9
        if payload.city and c.city and payload.city.lower() == c.city.lower():
            location = 1.0

    # facilities: hostel requirement + facilities count normalized
    facilities_score = 0.5
    if payload.hostel_required is True and c.hostel_available:
        facilities_score += 0.3
    elif payload.hostel_required is False:
        facilities_score += 0.2
    facilities_score += min(0.2, len(c.facilities or []) * 0.02)
    facilities_score = min(1.0, facilities_score)

    subscores = {
        "academics": academics,
        "budget": budget,
        "placement": placement,
        "location": location,
        "facilities": facilities_score,
    }
    total = sum(WEIGHTS[k] * v for k, v in subscores.items())

    pros: List[str] = []
    cons: List[str] = []
    if placement >= 0.75:
        pros.append(f"Strong placements (~₹{avg_pkg:.1f} LPA avg)")
    else:
        cons.append("Placement package below your target")
    if budget >= 0.9:
        pros.append("Fits within your budget")
    elif budget < 0.6:
        cons.append("Fee likely above your budget")
    if location >= 0.9:
        pros.append(f"Located in your preferred region ({c.city}, {c.state})")
    if facilities_score >= 0.8 and payload.hostel_required and c.hostel_available:
        pros.append("Hostel available")
    if c.naac_grade:
        pros.append(f"NAAC {c.naac_grade}")

    # admission probability: fun estimate using academics + a tiny NIRF nudge
    admission_prob = academics
    if c.nirf_rank and c.nirf_rank <= 100:
        admission_prob *= 0.75  # top-ranked colleges are harder
    admission_prob = round(max(0.05, min(0.98, admission_prob)), 2)

    predicted_pkg = round(avg_pkg * (0.9 + academics * 0.3), 2) if avg_pkg else None

    return {
        "score": round(total, 4),
        "pros": pros[:4],
        "cons": cons[:3],
        "admission_probability": admission_prob,
        "predicted_package_lpa": predicted_pkg,
    }


def run(db: Session, student_id: str, payload: AiFinderRequest, top_n: int = 10) -> AiFinderResponse:
    # Candidate generation: state match preferred, otherwise all published
    query = db.query(College).filter(College.is_published.is_(True), College.deleted_at.is_(None))
    candidates: List[College] = []
    if payload.state:
        candidates = query.filter(College.state.ilike(payload.state)).all()
    if len(candidates) < top_n:
        # fallback / broaden
        candidates.extend([c for c in query.limit(200).all() if c not in candidates])

    scored: List[AiFinderMatch] = []
    for c in candidates:
        s = _score(payload, c)
        scored.append(
            AiFinderMatch(
                college=CollegeCard.model_validate(c),
                match_score=s["score"],
                pros=s["pros"],
                cons=s["cons"],
                predicted_package_lpa=s["predicted_package_lpa"],
                admission_probability=s["admission_probability"],
            )
        )

    scored.sort(key=lambda m: m.match_score, reverse=True)
    top = scored[:top_n]

    run_row = AiFinderRun(
        student_id=student_id,
        input_payload=payload.model_dump(mode="json"),
        model_version=MODEL_VERSION,
        results=[m.model_dump(mode="json") for m in top],
    )
    db.add(run_row)
    db.commit()
    db.refresh(run_row)
    return AiFinderResponse(run_id=run_row.id, recommendations=top)
