# API 명세

## 기본 정보

| 항목 | 내용 |
|------|------|
| Base URL (로컬) | `http://localhost:8000` |
| 인증 | 없음 (MVP) |
| 요청 형식 | `application/json` |
| 응답 형식 | `application/json` |
| 대화형 문서 | `http://localhost:8000/docs` (Swagger UI) |

---

## 엔드포인트 목록

| 메서드 | 경로 | 역할 |
|--------|------|------|
| GET | `/` | 서버 상태 확인 |
| POST | `/api/suggest` | 텍스트 → AI 위험 신호 추출 |
| POST | `/api/analyze` | 신호 목록 → 규칙 기반 점수 계산 |

---

## GET /

서버 상태 확인용.

**응답 예시**
```json
{ "message": "SafeTrade API Running" }
```

---

## POST /api/suggest

거래 텍스트를 받아 LLM(Claude Haiku)이 해당하는 위험 신호 ID를 추출해 반환한다.

**LLM 역할 제한**: 신호 추출만 수행. 점수 계산·등급 판정은 하지 않는다.

### 요청

```
POST /api/suggest
Content-Type: application/json
```

**요청 바디**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `category` | string | ✅ | 분석 카테고리. `used_trade` 또는 `real_estate` |
| `input_text` | string | ✅ | 분석할 거래 텍스트 (최소 10자) |

**요청 예시**
```json
{
  "category": "used_trade",
  "input_text": "오늘만 이 가격이에요. 지금 바로 계좌로 입금해주시면 바로 보내드릴게요. 안전결제는 수수료가 있어서요."
}
```

### 응답 (200 OK)

| 필드 | 타입 | 설명 |
|------|------|------|
| `suggested_ids` | string[] | 탐지된 위험 신호 ID 배열 |

**응답 예시**
```json
{
  "suggested_ids": [
    "junggo_price_002",
    "junggo_payment_002"
  ]
}
```

### 오류 응답

| 상태 코드 | 케이스 |
|----------|--------|
| 400 | 유효하지 않은 `category` 값 |
| 400 | `input_text`가 10자 미만 |

**오류 예시**
```json
{ "detail": "Invalid category" }
```

### 동작 특성

- LLM 호출 실패 또는 파싱 오류 시 빈 배열 `[]`을 반환 (폴백, 서비스 중단 없음)
- 응답 ID는 해당 카테고리의 신호 데이터셋에 존재하는 것만 포함 (검증 후 반환)

---

## POST /api/analyze

신호 ID 목록을 받아 규칙 기반으로 위험도 점수·등급·신호 목록을 반환한다.

사용자가 `/api/suggest` 결과를 검토·수정한 최종 신호 목록을 이 엔드포인트로 전달한다.

### 요청

```
POST /api/analyze
Content-Type: application/json
```

**요청 바디**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `category` | string | ✅ | 분석 카테고리. `used_trade` 또는 `real_estate` |
| `checked_items` | string[] | ✅ | 최종 선택된 위험 신호 ID 배열 (빈 배열 허용) |
| `input_text` | string | ❌ | 원문 텍스트 (현재는 수집만, 향후 근거 표시에 활용) |

**요청 예시 — 중고거래**
```json
{
  "category": "used_trade",
  "checked_items": ["junggo_price_002", "junggo_payment_002", "junggo_payment_003"],
  "input_text": "오늘만 이 가격이에요. 계좌로 입금해주세요."
}
```

**요청 예시 — 부동산**
```json
{
  "category": "real_estate",
  "checked_items": ["jeonse_registry_002", "jeonse_price_001"]
}
```

### 응답 (200 OK)

| 필드 | 타입 | 설명 |
|------|------|------|
| `total_score` | integer | 위험도 점수 (0~100) |
| `grade` | string | 위험도 등급. `LOW` / `MEDIUM` / `HIGH` |
| `triggered_items` | object[] | 탐지된 위험 신호 목록 (점수 내림차순) |
| `disclaimer` | string | 참고용 면책 문구 (고정값) |

**triggered_items 항목 구조**

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | string | 신호 ID |
| `category` | string | 소속 카테고리 |
| `label` | string | 신호 설명 |
| `score` | integer | 해당 신호 점수 |
| `severity` | string | 심각도. `HIGH` / `MEDIUM` / `LOW` |
| `description` | string | 위험 이유 설명 (1줄) |

**응답 예시**
```json
{
  "total_score": 75,
  "grade": "HIGH",
  "triggered_items": [
    {
      "id": "junggo_payment_003",
      "category": "used_trade",
      "label": "외부 링크로 안전결제 URL을 별도로 보내왔다",
      "score": 35,
      "severity": "HIGH",
      "description": "경찰청: 가짜 안전결제 피싱 급증"
    },
    {
      "id": "junggo_payment_002",
      "category": "used_trade",
      "label": "플랫폼 공식 안전결제 대신 계좌이체를 요구한다",
      "score": 25,
      "severity": "MEDIUM",
      "description": "경찰청 주요 수법 1위: 선입금 후 잠적"
    },
    {
      "id": "junggo_price_002",
      "category": "used_trade",
      "label": "\"오늘만\", \"급매\" 등 긴박감을 조성한다",
      "score": 15,
      "severity": "LOW",
      "description": "심리적 압박으로 판단력 저하 유도"
    }
  ],
  "disclaimer": "이 결과는 참고용 점검 도구이며, 법적 판단이나 전문가 의견을 대체하지 않습니다. 동일한 입력에 동일한 점수가 산출되며, 실제 거래 결정은 전문가와 상담 후 진행하세요."
}
```

