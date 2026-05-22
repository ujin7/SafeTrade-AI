import { useState, useRef } from 'react'
import { CATEGORY_META } from '../data/checklist'

const MIN_LENGTH = 50

const SENSITIVE_PATTERNS = [
  { regex: /01[016789]-?\d{3,4}-?\d{4}/, label: '휴대폰 번호' },
  { regex: /\d{2,4}-\d{3,4}-\d{4}/, label: '전화번호' },
  { regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, label: '이메일' },
  { regex: /\d{6}-[1-4]\d{6}/, label: '주민등록번호' },
  { regex: /\d{3}-\d{2,4}-\d{4,6}/, label: '계좌번호' },
]

function detectSensitive(text) {
  return SENSITIVE_PATTERNS.filter(p => p.regex.test(text)).map(p => p.label)
}

export default function TextInput({ category, onNext, onBack, loading = false }) {
  const [text, setText] = useState('')
  const textareaRef = useRef(null)

  const length = text.length
  const isReady = length >= MIN_LENGTH
  const sensitiveFound = detectSensitive(text)

  function handlePaste() {
    navigator.clipboard.readText().then(t => {
      setText(prev => prev + t)
      textareaRef.current?.focus()
    }).catch(() => {
      textareaRef.current?.focus()
    })
  }

  return (
    <div className="step-panel">
      <button type="button" className="back-btn" onClick={onBack}>
        ← {CATEGORY_META[category].label}
      </button>
      <p className="step-desc">의심스러운 거래 내용을 붙여넣어 주세요</p>
      <p className="input-guide">채팅 내용, 매물 설명, 계약 안내 문자 등을 그대로 붙여넣으면 됩니다.</p>

      <div className="ai-notice">
        <span className="ai-notice-badge">AI 분석</span>
        <span className="ai-notice-text">
          입력하신 내용은 향후 LLM 기반 자동 위험 감지에 활용될 예정입니다
        </span>
      </div>

      <div className="textarea-wrap">
        <textarea
          ref={textareaRef}
          className="text-input"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="예) 안전결제 말고 제 계좌로 먼저 입금해 주시면 바로 발송해 드릴게요. 오늘만 이 가격이에요..."
          rows={7}
          autoFocus
        />
        <div className="textarea-actions">
          <button type="button" className="action-btn" onClick={handlePaste}>
            붙여넣기
          </button>
          {text && (
            <button type="button" className="action-btn" onClick={() => setText('')}>
              전체 지우기
            </button>
          )}
        </div>
      </div>

      <div className="char-status">
        <span className={`char-count ${isReady ? 'ready' : length > 0 ? 'warning' : ''}`}>
          {length}자
        </span>
        {!isReady && (
          <span className="char-hint">최소 {MIN_LENGTH}자 이상 입력해주세요 ({MIN_LENGTH - length}자 남음)</span>
        )}
      </div>

      {sensitiveFound.length > 0 && (
        <div className="sensitive-warning">
          <span className="sensitive-icon">⚠</span>
          <span>
            <strong>{sensitiveFound.join(', ')}</strong>가 포함된 것 같아요.
            개인정보는 마스킹(예: 010-****-1234) 후 입력을 권장합니다.
          </span>
        </div>
      )}

      <button
        type="button"
        className="submit-btn"
        disabled={!isReady || loading}
        onClick={() => onNext(text)}
      >
        {loading ? 'AI 분석 중...' : '다음 — 체크리스트 선택'}
      </button>
    </div>
  )
}