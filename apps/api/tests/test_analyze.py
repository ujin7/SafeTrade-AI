import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


# ── 정상 응답 ────────────────────────────────────────────────

def test_analyze_used_trade_returns_200():
    res = client.post("/api/analyze", json={
        "category": "used_trade",
        "checked_items": ["junggo_seller_002", "junggo_payment_003"],
    })
    assert res.status_code == 200

def test_analyze_real_estate_returns_200():
    res = client.post("/api/analyze", json={
        "category": "real_estate",
        "checked_items": ["jeonse_registry_002", "jeonse_price_001"],
    })
    assert res.status_code == 200

def test_analyze_empty_checklist_returns_200():
    res = client.post("/api/analyze", json={
        "category": "used_trade",
        "checked_items": [],
    })
    assert res.status_code == 200
    body = res.json()
    assert body["total_score"] == 0
    assert body["grade"] == "LOW"


# ── 응답 스키마 ──────────────────────────────────────────────

def test_response_has_required_fields():
    res = client.post("/api/analyze", json={
        "category": "used_trade",
        "checked_items": ["junggo_seller_002"],
    })
    body = res.json()
    assert "total_score" in body
    assert "grade" in body
    assert "triggered_items" in body
    assert "disclaimer" in body

def test_triggered_item_has_required_fields():
    res = client.post("/api/analyze", json={
        "category": "used_trade",
        "checked_items": ["junggo_seller_002"],
    })
    item = res.json()["triggered_items"][0]
    assert "id" in item
    assert "category" in item
    assert "label" in item
    assert "score" in item
    assert "severity" in item
    assert "description" in item

def test_grade_is_valid_enum():
    res = client.post("/api/analyze", json={
        "category": "used_trade",
        "checked_items": ["junggo_seller_002", "junggo_payment_003"],
    })
    assert res.json()["grade"] in ("LOW", "MEDIUM", "HIGH")

def test_disclaimer_is_non_empty():
    res = client.post("/api/analyze", json={
        "category": "used_trade",
        "checked_items": [],
    })
    assert len(res.json()["disclaimer"]) > 0


# ── 위험도 등급 검증 ─────────────────────────────────────────

def test_high_grade_scenario():
    # 40 + 35 = 75 → HIGH
    res = client.post("/api/analyze", json={
        "category": "used_trade",
        "checked_items": ["junggo_seller_002", "junggo_payment_003"],
    })
    body = res.json()
    assert body["total_score"] == 75
    assert body["grade"] == "HIGH"

def test_score_clamped_at_100():
    res = client.post("/api/analyze", json={
        "category": "used_trade",
        "checked_items": [
            "junggo_seller_002",
            "junggo_payment_003",
            "junggo_process_003",
            "junggo_payment_002",
            "junggo_process_002",
        ],
    })
    assert res.json()["total_score"] == 100


# ── 검증 오류 (422) ──────────────────────────────────────────

def test_cross_category_items_returns_422():
    # real_estate 카테고리에 used_trade ID 전달
    res = client.post("/api/analyze", json={
        "category": "real_estate",
        "checked_items": ["junggo_seller_002"],
    })
    assert res.status_code == 422

def test_duplicate_items_returns_422():
    res = client.post("/api/analyze", json={
        "category": "used_trade",
        "checked_items": ["junggo_seller_002", "junggo_seller_002"],
    })
    assert res.status_code == 422

def test_invalid_category_returns_422():
    res = client.post("/api/analyze", json={
        "category": "invalid_category",
        "checked_items": [],
    })
    assert res.status_code == 422

def test_missing_category_returns_422():
    res = client.post("/api/analyze", json={
        "checked_items": ["junggo_seller_002"],
    })
    assert res.status_code == 422


# ── input_text 옵션 필드 ─────────────────────────────────────

def test_input_text_is_optional():
    res = client.post("/api/analyze", json={
        "category": "used_trade",
        "checked_items": [],
        "input_text": "오늘만 이 가격이에요 지금 입금해주세요",
    })
    assert res.status_code == 200

def test_without_input_text_still_works():
    res = client.post("/api/analyze", json={
        "category": "used_trade",
        "checked_items": [],
    })
    assert res.status_code == 200
