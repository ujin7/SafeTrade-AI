# SafeTrade AI

**체크리스트 + AI 기반 거래 위험도 분석 도구** — 중고거래·부동산 거래 전, 거래 내용을 입력하면 AI가 위험 신호를 자동 감지하고 위험도 점수와 등급을 즉시 산출합니다.

---

## Overview

중고거래(당근마켓, 번개장터 등)와 전세·월세 거래에서 사기 피해는 매년 반복됩니다.  
그러나 경험이 부족한 초보 사용자는 어떤 상황이 위험 신호인지 체계적으로 판단하기 어렵습니다.

SafeTrade AI는 두 가지 분석 방식을 함께 제공합니다.

- **AI 자동 감지** — 거래 채팅·문자 내용을 붙여넣으면 Claude AI가 위험 신호를 자동으로 탐지해 체크리스트에 미리 체크합니다.
- **규칙 기반 점수화** — 체크리스트 항목별 가중치를 합산해 위험도 점수(0~100)와 등급(LOW / MEDIUM / HIGH)을 산출합니다. 같은 입력에는 항상 같은 점수가 나옵니다.

---

## Features

- **거래 유형 선택** — 중고거래 / 부동산 중 해당하는 유형 선택
- **AI 자동 감지** — 거래 내용 텍스트 입력 시 Claude AI가 위험 신호 자동 탐지 (`POST /api/suggest`)
- **체크리스트 편집** — AI 감지 결과를 검토하고 항목 추가·해제 가능
- **위험도 리포트** — 점수(0~100) + 등급 + 탐지된 신호 목록 + 심각도 배지 출력
- **대응 템플릿** — 등급별 맞춤 서식 자동 생성 (HIGH: 경찰청 신고서식 / MEDIUM: 확인 메시지 / LOW: 안전 수칙)
- **유사 피해 사례** — 탐지된 신호와 매칭되는 실제 피해 사례 연결
- **분석 내역** — 최근 5건 localStorage 저장·표시
- **오프라인 fallback** — API 미응답 시 클라이언트 사이드 로컬 점수 계산으로 자동 전환
- **면책 안내 고정** — 결과 화면에 '참고용' 면책 문구 항상 노출

---

## Tech Stack

| 영역 | 기술 |
|---|---|
| Backend | Python 3.14 · FastAPI · Uvicorn |
| AI | Claude API (Anthropic) |
| Frontend | React 19 · Vite 8 |
| 패키지 관리 | uv (backend) · npm (frontend) |
| 스타일 | Plain CSS · OKLCH 디자인 토큰 · Pretendard Variable |
| API 방식 | REST · JSON |

---

## Project Structure

