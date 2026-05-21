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

## 엔드포인트

### GET /

서버 상태 확인용.

**응답 예시**
```json
{ "message": "SafeTrade API Running" }
```

---

### POST /api/analyze

체크리스트 항목을 받아 위험도 점수·등급·신호 목록을 반환한다.

#### 요청

```
POST /api/analyze
Content-Type: application/json
```

**요청 바디**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `category` | string | ✅ | 분석 카테고리. `used_trade` 또는 `real_estate` |
| `checked_items` | string[] | ✅ | 선택된 체크리스트 항목 ID 배열 (빈 배열 허용) |
| `input_text` | string | ❌ | 거래 내용 텍스트 (향후 AI 분석에 활용 예정, 현재는 수집만) |

**요청 예시 — 중고거래**
```json
{
  "category": "used_trade",
  "checked_items": ["junggo_seller_002", "junggo_payment_003"],
  "input_text": "오늘만 이 가격이에요. 지금 바로 입금해주시면..."
}
```

**요청 예시 — 부동산**
```json
{
  "category": "real_estate",
  "checked_items": ["jeonse_registry_002", "jeonse_price_001"]
}
```

---

#### 응답 (200 OK)

| 필드 | 타입 | 설명 |
|------|------|------|
| `total_score` | integer | 위험도 점수 (0~100) |
| `grade` | string | 위험도 등급. `LOW` / `MEDIUM` / `HIGH` |
| `triggered_items` | object[] | 탐지된 위험 신호 목록 (점수 내림차순) |
| `disclaimer` | string | 참고용 면책 문구 (고정값) |

**triggered_items 항목 구조**

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | string | 체크리스트 항목 ID |
| `category` | string | 소속 카테고리 (`used_trade` / `real_estate`) |
| `label` | string | 항목명 |
| `score` | integer | 해당 항목 점수 |
| `severity` | string | 심각도. `HIGH` / `MEDIUM` / `LOW` |
| `description` | string | 위험 이유 설명 (1줄) |

**응답 예시**
```json
{
  "total_score": 75,
  "grade": "HIGH",
  "triggered_items": [
    {
      "id": "junggo_seller_002",
      "category": "used_trade",
      "label": "더치트·사이버캅에서 해당 번호/계좌 사기 이력이 조회된다",
      "score": 40,
      "severity": "HIGH",
      "description": "더치트 등록 이력은 실제 피해 근거로, 즉시 거래를 중단하세요."
    },
    {
      "id": "junggo_payment_003",
      "category": "used_trade",
      "label": "외부 링크로 안전결제 URL을 별도로 보내왔다",
      "score": 35,
      "severity": "HIGH",
      "description": "가짜 안전결제 피싱 수법입니다. 플랫폼 공식 결제만 사용하세요."
    }
  ],
  "disclaimer": "이 결과는 참고용 점검 도구이며, 법적 판단이나 전문가 의견을 대체하지 않습니다. 동일한 입력에 동일한 점수가 산출되며, 실제 거래 결정은 전문가와 상담 후 진행하세요."
}
```

---

#### 오류 응답 (422 Unprocessable Entity)

입력 값이 유효하지 않을 때 반환된다.

**오류 케이스**

| 케이스 | 설명 |
|--------|------|
| `category` 누락 | 필수 필드 없음 |
| 유효하지 않은 `category` | `used_trade`, `real_estate` 외 값 |
| 잘못된 카테고리 항목 | `real_estate` 카테고리에 `junggo_*` ID 전달 등 |
| `checked_items` 중복 | 동일 ID가 2개 이상 포함 |

**오류 응답 예시 — 잘못된 카테고리**
```json
{
  "detail": "category 'real_estate'에 속하지 않는 항목 ID: ['junggo_seller_002']"
}
```

**오류 응답 예시 — Pydantic 검증 실패**
```json
{
  "detail": [
    {
      "type": "literal_error",
      "loc": ["body", "category"],
      "msg": "Input should be 'used_trade' or 'real_estate'",
      "input": "invalid_category"
    }
  ]
}
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

## 체크리스트 항목 ID

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
| `jeonse_price_001` | 전세가율 80% 이상 | 30 | MEDIUM |
| `jeonse_price_002` | 주변 시세보다 지나치게 저렴 | 20 | MEDIUM |
| `jeonse_registry_001` | 근저당권 설정 | 30 | MEDIUM |
| `jeonse_registry_002` | 등기부 갑구에 "신탁" 표기 | 35 | HIGH |
| `jeonse_registry_003` | 소유권 최근 6개월 내 변경 | 20 | MEDIUM |
| `jeonse_registry_004` | 체납세금·가압류 기록 | 25 | MEDIUM |
| `jeonse_owner_001` | 임대인 본인 대면 불가 | 25 | MEDIUM |
| `jeonse_owner_002` | 공인중개사의 등기부 확인 기피 | 20 | MEDIUM |
| `jeonse_safety_001` | 전세보증보험(HUG) 가입 거부 | 25 | MEDIUM |
| `jeonse_safety_002` | 잔금일 등기부 재확인 생략 | 15 | LOW |

---

## 로컬 테스트 예시 (PowerShell)

```powershell
# 정상 요청 — HIGH 시나리오
curl -X POST http://localhost:8000/api/analyze `
  -H "Content-Type: application/json" `
  -d '{"category":"used_trade","checked_items":["junggo_seller_002","junggo_payment_003"]}'

# 빈 체크리스트 — LOW 응답
curl -X POST http://localhost:8000/api/analyze `
  -H "Content-Type: application/json" `
  -d '{"category":"used_trade","checked_items":[]}'

# 422 — 잘못된 카테고리
curl -X POST http://localhost:8000/api/analyze `
  -H "Content-Type: application/json" `
  -d '{"category":"invalid","checked_items":[]}'
```