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
      <p className="step-desc">
        {suggestedItems.length > 0 ? 'AI가 감지한 위험 신호를 확인하세요' : '해당하는 항목을 직접 선택하세요'}
      </p>
      {suggestedItems.length > 0 ? (
        <div className="ai-suggest-notice">
          <span className="ai-notice-badge">AI 분석 완료</span>
          <span className="ai-notice-text">
            {suggestedItems.length}개 위험 신호를 감지했어요. 잘못된 항목은 해제하고, 누락된 항목은 추가하세요.
          </span>
        </div>
      ) : (
        <div className="ai-suggest-notice" style={{ background: 'rgba(156,163,175,0.08)', borderColor: 'rgba(156,163,175,0.25)' }}>
          <span className="ai-notice-badge" style={{ background: 'rgba(156,163,175,0.15)', color: '#6b7280' }}>AI 미감지</span>
          <span className="ai-notice-text">입력 텍스트에서 자동 감지된 신호가 없어요. 직접 해당하는 항목을 선택하세요.</span>
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
          <span className="checked-count">
            {checkedCount > 0 ? `${checkedCount}개 신호 선택됨` : '선택된 신호 없음'}
          </span>
          <button type="submit" className="submit-btn" disabled={loading}>
            위험도 분석하기
          </button>
        </div>
      </form>
    </div>
  )
}