import { useState } from 'react'
import { CHECKLISTS, CATEGORY_META } from '../data/checklist'

export default function ChecklistForm({ category, onSubmit, onBack, loading, error, suggestedItems = [] }) {
  const [checked, setChecked] = useState(() => new Set(suggestedItems))
  const items = CHECKLISTS[category]

  const groups = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  function toggle(id) {
    if (loading) return
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
    <div className="step-panel" style={{ position: 'relative' }}>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner" />
          <p className="loading-text">분석 중이에요</p>
          <p className="loading-hint">보통 1~2초 걸려요</p>
        </div>
      )}

      <button type="button" className="back-btn" onClick={onBack} disabled={loading}>
        ← {CATEGORY_META[category].label}
      </button>
      <p className="step-desc">해당하는 항목을 모두 선택하세요</p>
      {suggestedItems.length > 0 && (
        <div className="ai-suggest-notice">
          <span className="ai-notice-badge">AI 추천</span>
          <span className="ai-notice-text">
            입력하신 내용을 분석해 {suggestedItems.length}개 항목을 미리 선택했어요. 검토 후 수정하세요.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="checklist-groups">
          {Object.entries(groups).map(([groupName, groupItems]) => (
            <div key={groupName} className="checklist-group">
              <h3 className="group-title">{groupName}</h3>
              {groupItems.map(item => (
                <label
                  key={item.id}
                  className={`check-item ${checked.has(item.id) ? 'checked' : ''} ${suggestedItems.includes(item.id) ? 'ai-suggested' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={checked.has(item.id)}
                    onChange={() => toggle(item.id)}
                    disabled={loading}
                  />
                  <span>{item.label}</span>
                  {suggestedItems.includes(item.id) && (
                    <span className="ai-tag">AI</span>
                  )}
                </label>
              ))}
            </div>
          ))}
        </div>

        {error && <p className="error-msg">{error}</p>}

        <div className="form-footer">
          {checkedCount > 0 && (
            <span className="checked-count">{checkedCount}개 선택됨</span>
          )}
          <button type="submit" className="submit-btn" disabled={loading}>
            분석하기
          </button>
        </div>
      </form>
    </div>
  )
}