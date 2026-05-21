import { useState } from 'react'
import { CHECKLISTS, CATEGORY_META } from '../data/checklist'

export default function ChecklistForm({ category, onSubmit, onBack, loading, error }) {
  const [checked, setChecked] = useState(new Set())
  const items = CHECKLISTS[category]

  const groups = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  function toggle(id) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ category, checked_items: [...checked] })
  }

  const checkedCount = checked.size

  return (
    <div className="step-panel">
      <button type="button" className="back-btn" onClick={onBack}>
        ← {CATEGORY_META[category].label}
      </button>
      <p className="step-desc">해당하는 항목을 모두 선택하세요</p>

      <form onSubmit={handleSubmit}>
        <div className="checklist-groups">
          {Object.entries(groups).map(([groupName, groupItems]) => (
            <div key={groupName} className="checklist-group">
              <h3 className="group-title">{groupName}</h3>
              {groupItems.map(item => (
                <label key={item.id} className={`check-item ${checked.has(item.id) ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={checked.has(item.id)}
                    onChange={() => toggle(item.id)}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          ))}
        </div>

        {error && <p className="error-msg">{error}</p>}

        <div className="form-footer">
          {checkedCount > 0 && (
            <span className="checked-count">
              {checkedCount}개 선택됨
            </span>
          )}
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? '분석 중...' : '분석하기'}
          </button>
        </div>
      </form>
    </div>
  )
}
