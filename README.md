# SafeTrade AI

**체크리스트 기반 거래 위험도 분석 도구** — 중고거래·부동산 거래 전, 위험 신호를 선택하면 규칙 기반으로 위험도 점수와 등급을 즉시 산출합니다.

---

## Overview

중고거래(당근마켓, 번개장터 등)와 전세·월세 거래에서 사기 피해는 매년 반복됩니다.   
그러나 경험이 부족한 초보 사용자는 어떤 상황이 위험 신호인지 체계적으로 판단하기 어렵습니다.

SafeTrade AI는 **LLM 없이** 체크리스트 + 규칙 기반 점수화만으로 일관된 분석을 제공합니다.   
같은 입력에는 항상 같은 점수·등급이 나와, AI 판정 과신 없이 '추가 확인이 필요한지' 여부를 빠르게 파악할 수 있습니다.


---

## Features

- **카테고리 선택** — 중고거래 / 부동산 중 분석할 거래 유형을 선택
- **체크리스트 입력** — 경찰청·국토교통부 통계 기반 위험 신호 10개를 체크박스로 선택
- **위험도 리포트** — 점수(0~100) + 등급(LOW / MEDIUM / HIGH) + 탐지된 신호 목록 즉시 출력
- **면책 안내 고정** — 결과 화면에 '참고용' 면책 문구를 항상 노출해 과신 방지
- **규칙 기반 일관성** — 동일 입력 → 동일 결과 보장 (비결정적 LLM 호출 없음)

---

## Tech Stack

| 영역 | 기술 |
|---|---|
| Backend | Python 3.14 · FastAPI · Uvicorn |
| Frontend | React 19 · Vite 8 |
| 패키지 관리 | uv (backend) · npm (frontend) |
| 데이터 | 규칙 기반 체크리스트 (Python 상수) |
| API 방식 | REST · JSON |

---

## Project Structure

```
safetrade-ai/
├── apps/
│   ├── api/                        # FastAPI 백엔드
│   │   ├── app/
│   │   │   ├── main.py             # 앱 진입점 · CORS · 라우터 등록
│   │   │   ├── routers/
│   │   │   │   └── analyze.py      # POST /api/analyze
│   │   │   ├── services/
│   │   │   │   └── scoring.py      # 점수 합산 · 등급 판정 로직
│   │   │   └── data/
│   │   │       ├── used_trade.py   # 중고거래 체크리스트 (10개)
│   │   │       └── real_estate.py  # 부동산 체크리스트 (10개)
│   │   └── pyproject.toml
│   └── web/                        # React 프론트엔드
│       ├── src/
│       │   ├── App.jsx             # 스텝 상태 오케스트레이터
│       │   ├── components/
│       │   │   ├── CategorySelect.jsx
│       │   │   ├── ChecklistForm.jsx
│       │   │   └── ResultView.jsx
│       │   ├── data/
│       │   │   └── checklist.js    # 프론트용 체크리스트 데이터
│       │   └── hooks/
│       │       └── useAnalyze.js   # fetch + 에러 상태 관리
│       └── package.json
└── docs/
    ├── PRD.md
    ├── CHECKLIST_SPEC.md
    ├── FUNCTION_SPEC.md
    └── API.md
```

---

## Getting Started

### 사전 요구사항

