import { useState } from 'react'
import ScoreGauge from './ScoreGauge'
import { FRAUD_CASES } from '../data/cases'
import { TEMPLATES } from '../data/templates'

const GRADE_META = {
  LOW:    { label: '낮음', desc: '일반적인 주의 수준이에요',  cls: 'grade-low'    },
  MEDIUM: { label: '보통', desc: '추가 확인을 권장해요',      cls: 'grade-medium' },
  HIGH:   { label: '높음', desc: '거래를 즉시 보류하세요',    cls: 'grade-high'   },
}

const SEVERITY_LABEL = { HIGH: '높음', MEDIUM: '중간', LOW: '낮음' }

function getRelatedCases(triggeredItems) {
  const ids = new Set(triggeredItems.map(i => i.id))
  return FRAUD_CASES
    .map(c => ({ ...c, overlap: c.signalIds.filter(id => ids.has(id)).length }))
    .filter(c => c.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 2)
}

function TemplateBox({ grade, signals }) {
  const [copied, setCopied] = useState(false)
  const tmpl = TEMPLATES[grade]
  if (!tmpl) return null

  const text = typeof tmpl.body === 'function' ? tmpl.body(signals) : tmpl.body

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="template-box">
      <p className="template-title">{tmpl.title}</p>
      <p className="template-sub">{tmpl.sub}</p>
      <textarea className="template-body" readOnly value={text} rows={6} />
      <button
        type="button"
        className={`template-copy-btn ${copied ? 'copied' : ''}`}
        onClick={handleCopy}
      >
        {copied ? '✓ 복사됨' : '클립보드에 복사'}
      </button>
    </div>
  )
}

export default function ResultView({ result, onReset }) {
  const { total_score, grade, triggered_items, disclaimer } = result
  const gradeMeta = GRADE_META[grade] ?? GRADE_META.LOW
  const relatedCases = getRelatedCases(triggered_items)
  const signalLabels = triggered_items.map(i => i.label)

  return (
    <div className="result-layout rise">
      <div className="result-left">
        <div className={`gauge-card ${gradeMeta.cls}`}>
          <ScoreGauge score={total_score} grade={grade} />
          <div className="grade-badge">{gradeMeta.label}</div>
          <p className="grade-desc">{gradeMeta.desc}</p>
        </div>

        <button type="button" className="reset-btn" onClick={onReset}>
          다시 분석하기
        </button>

        <div className="ai-result-section">
          <p className="section-title">
            AI 텍스트 분석
            <span className="coming-soon-badge">준비중</span>
          </p>
          <p className="ai-result-desc">
            채팅 패턴·심리적 압박·이상 문구 등 체크리스트로 잡기 어려운 위험 신호를 LLM이 직접 탐지합니다.
          </p>
          <ul className="ai-feature-list">
            <li>사기 유형 자동 분류</li>
            <li>압박·긴급 유도 문구 감지</li>
            <li>비정상 계좌·결제 패턴 탐지</li>
          </ul>
        </div>
      </div>

      <div className="result-right">
        <section className="result-section">
          <h3 className="section-title">
            탐지된 위험 신호
            <span className="signal-count">{triggered_items.length}개</span>
          </h3>

          {triggered_items.length === 0 ? (
            <p className="no-signals">선택된 위험 신호가 없습니다.</p>
          ) : (
            <ul className="signal-list">
              {triggered_items.map(item => (
                <li
                  key={item.id}
                  className={`signal-item sev-${(item.severity ?? '').toLowerCase()}`}
                >
                  <div className="signal-top">
                    <span className="signal-label">{item.label}</span>
                    {item.severity && (
                      <span className={`severity-badge severity-${item.severity.toLowerCase()}`}>
                        {SEVERITY_LABEL[item.severity] ?? item.severity}
                      </span>
                    )}
                  </div>
                  {(item.desc ?? item.description) && (
                    <p className="signal-desc">{item.desc ?? item.description}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <TemplateBox grade={grade} signals={signalLabels} />

        {relatedCases.length > 0 && (
          <section className="result-section">
            <h3 className="section-title">유사 피해 사례</h3>
            <ul className="related-list">
              {relatedCases.map(c => (
                <li key={c.id} className="related-item">
                  <div className="related-top">
                    <span className={`case-badge ${c.category === 'used_trade' ? 'case-badge-trade' : 'case-badge-estate'}`}>
                      {c.categoryLabel ?? c.category}
                    </span>
                    <span className="related-damage">{c.damage} 피해</span>
                  </div>
                  <p className="related-title">{c.title}</p>
                  <p className="related-lesson">💡 {c.lesson}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {disclaimer && <p className="disclaimer">{disclaimer}</p>}
      </div>
    </div>
  )
}