### 오류 응답 (422 Unprocessable Entity)

| 케이스 | 설명 |
|--------|------|
| `category` 누락 | 필수 필드 없음 |
| 유효하지 않은 `category` | `used_trade`, `real_estate` 외 값 |
| 잘못된 카테고리 항목 | `real_estate` 카테고리에 `junggo_*` ID 전달 |
| `checked_items` 중복 | 동일 ID가 2개 이상 포함 |

**오류 예시**
```json
{ "detail": "category 'real_estate'에 속하지 않는 항목 ID: ['junggo_seller_002']" }
```

---

## 위험도 등급 기준

| 점수 범위 | 등급 | 의미 |
|----------|------|------|
| 0 ~ 30 | `LOW` | 일반적인 주의 수준 |
| 31 ~ 69 | `MEDIUM` | 추가 확인 권장 |
| 70 ~ 100 | `HIGH` | 거래 보류 강력 권장 |

- 점수 합산이 100을 초과하면 100으로 클램프
- 동일 입력 → 항상 동일 출력 (결정적 알고리즘)

---

## 위험 신호 ID 목록

### 중고거래 (`used_trade`)

| ID | 설명 | 점수 | 심각도 |
|----|------|------|--------|
| `junggo_price_001` | 시세보다 20% 이상 저렴 | 20 | MEDIUM |
| `junggo_price_002` | "오늘만", "급매" 등 긴박감 조성 | 15 | LOW |
| `junggo_seller_001` | 가입 2주 미만, 거래 이력 없음 | 20 | MEDIUM |
| `junggo_seller_002` | 더치트·사이버캅 사기 이력 조회 | 40 | HIGH |
| `junggo_payment_001` | 플랫폼 외부(카카오톡 등)로 유도 | 20 | MEDIUM |
| `junggo_payment_002` | 공식 안전결제 대신 계좌이체 요구 | 25 | MEDIUM |
| `junggo_payment_003` | 외부 링크로 가짜 안전결제 URL 전달 | 35 | HIGH |
| `junggo_process_001` | 직거래 거부, 택배 거래만 고집 | 15 | LOW |
| `junggo_process_002` | 제3자가 거래 대리 | 25 | MEDIUM |
| `junggo_process_003` | "수수료 포함 재입금" 요구 | 35 | HIGH |

### 부동산 (`real_estate`)

| ID | 설명 | 점수 | 심각도 |
|----|------|------|--------|
| `jeonse_price_001` | 전세가율 80% 이상 | 30 | HIGH |
| `jeonse_price_002` | 주변 시세보다 지나치게 저렴 | 20 | MEDIUM |
| `jeonse_registry_001` | 근저당권 설정 | 30 | HIGH |
| `jeonse_registry_002` | 등기부 갑구에 "신탁" 표기 | 35 | HIGH |
| `jeonse_registry_003` | 소유권 최근 6개월 내 변경 | 20 | MEDIUM |
| `jeonse_registry_004` | 체납세금·가압류 기록 | 25 | MEDIUM |
| `jeonse_owner_001` | 임대인 본인 대면 불가 | 25 | MEDIUM |
| `jeonse_owner_002` | 공인중개사의 등기부 확인 기피 | 20 | MEDIUM |
| `jeonse_safety_001` | 전세보증보험(HUG) 가입 거부 | 25 | MEDIUM |
| `jeonse_safety_002` | 잔금일 등기부 재확인 생략 | 15 | LOW |

---

## 분석 플로우 예시 (전체)

```
1. POST /api/suggest
   { category: "used_trade", input_text: "오늘만 이 가격..." }
   → { suggested_ids: ["junggo_price_002", "junggo_payment_002"] }

2. 사용자가 결과 검토 후 junggo_payment_003 추가

3. POST /api/analyze
   { category: "used_trade", checked_items: ["junggo_price_002", "junggo_payment_002", "junggo_payment_003"] }
   → { total_score: 75, grade: "HIGH", triggered_items: [...] }
```

---

## 로컬 테스트 예시 (PowerShell)

```powershell
# AI 신호 추출
curl -X POST http://localhost:8000/api/suggest `
  -H "Content-Type: application/json" `
  -d '{"category":"used_trade","input_text":"오늘만 이 가격이에요. 계좌로 먼저 보내주세요."}'

# 규칙 기반 점수 계산
curl -X POST http://localhost:8000/api/analyze `
  -H "Content-Type: application/json" `
  -d '{"category":"used_trade","checked_items":["junggo_seller_002","junggo_payment_003"]}'

# 빈 체크리스트 — LOW 응답
curl -X POST http://localhost:8000/api/analyze `
  -H "Content-Type: application/json" `
  -d '{"category":"used_trade","checked_items":[]}'
```
