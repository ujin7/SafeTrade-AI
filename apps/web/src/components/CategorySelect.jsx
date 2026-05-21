import { CATEGORY_META } from '../data/checklist'

const ICONS = {
  used_trade: '🛒',
  real_estate: '🏠',
}

export default function CategorySelect({ onSelect }) {
  return (
    <div className="step-panel">
      <p className="step-desc">어떤 거래를 확인하시나요?</p>
      <div className="category-grid">
        {Object.entries(CATEGORY_META).map(([key, { label, desc }]) => (
          <button
            key={key}
            type="button"
            className="category-card"
            onClick={() => onSelect(key)}
          >
            <span className="category-icon">{ICONS[key]}</span>
            <span className="category-label">{label}</span>
            <span className="category-desc">{desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
