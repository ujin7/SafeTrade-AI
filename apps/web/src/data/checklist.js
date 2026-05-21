export const CHECKLISTS = {
  used_trade: [
    {
      id: 'junggo_price_001',
      category: '가격',
      label: '시세보다 20% 이상 저렴하게 올라온 매물이다',
    },
    {
      id: 'junggo_price_002',
      category: '가격',
      label: '"오늘만", "급매", "지금 입금하면 할인" 등 긴박감을 조성한다',
    },
    {
      id: 'junggo_seller_001',
      category: '판매자',
      label: '가입한 지 2주 미만이고 거래 이력이 없다',
    },
    {
      id: 'junggo_seller_002',
      category: '판매자',
      label: '더치트·사이버캅에서 해당 번호/계좌 사기 이력이 조회된다',
    },
    {
      id: 'junggo_payment_001',
      category: '결제·연락',
      label: '플랫폼 앱 채팅이 아닌 카카오톡·문자로 외부 유도한다',
    },
    {
      id: 'junggo_payment_002',
      category: '결제·연락',
      label: '플랫폼 공식 안전결제 대신 계좌이체를 요구한다',
    },
    {
      id: 'junggo_payment_003',
      category: '결제·연락',
      label: '외부 링크로 안전결제 URL을 별도로 보내왔다',
    },
    {
      id: 'junggo_process_001',
      category: '거래 방식',
      label: '직거래를 거부하고 택배 거래만 고집한다',
    },
    {
      id: 'junggo_process_002',
      category: '거래 방식',
      label: '제3자가 중간에 끼어 거래를 대리한다',
    },
    {
      id: 'junggo_process_003',
      category: '거래 방식',
      label: '"수수료 포함 재입금" 또는 "환불 후 재결제" 요구가 있다',
    },
  ],
  real_estate: [
    {
      id: 'jeonse_price_001',
      category: '가격',
      label: '전세가율이 80% 이상이다 (매매가 대비 전세가)',
    },
    {
      id: 'jeonse_price_002',
      category: '가격',
      label: '주변 시세보다 지나치게 저렴한 매물이다',
    },
    {
      id: 'jeonse_registry_001',
      category: '등기부',
      label: '근저당권이 설정되어 있다',
    },
    {
      id: 'jeonse_registry_002',
      category: '등기부',
      label: '등기부등본 갑구에 "신탁" 표기가 있다',
    },
    {
      id: 'jeonse_registry_003',
      category: '등기부',
      label: '소유권이 최근 6개월 내 변경됐다',
    },
    {
      id: 'jeonse_registry_004',
      category: '등기부',
      label: '체납세금·가압류 기록이 있다',
    },
    {
      id: 'jeonse_owner_001',
      category: '임대인',
      label: '임대인 본인과 직접 대면 확인이 불가능하다',
    },
    {
      id: 'jeonse_owner_002',
      category: '임대인',
      label: '공인중개사가 등기부등본 확인을 기피한다',
    },
    {
      id: 'jeonse_safety_001',
      category: '안전장치',
      label: '전세보증보험(HUG) 가입을 거부하거나 기피한다',
    },
    {
      id: 'jeonse_safety_002',
      category: '안전장치',
      label: '잔금일 당일 등기부등본을 다시 확인하지 않았다',
    },
  ],
}

export const CATEGORY_META = {
  used_trade: { label: '중고거래', desc: '당근마켓, 번개장터 등 개인 간 거래' },
  real_estate: { label: '부동산', desc: '전세·월세 계약, 임대 거래' },
}
