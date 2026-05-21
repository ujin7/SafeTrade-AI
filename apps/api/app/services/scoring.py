from typing import Literal
from app.data.used_trade import USED_TRADE_CHECKLIST
from app.data.real_estate import REAL_ESTATE_CHECKLIST
from app.data.used_trade import ChecklistItem

TradeType = Literal["used_trade", "real_estate"]
RiskLevel = Literal["LOW", "MEDIUM", "HIGH"]

# 두 체크리스트를 합산한 단일 조회 테이블 (id → item)
_ITEM_MAP: dict[str, ChecklistItem] = {
    item["id"]: item
    for item in USED_TRADE_CHECKLIST + REAL_ESTATE_CHECKLIST
}

# 점수 구간 → 등급 (CHECKLIST_SPEC 기준)
_THRESHOLDS: list[tuple[int, RiskLevel]] = [
    (70, "HIGH"),
    (31, "MEDIUM"),
    (0, "LOW"),
]


def _to_level(score: int) -> RiskLevel:
    for min_score, level in _THRESHOLDS:
        if score >= min_score:
            return level
    return "LOW"


class ScoringResult:
    __slots__ = ("score", "level", "matched_signals", "unknown_ids")

    def __init__(
        self,
        score: int,
        level: RiskLevel,
        matched_signals: list[ChecklistItem],
        unknown_ids: list[str],
    ) -> None:
        self.score = score
        self.level = level
        self.matched_signals = matched_signals
        self.unknown_ids = unknown_ids


def calculate_risk(signal_ids: list[str]) -> ScoringResult:
    """
    체크리스트 항목 ID 배열을 받아 위험도 점수와 등급을 반환한다.

    - 중복 ID는 한 번만 계산한다.
    - 알 수 없는 ID는 무시하고 unknown_ids에 수집한다.
    - 합산 점수는 0~100으로 클램프한다.
    """
    seen: set[str] = set()
    matched: list[ChecklistItem] = []
    unknown: list[str] = []

    for item_id in signal_ids:
        if item_id in seen:
            continue
        seen.add(item_id)

        item = _ITEM_MAP.get(item_id)
        if item is None:
            unknown.append(item_id)
        else:
            matched.append(item)

    raw_score = sum(item["score"] for item in matched)
    clamped_score = min(raw_score, 100)

    # 점수 높은 신호를 앞으로 정렬
    matched.sort(key=lambda i: i["score"], reverse=True)

    return ScoringResult(
        score=clamped_score,
        level=_to_level(clamped_score),
        matched_signals=matched,
        unknown_ids=unknown,
    )
