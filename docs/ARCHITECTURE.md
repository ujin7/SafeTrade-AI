# 시스템 아키텍처

## 개요

SafeTrade AI는 모노레포(monorepo) 구조로, 프론트엔드(React)와 백엔드(FastAPI)를 단일 저장소에서 관리한다. 체크리스트 기반 규칙 엔진으로 거래 위험도를 계산하며, LLM 없이 결정적(deterministic) 결과를 보장한다.

---

## 디렉터리 구조

```
safetrade-ai/
├── apps/
│   ├── api/                  # FastAPI 백엔드
│   │   ├── app/
│   │   │   ├── main.py       # 앱 진입점, CORS 설정
│   │   │   ├── routers/
│   │   │   │   └── analyze.py    # POST /api/analyze 엔드포인트
│   │   │   ├── services/
│   │   │   │   └── scoring.py    # 위험도 산출 규칙 엔진
│   │   │   └── data/
│   │   │       ├── used_trade.py     # 중고거래 체크리스트 (10개)
│   │   │       └── real_estate.py    # 부동산 체크리스트 (10개)
│   │   ├── tests/
│   │   │   ├── test_analyze.py   # API 통합 테스트 (15개)
│   │   │   └── test_scoring.py   # 스코어링 유닛 테스트 (15개)
│   │   └── pyproject.toml
│   └── web/                  # React 프론트엔드
│       └── src/
│           ├── App.jsx           # 화면 오케스트레이터
│           ├── components/
│           │   ├── HomePage.jsx      # 홈 랜딩 화면
│           │   ├── CategorySelect.jsx
│           │   ├── TextInput.jsx
│           │   ├── ChecklistForm.jsx
│           │   ├── ResultView.jsx
│           │   └── TemplateSection.jsx
│           ├── hooks/
│           │   └── useAnalyze.js     # API 호출 훅
│           └── data/
│               ├── checklist.js      # 프론트 체크리스트 데이터
│               └── templates.js      # 추가 확인 템플릿 데이터
└── docs/                     # 설계 문서
```

---

## 아키텍처 다이어그램

```
┌─────────────────────────────────────────────┐
│                브라우저 (React)               │
│                                             │
│  [홈] → [카테고리] → [텍스트입력] → [체크리스트]  │
│                              ↓              │
│                         [결과 화면]           │
│                    점수 · 등급 · 신호 · 템플릿  │
└────────────────────┬────────────────────────┘
                     │  POST /api/analyze
                     │  (Vite 개발 프록시: /api → :8000)
                     ▼
┌─────────────────────────────────────────────┐
│             FastAPI 서버 (:8000)              │
│                                             │
│  analyze.py (라우터)                         │
│    ├── 카테고리 검증 (cross-category 차단)    │
│    ├── 중복 항목 검증                         │
│    └── calculate_risk() 호출                │
│                                             │
│  scoring.py (규칙 엔진)                      │
│    ├── ID → 체크리스트 항목 조회              │
│    ├── 점수 합산 (상한: 100)                  │
│    ├── 등급 판정 (LOW/MEDIUM/HIGH)            │
│    └── 점수 내림차순 정렬                     │
│                                             │
│  data/ (정적 데이터)                          │
│    ├── used_trade.py (중고거래 10개 항목)      │
│    └── real_estate.py (부동산 10개 항목)      │
└─────────────────────────────────────────────┘
```

---

## 프론트엔드 (React 19 + Vite 8)

### 화면 흐름

```
home (홈 랜딩)
  └─ analyze
       ├─ step 0: 카테고리 선택
       ├─ step 1: 텍스트 입력 (최소 50자)
       ├─ step 2: 체크리스트 선택
       └─ step 3: 결과 확인
```

### 주요 설계 결정

| 항목 | 선택 | 이유 |
|------|------|------|
| 상태 관리 | React useState | 외부 라이브러리 없이 충분한 규모 |
| API 호출 | useAnalyze 커스텀 훅 | loading/error 상태를 컴포넌트와 분리 |
| 스타일 | CSS 커스텀 프로퍼티 | 다크모드 대응, 빌드 도구 불필요 |
| 분석 이력 | localStorage | 로그인 없이 최근 5개 저장 |
| 개발 CORS | Vite proxy | 별도 CORS 설정 없이 `/api` → `:8000` |

---

## 백엔드 (FastAPI + Python 3.14)

### 레이어 구조

```
routers/analyze.py      ← HTTP 요청/응답, 입력 검증 (Pydantic)
    ↓
services/scoring.py     ← 비즈니스 로직 (순수 함수)
    ↓
data/used_trade.py      ← 정적 데이터 (TypedDict 타입 보장)
data/real_estate.py
```

### 위험도 산출 규칙

```
점수 합산 = Σ(선택된 체크리스트 항목 점수)
최종 점수 = min(합산 점수, 100)

등급 판정:
  점수 ≥ 70  → HIGH   (거래 보류 강력 권장)
  점수 ≥ 31  → MEDIUM (추가 확인 권장)
  점수 ≥ 0   → LOW    (일반적인 주의 수준)
```

### 검증 규칙

- `category`는 `used_trade` 또는 `real_estate`만 허용
- `checked_items`의 각 ID는 선택한 `category`에 속해야 함 (cross-category 차단)
- `checked_items` 내 중복 ID 불허
- 위반 시 HTTP 422 반환

---

## 체크리스트 데이터 설계

각 항목은 TypedDict로 타입이 강제된다:

```python
class ChecklistItem(TypedDict):
    id: str           # 고유 식별자 (예: junggo_seller_002)
    category: str     # 소속 카테고리
    label: str        # 사용자에게 보이는 항목명
    score: int        # 위험도 기여 점수
    severity: str     # HIGH / MEDIUM / LOW
    description: str  # 왜 위험한지 1줄 설명
```

점수 가중치 기준 (CHECKLIST_SPEC.md 준거):

| 심각도 | 점수 범위 | 대표 사례 |
|--------|----------|---------|
| HIGH   | 35~40    | 사기 이력 조회, 가짜 안전결제 URL |
| MEDIUM | 20~30    | 계좌이체 요구, 제3자 거래, 선입금 |
| LOW    | 15~20    | 급처 문구, 직거래 회피, 신규 계정 |

---

## 테스트 전략

```
pytest (30개)
├── test_scoring.py (15개)  — 순수 함수 유닛 테스트
│   ├── 등급 경계값 (0/30/40/75)
│   ├── 점수 상한 클램프 (100)
│   ├── 중복 ID 처리
│   ├── 알 수 없는 ID 무시
│   └── 결정적 결과 보장
└── test_analyze.py (15개) — HTTP 통합 테스트
    ├── 정상 응답 (200)
    ├── 응답 스키마 검증
    ├── cross-category 차단 (422)
    ├── 중복 항목 차단 (422)
    └── input_text 옵션 동작
```

---

## 개발 환경 실행

```powershell
# 루트에서 한 번에 실행
.\dev.ps1

# 개별 실행
cd apps/api && uv run pytest -v          # 테스트
cd apps/api && uv run uvicorn app.main:app --reload   # API 서버
cd apps/web && npm run dev               # 웹 서버
```

| 서버 | 주소 |
|------|------|
| 웹 (React) | http://localhost:5173 |
| API (FastAPI) | http://localhost:8000 |
| API 문서 (Swagger) | http://localhost:8000/docs |