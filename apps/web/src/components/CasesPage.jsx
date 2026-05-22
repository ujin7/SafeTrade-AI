import { useState } from 'react'
import { FRAUD_CASES } from '../data/cases'

export default function CasesPage() {
  const [open, setOpen] = useState(null)

  return (
    <div className="cases-page rise">
      <div className="cases-header">
        <h2 className="cases-title">실제 피해 사례</h2>
        <p className="cases-subtitle">
          경찰청·국토교통부 자료를 바탕으로 재구성한 대표 사기 사례입니다.
        </p>
      </div>

      <ul className="cases-list">
        {FRAUD_CASES.map(c => {
          const isOpen = open === c.id
          const borderCls = c.category === 'used_trade' ? 'case-card-trade' : 'case-card-estate'
          const badgeCls  = c.category === 'used_trade' ? 'case-badge-trade' : 'case-badge-estate'
          return (
            <li key={c.id} className={`case-card ${borderCls}`}>
              <button
                type="button"
                className="case-card-btn"
                onClick={() => setOpen(isOpen ? null : c.id)}
              >
                <div className="case-top">
                  <span className={`case-badge ${badgeCls}`}>
                    {c.categoryLabel ?? c.category}
                  </span>
                  <span className="case-damage">{c.damage} 피해</span>
                </div>
                <p className="case-title">{c.title}</p>
                <span className="case-chevron">{isOpen ? '▲' : '▼'}</span>
              </button>

              {isOpen && (
                <div className="case-detail">
                  <p className="case-summary">{c.summary}</p>

                  <div className="case-signals">
                    <span className="case-signals-label">탐지된 위험 신호</span>
                    <ul className="case-signal-list">
                      {c.signals.map((s, i) => (
                        <li key={i} className="case-signal-item">⚠ {s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="case-lesson">
                    <span className="case-lesson-label">예방법</span>
                    <p className="case-lesson-text">{c.lesson}</p>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <p className="cases-notice">
        위 사례는 실제 피해 패턴을 기반으로 재구성한 것으로, 특정 개인·업체와 무관합니다.
      </p>
    </div>
  )
}
