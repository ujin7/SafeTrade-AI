const GRADE_META = {
  LOW:    { label: '낮음', desc: '일반적인 주의 수준이에요',   color: 'grade-low'    },
  MEDIUM: { label: '보통', desc: '추가 확인을 권장해요',       color: 'grade-medium' },
  HIGH:   { label: '높음', desc: '거래를 즉시 보류하세요',     color: 'grade-high'   },
}

const SEVERITY_LABEL = { HIGH: '높음', MEDIUM: '중간', LOW: '낮음' }

export default function ResultView({ result, onReset }) {
  const { total_score, grade, triggered_items, disclaimer } = result
  const gradeMeta = GRADE_META[grade]

  return (
    <div className="step-panel">
      <div className={`score-card ${gradeMeta.color}`}>
        <div className="score-number">{total_score}</div>
        <div className="score-label">/ 100</div>
        <div className="grade-badge">{gradeMeta.label}</div>
        <p className="grade-desc">{gradeMeta.desc}</p>
      </div>

      <section className="signals-section">
        <h3 className="section-title">
          탐지된 위험 신호
          <span className="signal-count">{triggered_items.length}개</span>
        </h3>

        {triggered_items.length === 0 ? (
          <p className="no-signals">선택된 위험 신호가 없습니다.</p>
        ) : (
          <ul className="signal-list">
            {triggered_items.map(item => (
              <li key={item.id} className="signal-item">
                <div className="signal-top">
                  <span className="signal-label">{item.label}</span>
                  <span className={`severity-badge severity-${item.severity.toLowerCase()}`}>
                    {SEVERITY_LABEL[item.severity]}
                  </span>
                </div>
                <p className="signal-desc">{item.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="disclaimer">{disclaimer}</p>

      <button type="button" className="reset-btn" onClick={onReset}>
        다시 분석하기
      </button>
    </div>
  )
}
