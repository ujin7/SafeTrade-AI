import { CATEGORY_META } from '../data/checklist'

const ICONS = {
  used_trade: '🛒',
  real_estate: '🏠',
}

export default function CategorySelect({ onSelect }) {
  return (
    <div className="wiz-card rise">
      <h2 className="step-title">어떤 거래를 확인하시나요?</h2>
      <p className="step-sub">거래 유형을 선택하면 맞춤 체크리스트를 안내해 드립니다.</p>
      <div className="category-grid">
        {Object.entries(CATEGORY_META).map(([key, { label, desc }]) => (
          <button
            key={key}
            type="button"
            className="cat-card"
            onClick={() => onSelect(key)}
          >
            <span className="cat-icon">{ICONS[key]}</span>
            <span className="cat-label">{label}</span>
            <span className="cat-desc">{desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
