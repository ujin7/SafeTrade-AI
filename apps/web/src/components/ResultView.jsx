import ScoreGauge from './ScoreGauge'
import TemplateSection from './TemplateSection'

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
        <ScoreGauge score={total_score} grade={grade} />
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

      <section className="ai-result-section">
        <h3 className="section-title">
          AI 텍스트 분석
          <span className="coming-soon-badge">준비중</span>
        </h3>
        <div className="ai-result-card">
          <p className="ai-result-desc">
            입력하신 거래 내용을 LLM이 직접 분석하여 채팅 패턴·심리적 압박·이상 문구 등
            체크리스트로 잡기 어려운 위험 신호를 자동으로 탐지합니다.
          </p>
          <ul className="ai-feature-list">
            <li>사기 유형 자동 분류</li>
            <li>압박·긴급 유도 문구 감지</li>
            <li>비정상 계좌·결제 패턴 탐지</li>
          </ul>
        </div>
      </section>

      <TemplateSection triggeredItems={triggered_items} />

      <p className="disclaimer">{disclaimer}</p>

      <button type="button" className="reset-btn" onClick={onReset}>
        다시 분석하기
      </button>
    </div>
  )
}