from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.ai import suggest_signals

router = APIRouter()

_VALID_CATEGORIES = {"used_trade", "real_estate"}


class SuggestRequest(BaseModel):
    category: str
    input_text: str


class SuggestResponse(BaseModel):
    suggested_ids: list[str]


@router.post("/suggest", response_model=SuggestResponse)
async def suggest(req: SuggestRequest):
    if req.category not in _VALID_CATEGORIES:
        raise HTTPException(status_code=400, detail="Invalid category")
    if len(req.input_text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Input text too short")

    ids = suggest_signals(req.category, req.input_text)
    return SuggestResponse(suggested_ids=ids)