- Python 3.14+
- Node.js 18+
- [uv](https://docs.astral.sh/uv/) (Python 패키지 매니저)

### Backend

```bash
cd apps/api

# 의존성 설치
uv sync

# 개발 서버 실행 (hot reload)
uv run uvicorn app.main:app --reload
```

→ `http://localhost:8000` · Swagger UI: `http://localhost:8000/docs`

### Frontend

```bash
cd apps/web

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

→ `http://localhost:5173`

> **두 서버를 동시에 실행**해야 분석하기 버튼이 동작합니다.
> Vite dev server가 `/api` 요청을 `localhost:8000`으로 자동 프록시합니다.

---

## API

### POST /api/analyze

**Request**

```json
{
  "category": "used_trade",
  "checked_items": ["junggo_seller_002", "junggo_payment_003"]
}
```

| 필드 | 타입 | 설명 |
|---|---|---|
| `category` | `"used_trade"` \| `"real_estate"` | 거래 유형 |
| `checked_items` | `string[]` | 선택한 체크리스트 항목 ID 배열 |

**Response**

```json
{
  "total_score": 75,
  "grade": "HIGH",
  "triggered_items": [
    {
      "id": "junggo_seller_002",
      "category": "판매자",
      "label": "더치트·사이버캅에서 해당 번호/계좌 사기 이력이 조회된다",
      "score": 40,
      "severity": "HIGH",
      "description": "더치트 등록 이력 = 실제 피해 근거"
    }
  ],
  "disclaimer": "이 결과는 참고용 점검 도구이며..."
}
```

**등급 기준**

| 점수 | 등급 | 설명 |
|---|---|---|
| 0 ~ 30 | LOW | 일반적인 주의 수준 |
| 31 ~ 69 | MEDIUM | 추가 확인 권장 |
| 70 ~ 100 | HIGH | 거래 보류 강력 권장 |

---

## Checklist Items

### 중고거래 (10개)

> 출처: 경찰청 사이버범죄 트렌드, 더치트 피해 패턴 분석

| ID | 카테고리 | 항목 | 점수 | 심각도 |
|---|---|---|---|---|
| `junggo_price_001` | 가격 | 시세보다 20% 이상 저렴하게 올라온 매물이다 | 20 | MEDIUM |
| `junggo_price_002` | 가격 | "오늘만", "급매", "지금 입금하면 할인" 등 긴박감을 조성한다 | 15 | LOW |
| `junggo_seller_001` | 판매자 | 가입한 지 2주 미만이고 거래 이력이 없다 | 20 | MEDIUM |
| `junggo_seller_002` | 판매자 | 더치트·사이버캅에서 해당 번호/계좌 사기 이력이 조회된다 | 40 | HIGH |
| `junggo_payment_001` | 결제·연락 | 플랫폼 앱 채팅이 아닌 카카오톡·문자로 외부 유도한다 | 20 | MEDIUM |
| `junggo_payment_002` | 결제·연락 | 플랫폼 공식 안전결제 대신 계좌이체를 요구한다 | 25 | MEDIUM |
| `junggo_payment_003` | 결제·연락 | 외부 링크로 안전결제 URL을 별도로 보내왔다 | 35 | HIGH |
| `junggo_process_001` | 거래 방식 | 직거래를 거부하고 택배 거래만 고집한다 | 15 | LOW |
| `junggo_process_002` | 거래 방식 | 제3자가 중간에 끼어 거래를 대리한다 | 25 | MEDIUM |
| `junggo_process_003` | 거래 방식 | "수수료 포함 재입금" 또는 "환불 후 재결제" 요구가 있다 | 35 | HIGH |

### 부동산 (10개)

> 출처: 국토교통부 전세사기 피해 실태조사(2024), 경찰청 전세사기 유형 보도자료

| ID | 카테고리 | 항목 | 점수 | 심각도 |
|---|---|---|---|---|
| `jeonse_price_001` | 가격 | 전세가율이 80% 이상이다 (매매가 대비 전세가) | 30 | HIGH |
| `jeonse_price_002` | 가격 | 주변 시세보다 지나치게 저렴한 매물이다 | 20 | MEDIUM |
| `jeonse_registry_001` | 등기부 | 근저당권이 설정되어 있다 | 30 | HIGH |
| `jeonse_registry_002` | 등기부 | 등기부등본 갑구에 "신탁" 표기가 있다 | 35 | HIGH |
| `jeonse_registry_003` | 등기부 | 소유권이 최근 6개월 내 변경됐다 | 20 | MEDIUM |
| `jeonse_registry_004` | 등기부 | 체납세금·가압류 기록이 있다 | 25 | MEDIUM |
| `jeonse_owner_001` | 임대인 | 임대인 본인과 직접 대면 확인이 불가능하다 | 25 | MEDIUM |
| `jeonse_owner_002` | 임대인 | 공인중개사가 등기부등본 확인을 기피한다 | 20 | MEDIUM |
| `jeonse_safety_001` | 안전장치 | 전세보증보험(HUG) 가입을 거부하거나 기피한다 | 25 | MEDIUM |
| `jeonse_safety_002` | 안전장치 | 잔금일 당일 등기부등본을 다시 확인하지 않았다 | 15 | LOW |

---

## Background Statistics

체크리스트 항목의 설계 근거가 된 통계 자료입니다.

- 2024년 중고거래 사기 발생: **10만건 이상** (경찰청)
- 2024년 중고거래 사기 피해액: **3,340억원** (경찰청)
- 전세사기 피해자 누계: **25,578건** (국토교통부, 2024.12)
- 전세사기 피해자 중 40세 미만: **74.48%** (국토교통부)
- 피해 주택 유형 1위: 다세대주택 30.6%

---

## Disclaimer

> 이 결과는 참고용 점검 도구이며, 법적 판단이나 전문가 의견을 대체하지 않습니다.    
> 동일한 입력에 동일한 점수가 산출되며, 실제 거래 결정은 전문가와 상담 후 진행하세요.

- 위험도가 **낮아도 안전을 보장하지 않습니다**. 안전결제·대면 확인 등 기본 수칙을 지키세요.
- 입력 텍스트에 전화번호·계좌번호 등 **민감 정보는 포함하지 마세요**.
- 이 도구는 사기 여부를 **판정하지 않습니다**. 최종 판단과 책임은 사용자에게 있습니다.

---

## License

MIT
