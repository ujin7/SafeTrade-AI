import pytest
from app.services.scoring import calculate_risk


# ── 등급 경계값 ────────────────────────────────────────────────

def test_empty_input_is_low():
    r = calculate_risk([])
    assert r.score == 0
    assert r.level == "LOW"
    assert r.matched_signals == []

def test_score_30_is_low():
    # jeonse_price_001 = 30점
    r = calculate_risk(["jeonse_price_001"])
    assert r.score == 30
    assert r.level == "LOW"

def test_score_31_is_medium():
    # junggo_seller_002(40) → 40점 → MEDIUM
    r = calculate_risk(["junggo_seller_002"])
    assert r.score == 40
    assert r.level == "MEDIUM"

def test_score_69_is_medium():
    # junggo_seller_002(40) + junggo_process_001(15) + junggo_price_002(15) = 70 → HIGH
    # junggo_seller_002(40) + junggo_payment_001(20) = 60 → MEDIUM
    r = calculate_risk(["junggo_seller_002", "junggo_payment_001"])
    assert r.score == 60
    assert r.level == "MEDIUM"

def test_score_70_is_high():
    # junggo_seller_002(40) + junggo_payment_003(35) = 75 → HIGH
    r = calculate_risk(["junggo_seller_002", "junggo_payment_003"])
    assert r.score == 75
    assert r.level == "HIGH"


# ── 점수 상한 클램프 ────────────────────────────────────────────

def test_score_clamped_at_100():
    # 전체 항목 선택 시 합산이 100 초과해도 100으로 클램프
    all_ids = [
        "junggo_seller_002",   # 40
        "junggo_payment_003",  # 35
        "junggo_process_003",  # 35
        "junggo_payment_002",  # 25
        "junggo_process_002",  # 25
    ]
    r = calculate_risk(all_ids)
    assert r.score == 100

def test_score_never_exceeds_100():
    from app.data.used_trade import USED_TRADE_CHECKLIST
    from app.data.real_estate import REAL_ESTATE_CHECKLIST
    all_ids = (
        [item["id"] for item in USED_TRADE_CHECKLIST]
        + [item["id"] for item in REAL_ESTATE_CHECKLIST]
    )
    r = calculate_risk(all_ids)
    assert r.score <= 100


# ── 중복 처리 ────────────────────────────────────────────────

def test_duplicate_ids_counted_once():
    r_single = calculate_risk(["junggo_seller_002"])
    r_double = calculate_risk(["junggo_seller_002", "junggo_seller_002"])
    assert r_single.score == r_double.score

def test_duplicate_does_not_appear_twice_in_signals():
    r = calculate_risk(["junggo_seller_002", "junggo_seller_002"])
    ids = [s["id"] for s in r.matched_signals]
    assert ids.count("junggo_seller_002") == 1


# ── 알 수 없는 ID ──────────────────────────────────────────────

def test_unknown_id_is_ignored_in_score():
    r = calculate_risk(["unknown_id_999"])
    assert r.score == 0
    assert r.level == "LOW"

def test_unknown_id_collected():
    r = calculate_risk(["junggo_seller_002", "unknown_id_999"])
    assert "unknown_id_999" in r.unknown_ids
    assert r.score == 40

def test_multiple_unknown_ids_all_collected():
    r = calculate_risk(["foo", "bar", "baz"])
    assert set(r.unknown_ids) == {"foo", "bar", "baz"}


# ── 결과 정렬 ────────────────────────────────────────────────

def test_signals_sorted_by_score_descending():
    r = calculate_risk([
        "junggo_price_002",   # 15
        "junggo_seller_002",  # 40
        "junggo_payment_002", # 25
    ])
    scores = [s["score"] for s in r.matched_signals]
    assert scores == sorted(scores, reverse=True)


# ── 결정적 결과 (동일 입력 → 동일 출력) ────────────────────────

def test_deterministic_result():
    ids = ["junggo_seller_002", "junggo_payment_003", "jeonse_registry_002"]
    r1 = calculate_risk(ids)
    r2 = calculate_risk(ids)
    assert r1.score == r2.score
    assert r1.level == r2.level
    assert [s["id"] for s in r1.matched_signals] == [s["id"] for s in r2.matched_signals]


# ── 중고거래 / 부동산 혼합 ────────────────────────────────────

def test_cross_category_scoring():
    # 두 카테고리 ID를 섞어도 정상 합산
    r = calculate_risk(["junggo_seller_002", "jeonse_registry_002"])
    assert r.score == 40 + 35
    assert r.level == "HIGH"
