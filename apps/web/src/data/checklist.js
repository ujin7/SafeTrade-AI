export const CHECKLISTS = {
  used_trade: [
    {
      id: 'junggo_price_001',
      group: '가격',
      label: '시세보다 20% 이상 저렴하게 올라온 매물이다',
      score: 15,
      severity: 'MEDIUM',
      desc: '비정상적으로 낮은 가격의 미끼 매물 패턴',
      keywords: ['저렴', '싸게', '싸', '할인', '시세보다', '급매'],
    },
    {
      id: 'junggo_price_002',
      group: '가격',
      label: '"오늘만", "급매", "지금 입금하면 할인" 등 긴박감을 조성한다',
      score: 15,
      severity: 'MEDIUM',
      desc: '심리적 압박으로 피해자의 판단력을 흐리는 수법',
      keywords: ['오늘만', '급합니다', '지금 입금', '빨리', '마감', '긴박'],
    },
    {
      id: 'junggo_seller_001',
      group: '판매자',
      label: '가입한 지 2주 미만이고 거래 이력이 없다',
      score: 15,
      severity: 'MEDIUM',
      desc: '사기에 악용되는 신규 계정의 전형적 특징',
      keywords: ['신규', '처음', '이력 없', '계정'],
    },
    {
      id: 'junggo_seller_002',
      group: '판매자',
      label: '더치트·사이버캅에서 해당 번호/계좌 사기 이력이 조회된다',
      score: 25,
      severity: 'HIGH',
      desc: '공식 사기 이력 데이터베이스에 등록된 번호·계좌',
      keywords: ['더치트', '사이버캅', '사기 이력', '조회'],
    },
    {
      id: 'junggo_payment_001',
      group: '결제·연락',
      label: '플랫폼 앱 채팅이 아닌 카카오톡·문자로 외부 유도한다',
      score: 20,
      severity: 'HIGH',
      desc: '플랫폼 보호망을 우회하기 위한 외부 채널 유도',
      keywords: ['카카오', '카톡', '문자', '외부', '톡으로', '문자로', '연락처'],
    },
    {
      id: 'junggo_payment_002',
      group: '결제·연락',
      label: '플랫폼 공식 안전결제 대신 계좌이체를 요구한다',
      score: 20,
      severity: 'HIGH',
      desc: '에스크로 없이 직접 입금 유도 — 가장 빈번한 사기 수법',
      keywords: ['계좌이체', '직접 입금', '입금해', '안전결제 말고', '계좌로'],
    },
    {
      id: 'junggo_payment_003',
      group: '결제·연락',
      label: '외부 링크로 안전결제 URL을 별도로 보내왔다',
      score: 25,
      severity: 'HIGH',
      desc: '가짜 결제 페이지로 유도하는 피싱 링크',
      keywords: ['링크', 'http', 'url', '주소 보내', '안전결제 링크'],
    },
    {
      id: 'junggo_process_001',
      group: '거래 방식',
      label: '직거래를 거부하고 택배 거래만 고집한다',
      score: 10,
      severity: 'LOW',
      desc: '대면 확인 회피 — 실물 없는 사기의 간접 신호',
      keywords: ['택배만', '직거래 안', '직거래 불가', '택배로만'],
    },
    {
      id: 'junggo_process_002',
      group: '거래 방식',
      label: '제3자가 중간에 끼어 거래를 대리한다',
      score: 20,
      severity: 'HIGH',
      desc: '본인 명의 계좌를 숨기기 위한 대리인 개입 수법',
      keywords: ['대리', '제3자', '다른 사람', '대신', '지인이'],
    },
    {
      id: 'junggo_process_003',
      group: '거래 방식',
      label: '"수수료 포함 재입금" 또는 "환불 후 재결제" 요구가 있다',
      score: 25,
      severity: 'HIGH',
      desc: '2차 피해를 유발하는 전형적인 재입금 사기',
      keywords: ['재입금', '수수료', '환불 후', '다시 입금', '오류가 났'],
    },
  ],
  real_estate: [
    {
      id: 'jeonse_price_001',
      group: '가격',
      label: '전세가율이 80% 이상이다 (매매가 대비 전세가)',
      score: 20,
      severity: 'HIGH',
      desc: '깡통전세 핵심 지표 — 경매 시 보증금 회수 불가 위험',
      keywords: ['전세가율', '80%', '90%', '매매가', '깡통'],
    },
    {
      id: 'jeonse_price_002',
      group: '가격',
      label: '주변 시세보다 지나치게 저렴한 매물이다',
      score: 15,
      severity: 'MEDIUM',
      desc: '허위 매물이나 하자 은폐 가능성을 시사하는 저가 유인',
      keywords: ['저렴', '싸게', '시세보다', '싼 편'],
    },
    {
      id: 'jeonse_registry_001',
      group: '등기부',
      label: '근저당권이 설정되어 있다',
      score: 20,
      severity: 'HIGH',
      desc: '선순위 채권으로 전세보증금 회수 순위 밀림',
      keywords: ['근저당', '담보', '저당'],
    },
    {
      id: 'jeonse_registry_002',
      group: '등기부',
      label: '등기부등본 갑구에 "신탁" 표기가 있다',
      score: 25,
      severity: 'HIGH',
      desc: '신탁 건물은 신탁사 동의 없는 전세계약이 무효 처리될 수 있음',
      keywords: ['신탁', '갑구', '등기부'],
    },
    {
      id: 'jeonse_registry_003',
      group: '등기부',
      label: '소유권이 최근 6개월 내 변경됐다',
      score: 15,
      severity: 'MEDIUM',
      desc: '갭투자·재매입 패턴으로 전세사기 전조일 수 있음',
      keywords: ['소유권 변경', '명의 변경', '최근 변경', '새 주인'],
    },
    {
      id: 'jeonse_registry_004',
      group: '등기부',
      label: '체납세금·가압류 기록이 있다',
      score: 20,
      severity: 'HIGH',
      desc: '국세·지방세 체납 시 보증금보다 세금이 우선 변제됨',
      keywords: ['체납', '가압류', '압류', '세금'],
    },
    {
      id: 'jeonse_owner_001',
      group: '임대인',
      label: '임대인 본인과 직접 대면 확인이 불가능하다',
      score: 20,
      severity: 'HIGH',
      desc: '위임장 사기·명의도용 전세사기의 핵심 패턴',
      keywords: ['대면 불가', '만날 수 없', '전화만', '직접 못 만'],
    },
    {
      id: 'jeonse_owner_002',
      group: '임대인',
      label: '공인중개사가 등기부등본 확인을 기피한다',
      score: 20,
      severity: 'HIGH',
      desc: '서류 확인 회피는 하자 은폐 시도의 명백한 신호',
      keywords: ['등기부 안', '확인 거부', '기피', '나중에 보여'],
    },
    {
      id: 'jeonse_safety_001',
      group: '안전장치',
      label: '전세보증보험(HUG) 가입을 거부하거나 기피한다',
      score: 20,
      severity: 'HIGH',
      desc: 'HUG 가입 거부는 보증금 반환 불가 고의 은폐 신호',
      keywords: ['보증보험', 'HUG', '거부', '가입 안', '필요 없'],
    },
    {
      id: 'jeonse_safety_002',
      group: '안전장치',
      label: '잔금일 당일 등기부등본을 다시 확인하지 않았다',
      score: 15,
      severity: 'MEDIUM',
      desc: '잔금 직전 근저당 추가 설정 사례 다수 — 반드시 재확인 필요',
      keywords: ['잔금일', '당일', '등기부 안', '확인 안'],
    },
  ],
}

