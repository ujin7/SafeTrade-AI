from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator

from app.data.used_trade import USED_TRADE_CHECKLIST
from app.data.real_estate import REAL_ESTATE_CHECKLIST
from app.services.scoring import calculate_risk

router = APIRouter()

TradeCategory = Literal["used_trade", "real_estate"]

_VALID_IDS: dict[str, set[str]] = {
    "used_trade": {item["id"] for item in USED_TRADE_CHECKLIST},
    "real_estate": {item["id"] for item in REAL_ESTATE_CHECKLIST},
}

DISCLAIMER = (
    "이 결과는 참고용 점검 도구이며, 법적 판단이나 전문가 의견을 대체하지 않습니다. "
    "동일한 입력에 동일한 점수가 산출되며, 실제 거래 결정은 전문가와 상담 후 진행하세요."
)


class AnalyzeRequest(BaseModel):
    category: TradeCategory
    checked_items: list[str]
    input_text: str | None = None

    @field_validator("checked_items")
    @classmethod
    def no_duplicates(cls, v: list[str]) -> list[str]:
        if len(v) != len(set(v)):
            raise ValueError("checked_items에 중복된 항목이 있습니다.")
        return v


class TriggeredItem(BaseModel):
    id: str
    category: str
    label: str
    score: int
    severity: Literal["HIGH", "MEDIUM", "LOW"]
    description: str


class AnalyzeResponse(BaseModel):
    total_score: int
    grade: Literal["LOW", "MEDIUM", "HIGH"]
    triggered_items: list[TriggeredItem]
    disclaimer: str


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest) -> AnalyzeResponse:
    valid_ids = _VALID_IDS[req.category]
    invalid = [item_id for item_id in req.checked_items if item_id not in valid_ids]
    if invalid:
        raise HTTPException(
            status_code=422,
            detail=f"category '{req.category}'에 속하지 않는 항목 ID: {invalid}",
        )

    result = calculate_risk(req.checked_items)

    return AnalyzeResponse(
        total_score=result.score,
        grade=result.level,
        triggered_items=[
            TriggeredItem(
                id=item["id"],
                category=item["category"],
                label=item["label"],
                score=item["score"],
                severity=item["severity"],
                description=item["description"],
            )
            for item in result.matched_signals
        ],
        disclaimer=DISCLAIMER,
    )
