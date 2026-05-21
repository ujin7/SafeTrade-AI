import { useState } from 'react'
import { getTemplatesForSignals } from '../data/templates'

export default function TemplateSection({ triggeredItems }) {
  const [copiedIdx, setCopiedIdx] = useState(null)

  const signalIds = triggeredItems.map(item => item.id)
  const templates = getTemplatesForSignals(signalIds)
  const isCommon = triggeredItems.length === 0

  function handleCopy(text, idx) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 2500)
    }).catch(() => {
      setCopiedIdx(`fail-${idx}`)
      setTimeout(() => setCopiedIdx(null), 2500)
    })
  }

  return (
    <section className="template-section">
      <h3 className="section-title">
        추가 확인 가이드
      </h3>
      {isCommon && (
        <p className="template-subtitle">공통 문구를 보여드려요</p>
      )}

      <ul className="template-list">
        {templates.map((text, idx) => (
          <li key={idx} className="template-item">
            <p className="template-text">{text}</p>
            <button
              type="button"
              className={`copy-btn ${copiedIdx === idx ? 'copied' : ''}`}
              onClick={() => handleCopy(text, idx)}
            >
              {copiedIdx === idx ? '복사 완료' : '복사'}
            </button>
          </li>
        ))}
      </ul>

      <p className="template-notice">
        ※ 민감 정보(계좌번호·전화번호 등)는 마스킹 후 사용하세요.
      </p>
    </section>
  )
}
