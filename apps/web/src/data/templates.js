const GROUPS = {
  prepayment: [
    '선입금(보증금) 없이 거래 가능할까요? 안전결제(에스크로) 또는 대면 거래로 진행하고 싶어요.',
    '계좌 명의(실명) 확인을 위해 예금주명과 신분 확인 가능한 자료를 받을 수 있을까요?',
    '입금 요청 사유와 환불 조건을 문자로 남겨주세요.',
  ],
  safe_pay: [
    '직거래가 어렵다면 안전결제(에스크로)로 진행할 수 있을까요?',
    '거래 전 제품 상태 확인을 위해 영상통화/사진 추가 제공이 가능할까요?',
    '택배 거래 시 발송 전 운송장/포장 영상 공유가 가능할까요?',
  ],
  external_link: [
    '앱/플랫폼 내에서 대화와 결제를 진행하고 싶어요. 여기서 계속 이야기할 수 있을까요?',
    '외부 링크는 열기 어렵습니다. 필요한 정보는 메시지로 텍스트로 보내주세요.',
  ],
  third_party: [
    '입금 계좌가 본인 명의가 맞는지 확인할 수 있을까요? 명의 불일치면 거래가 어렵습니다.',
    '대리인이 나온다면 위임장/신분 확인 자료를 받을 수 있을까요?',
  ],
  low_price: [
    '가격이 시세보다 낮은 이유가 무엇인지, 하자/소유 경위 포함해 설명해주실 수 있을까요?',
    '제품(또는 권리관계) 증빙 자료(구매 영수증/등기 등)를 받을 수 있을까요?',
  ],
  identity: [
    '신분 확인(이름/연락처)과 소유/권한 증빙(영수증/등기/임대인 동의 등)을 부탁드려요.',
    '증빙이 어렵다면 안전한 방식(공인중개사/안전결제/대면 확인)으로만 진행하겠습니다.',
  ],
  pressure: [
    '확인할 시간이 필요합니다. 오늘 확정이 어려우면 거래를 진행하지 않겠습니다.',
    '계약/거래 조건을 정리해 보내주시면 검토 후 답드릴게요.',
  ],
  contract: [
    '주요 조건(금액/일정/환불/책임)을 문서(메시지/계약서)로 남겨주세요.',
    '부동산 거래라면 공인중개사 통해 진행하고, 등기/권리관계 확인 후 계약하겠습니다.',
  ],
}

// 체크리스트 항목 ID → 우선 템플릿 그룹
const SIGNAL_TEMPLATE_MAP = {
  junggo_price_001:    GROUPS.low_price,
  junggo_price_002:    GROUPS.pressure,
  junggo_seller_001:   GROUPS.identity,
  junggo_seller_002:   GROUPS.identity,
  junggo_payment_001:  GROUPS.external_link,
  junggo_payment_002:  GROUPS.prepayment,
  junggo_payment_003:  GROUPS.external_link,
  junggo_process_001:  GROUPS.safe_pay,
  junggo_process_002:  GROUPS.third_party,
  junggo_process_003:  GROUPS.prepayment,

  jeonse_price_001:    GROUPS.low_price,
  jeonse_price_002:    GROUPS.low_price,
  jeonse_registry_001: GROUPS.contract,
  jeonse_registry_002: GROUPS.contract,
  jeonse_registry_003: GROUPS.identity,
  jeonse_registry_004: GROUPS.contract,
  jeonse_owner_001:    GROUPS.identity,
  jeonse_owner_002:    GROUPS.identity,
  jeonse_safety_001:   GROUPS.contract,
  jeonse_safety_002:   GROUPS.contract,
}

const COMMON_TEMPLATES = [
  '선입금(보증금) 없이 거래 가능할까요? 안전결제(에스크로) 또는 대면 거래로 진행하고 싶어요.',
  '직거래가 어렵다면 안전결제(에스크로)로 진행할 수 있을까요?',
  '제품/매물 상태 확인을 위해 사진 추가 또는 영상통화가 가능할까요?',
]

// triggered_items의 id 배열을 받아 중복 없이 최대 5개 템플릿 반환
export function getTemplatesForSignals(signalIds) {
  const seen = new Set()
  const result = []

  for (const id of signalIds) {
    for (const t of SIGNAL_TEMPLATE_MAP[id] ?? []) {
      if (!seen.has(t) && result.length < 5) {
        seen.add(t)
        result.push(t)
      }
    }
  }

  return result.length > 0 ? result : COMMON_TEMPLATES
}
