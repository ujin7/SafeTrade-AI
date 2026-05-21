from typing import TypedDict, Literal

SeverityLevel = Literal["HIGH", "MEDIUM", "LOW"]


class ChecklistItem(TypedDict):
    id: str
    category: str
    label: str
    score: int
    severity: SeverityLevel
    description: str


# 출처: 국토교통부 전세사기 피해 실태조사(2024), 경찰청 전세사기 유형 보도자료
REAL_ESTATE_CHECKLIST: list[ChecklistItem] = [
    {
        "id": "jeonse_price_001",
        "category": "가격",
        "label": "전세가율이 80% 이상이다 (매매가 대비 전세가)",
        "score": 30,
        "severity": "HIGH",
        "description": "국토부: 깡통전세 핵심 지표",
    },
    {
        "id": "jeonse_price_002",
        "category": "가격",
        "label": "주변 시세보다 지나치게 저렴한 매물이다",
        "score": 20,
        "severity": "MEDIUM",
        "description": "미끼 매물로 피해자 유인",
    },
    {
        "id": "jeonse_registry_001",
        "category": "등기부",
        "label": "근저당권이 설정되어 있다",
        "score": 30,
        "severity": "HIGH",
        "description": "국토부: 선순위 근저당 과다 설정이 주요 수법",
    },
    {
        "id": "jeonse_registry_002",
        "category": "등기부",
        "label": '등기부등본 갑구에 "신탁" 표기가 있다',
        "score": 35,
        "severity": "HIGH",
        "description": "국토부: 신탁 부동산 악용 사기 유형",
    },
    {
        "id": "jeonse_registry_003",
        "category": "등기부",
        "label": "소유권이 최근 6개월 내 변경됐다",
        "score": 20,
        "severity": "MEDIUM",
        "description": "무자본 갭투자 후 임대 패턴",
    },
    {
        "id": "jeonse_registry_004",
        "category": "등기부",
        "label": "체납세금·가압류 기록이 있다",
        "score": 25,
        "severity": "MEDIUM",
        "description": "경매 시 보증금 회수 불가 위험",
    },
    {
        "id": "jeonse_owner_001",
        "category": "임대인",
        "label": "임대인 본인과 직접 대면 확인이 불가능하다",
        "score": 25,
        "severity": "MEDIUM",
        "description": "국토부: 허위 임대인 신분증 위조 수법",
    },
    {
        "id": "jeonse_owner_002",
        "category": "임대인",
        "label": "공인중개사가 등기부등본 확인을 기피한다",
        "score": 20,
        "severity": "MEDIUM",
        "description": "중개업자 공모 사기 패턴",
    },
    {
        "id": "jeonse_safety_001",
        "category": "안전장치",
        "label": "전세보증보험(HUG) 가입을 거부하거나 기피한다",
        "score": 25,
        "severity": "MEDIUM",
        "description": "보증보험 거부 = 반환 능력 없음 신호",
    },
    {
        "id": "jeonse_safety_002",
        "category": "안전장치",
        "label": "잔금일 당일 등기부등본을 다시 확인하지 않았다",
        "score": 15,
        "severity": "LOW",
        "description": "국토부: 잔금일 소유권 이전 악용 수법",
    },
]

# 전체 점수 합산 후 위험 등급 판정 기준
RISK_THRESHOLDS = {
    "LOW": (0, 30),
    "MEDIUM": (31, 69),
    "HIGH": (70, 100),
}