```
safetrade-ai/
├── apps/
│   ├── api/                          # FastAPI 백엔드
│   │   └── app/
│   │       ├── main.py               # 앱 진입점 · CORS · 라우터 등록
│   │       ├── routers/
│   │       │   ├── analyze.py        # POST /api/analyze
│   │       │   └── suggest.py        # POST /api/suggest
│   │       ├── services/
│   │       │   ├── scoring.py        # 점수 합산 · 등급 판정 로직
│   │       │   └── ai.py             # Claude API 연동 · 위험 신호 감지
│   │       └── data/
│   │           ├── used_trade.py     # 중고거래 체크리스트 (10개)
│   │           └── real_estate.py    # 부동산 체크리스트 (10개)
│   └── web/                          # React 프론트엔드
│       └── src/
│           ├── App.jsx               # 라우팅 · 상태 오케스트레이터
│           ├── components/
│           │   ├── Rail.jsx          # 좌측 네비게이션 사이드바
│           │   ├── Topbar.jsx        # 상단 바 · 브레드크럼
│           │   ├── HomePage.jsx      # 홈 화면
│           │   ├── CategorySelect.jsx
│           │   ├── TextInput.jsx     # 거래 내용 입력
│           │   ├── ChecklistForm.jsx # AI 감지 체크리스트
│           │   ├── ResultView.jsx    # 위험도 결과 + 템플릿 + 사례
│           │   ├── CasesPage.jsx     # 피해 사례 목록
│           │   └── ScoreGauge.jsx    # SVG 아크 게이지
│           ├── data/
│           │   ├── checklist.js      # 체크리스트 데이터 + 로컬 fallback 함수
│           │   ├── cases.js          # 실제 피해 사례 데이터
│           │   └── templates.js      # 등급별 대응 템플릿
│           └── hooks/
│               ├── useAnalyze.js     # POST /api/analyze · 로컬 fallback
│               └── useSuggest.js     # POST /api/suggest · 로컬 fallback
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
- Anthropic API 키 (`ANTHROPIC_API_KEY`)

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

> **두 서버를 동시에 실행**해야 AI 분석이 동작합니다.  
> Vite dev server가 `/api` 요청을 `localhost:8000`으로 자동 프록시합니다.  
> API 서버가 없거나 오류가 발생하면 클라이언트 사이드 로컬 점수 계산으로 자동 전환됩니다.

---

## API

### POST /api/suggest

거래 내용 텍스트를 분석해 해당하는 체크리스트 항목 ID를 반환합니다.

**Request**

```json
{
  "category": "used_trade",
  "input_text": "안전결제 말고 제 계좌로 먼저 입금해 주시면 바로 발송해 드릴게요."
}
```

**Response**

```json
{
  "suggested_ids": ["junggo_payment_002", "junggo_price_002"]
}
```

---

### POST /api/analyze

선택된 체크리스트 항목을 점수화해 위험도 등급과 상세 결과를 반환합니다.

**Request**

```json
{
  "category": "used_trade",
  "checked_items": ["junggo_seller_002", "junggo_payment_003"],
  "input_text": "..."
}
```

| 필드 | 타입 | 설명 |
|---|---|---|
| `category` | `"used_trade"` \| `"real_estate"` | 거래 유형 |
| `checked_items` | `string[]` | 선택한 체크리스트 항목 ID 배열 |
| `input_text` | `string` | 거래 내용 원문 (선택) |

**Response**

```json
{
  "total_score": 75,
  "grade": "HIGH",
  "triggered_items": [
    {
      "id": "junggo_seller_002",
      "label": "더치트·사이버캅에서 해당 번호/계좌 사기 이력이 조회된다",
      "score": 25,
      "severity": "HIGH",
      "description": "공식 사기 이력 데이터베이스에 등록된 번호·계좌"
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

| ID | 그룹 | 항목 | 점수 | 심각도 |
|---|---|---|---|---|
| `junggo_price_001` | 가격 | 시세보다 20% 이상 저렴하게 올라온 매물이다 | 15 | MEDIUM |
| `junggo_price_002` | 가격 | "오늘만", "급매", "지금 입금하면 할인" 등 긴박감을 조성한다 | 15 | MEDIUM |
| `junggo_seller_001` | 판매자 | 가입한 지 2주 미만이고 거래 이력이 없다 | 15 | MEDIUM |
| `junggo_seller_002` | 판매자 | 더치트·사이버캅에서 해당 번호/계좌 사기 이력이 조회된다 | 25 | HIGH |
| `junggo_payment_001` | 결제·연락 | 플랫폼 앱 채팅이 아닌 카카오톡·문자로 외부 유도한다 | 20 | HIGH |
| `junggo_payment_002` | 결제·연락 | 플랫폼 공식 안전결제 대신 계좌이체를 요구한다 | 20 | HIGH |
| `junggo_payment_003` | 결제·연락 | 외부 링크로 안전결제 URL을 별도로 보내왔다 | 25 | HIGH |
| `junggo_process_001` | 거래 방식 | 직거래를 거부하고 택배 거래만 고집한다 | 10 | LOW |
| `junggo_process_002` | 거래 방식 | 제3자가 중간에 끼어 거래를 대리한다 | 20 | HIGH |
| `junggo_process_003` | 거래 방식 | "수수료 포함 재입금" 또는 "환불 후 재결제" 요구가 있다 | 25 | HIGH |

### 부동산 (10개)

> 출처: 국토교통부 전세사기 피해 실태조사(2024), 경찰청 전세사기 유형 보도자료

| ID | 그룹 | 항목 | 점수 | 심각도 |
|---|---|---|---|---|
| `jeonse_price_001` | 가격 | 전세가율이 80% 이상이다 (매매가 대비 전세가) | 20 | HIGH |
| `jeonse_price_002` | 가격 | 주변 시세보다 지나치게 저렴한 매물이다 | 15 | MEDIUM |
| `jeonse_registry_001` | 등기부 | 근저당권이 설정되어 있다 | 20 | HIGH |
| `jeonse_registry_002` | 등기부 | 등기부등본 갑구에 "신탁" 표기가 있다 | 25 | HIGH |
| `jeonse_registry_003` | 등기부 | 소유권이 최근 6개월 내 변경됐다 | 15 | MEDIUM |
| `jeonse_registry_004` | 등기부 | 체납세금·가압류 기록이 있다 | 20 | HIGH |
| `jeonse_owner_001` | 임대인 | 임대인 본인과 직접 대면 확인이 불가능하다 | 20 | HIGH |
| `jeonse_owner_002` | 임대인 | 공인중개사가 등기부등본 확인을 기피한다 | 20 | HIGH |
| `jeonse_safety_001` | 안전장치 | 전세보증보험(HUG) 가입을 거부하거나 기피한다 | 20 | HIGH |
| `jeonse_safety_002` | 안전장치 | 잔금일 당일 등기부등본을 다시 확인하지 않았다 | 15 | MEDIUM |

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
