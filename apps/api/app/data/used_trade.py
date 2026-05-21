from typing import TypedDict, Literal

SeverityLevel = Literal["HIGH", "MEDIUM", "LOW"]


class ChecklistItem(TypedDict):
    id: str
    category: str
    label: str
    score: int
    severity: SeverityLevel
    description: str


# 출처: 경찰청 사이버범죄 트렌드, 더치트 피해 패턴 분석
USED_TRADE_CHECKLIST: list[ChecklistItem] = [
    {
        "id": "junggo_price_001",
        "category": "가격",
        "label": "시세보다 20% 이상 저렴하게 올라온 매물이다",
        "score": 20,
        "severity": "MEDIUM",
        "description": "경찰청: 미끼 가격이 가장 흔한 유인 수법",
    },
    {
        "id": "junggo_price_002",
        "category": "가격",
        "label": '"오늘만", "급매", "지금 입금하면 할인" 등 긴박감을 조성한다',
        "score": 15,
        "severity": "LOW",
        "description": "심리적 압박으로 판단력 저하 유도",
    },
    {
        "id": "junggo_seller_001",
        "category": "판매자",
        "label": "가입한 지 2주 미만이고 거래 이력이 없다",
        "score": 20,
        "severity": "MEDIUM",
        "description": "경찰청: 신규 계정 이용 사기 다수",
    },
    {
        "id": "junggo_seller_002",
        "category": "판매자",
        "label": "더치트·사이버캅에서 해당 번호/계좌 사기 이력이 조회된다",
        "score": 40,
        "severity": "HIGH",
        "description": "더치트 등록 이력 = 실제 피해 근거",
    },
    {
        "id": "junggo_payment_001",
        "category": "결제·연락",
        "label": "플랫폼 앱 채팅이 아닌 카카오톡·문자로 외부 유도한다",
        "score": 20,
        "severity": "MEDIUM",
        "description": "경찰청: 플랫폼 보호 우회 목적",
    },
    {
        "id": "junggo_payment_002",
        "category": "결제·연락",
        "label": "플랫폼 공식 안전결제 대신 계좌이체를 요구한다",
        "score": 25,
        "severity": "MEDIUM",
        "description": "경찰청 주요 수법 1위: 선입금 후 잠적",
    },
    {
        "id": "junggo_payment_003",
        "category": "결제·연락",
        "label": "외부 링크로 안전결제 URL을 별도로 보내왔다",
        "score": 35,
        "severity": "HIGH",
        "description": "경찰청: 가짜 안전결제 피싱 급증",
    },
    {
        "id": "junggo_process_001",
        "category": "거래 방식",
        "label": "직거래를 거부하고 택배 거래만 고집한다",
        "score": 15,
        "severity": "LOW",
        "description": "대면 회피 = 신원 노출 기피",
    },
    {
        "id": "junggo_process_002",
        "category": "거래 방식",
        "label": "제3자가 중간에 끼어 거래를 대리한다",
        "score": 25,
        "severity": "MEDIUM",
        "description": "경찰청: 삼자 사기 수법",
    },
    {
        "id": "junggo_process_003",
        "category": "거래 방식",
        "label": '"수수료 포함 재입금" 또는 "환불 후 재결제" 요구가 있다',
        "score": 35,
        "severity": "HIGH",
        "description": "2차 피해 유도 전형적 수법",
    },
]

# 전체 점수 합산 후 위험 등급 판정 기준
RISK_THRESHOLDS = {
    "LOW": (0, 30),
    "MEDIUM": (31, 69),
    "HIGH": (70, 100),
}