export const CATEGORY_META = {
  used_trade: { label: '중고거래', desc: '당근마켓, 번개장터 등 개인 간 거래' },
  real_estate: { label: '부동산', desc: '전세·월세 계약, 임대 거래' },
}

export const SEVERITY_LABEL = { HIGH: '높음', MEDIUM: '중간', LOW: '낮음' }

export const SAMPLES = {
  used_trade: [
    '안전결제 말고 계좌이체로 해주세요. 오늘만 이 가격 가능해요.',
    '외부 링크로 안전결제 보내드릴게요. 클릭해서 입금해주세요.',
    '택배 거래만 가능합니다. 제 지인 계좌로 입금해 주시면 됩니다.',
  ],
  real_estate: [
    '전세보증보험은 번거로워서 저희는 안 해요. 직접 계약해요.',
    '등기부등본은 계약 후에 보여드릴게요. 먼저 계약금만 주세요.',
    '전세가율이 90%지만 위치가 워낙 좋아서 괜찮아요.',
  ],
}

export function suggestFromText(category, text) {
  const lower = text.toLowerCase()
  return (CHECKLISTS[category] ?? [])
    .filter(item => item.keywords?.some(k => lower.includes(k)))
    .map(item => item.id)
}

export function scoreCheck(category, checkedIds) {
  const items = CHECKLISTS[category] ?? []
  const triggered = items.filter(i => checkedIds.includes(i.id))
  const total = Math.min(100, triggered.reduce((s, i) => s + i.score, 0))
  const grade = total >= 70 ? 'HIGH' : total >= 31 ? 'MEDIUM' : 'LOW'
  return {
    total_score: total,
    grade,
    triggered_items: triggered.map(i => ({
      id: i.id,
      label: i.label,
      severity: i.severity,
      description: i.desc,
    })),
    disclaimer: '이 분석은 AI API 없이 로컬에서 계산된 참고용 결과입니다. 정확한 분석을 위해 인터넷 연결을 확인하고 다시 시도해 주세요.',
  }
}
