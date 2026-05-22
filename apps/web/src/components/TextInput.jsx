import { useState, useRef } from 'react'
import { CATEGORY_META, SAMPLES } from '../data/checklist'

const MIN_LENGTH = 20

const SENSITIVE_PATTERNS = [
  { regex: /01[016789]-?\d{3,4}-?\d{4}/, label: '휴대폰 번호' },
  { regex: /\d{2,4}-\d{3,4}-\d{4}/, label: '전화번호' },
  { regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, label: '이메일' },
  { regex: /\d{6}-[1-4]\d{6}/, label: '주민등록번호' },
]

export default function TextInput({ category, onNext, onBack, loading = false }) {
  const [text, setText] = useState('')
  const textareaRef = useRef(null)

  const length = text.trim().length
  const isReady = length >= MIN_LENGTH
  const sensitiveFound = SENSITIVE_PATTERNS.filter(p => p.regex.test(text)).map(p => p.label)
  const samples = SAMPLES[category] ?? []

  function handlePaste() {
    navigator.clipboard.readText().then(t => {
      setText(prev => (prev ? prev + '\n' + t : t))
      textareaRef.current?.focus()
    }).catch(() => textareaRef.current?.focus())
  }

  return (
    <div className="wiz-card rise">
      <button type="button" className="back-btn" onClick={onBack}>
        ← {CATEGORY_META[category]?.label}
      </button>

      <h2 className="step-title">의심스러운 거래 내용을 입력하세요</h2>
      <p className="step-sub">채팅 내용, 매물 설명, 안내 문자 등을 붙여넣어 주세요.</p>

      <div className="ai-notice">
        <span className="ai-notice-badge">AI 분석</span>
        <span className="ai-notice-text">
          입력한 내용에서 위험 신호를 자동으로 감지합니다
        </span>
      </div>

      {samples.length > 0 && (
        <>
          <p className="input-guide">예시 문구 클릭 시 자동 입력됩니다:</p>
          <div className="sample-chips">
            {samples.map((s, i) => (
              <button
                key={i}
                type="button"
                className="sample-chip"
                onClick={() => { setText(s); textareaRef.current?.focus() }}
              >
                {s.length > 28 ? s.slice(0, 28) + '…' : s}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="textarea-wrap">
        <textarea
          ref={textareaRef}
          className="text-input"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="예) 안전결제 말고 제 계좌로 먼저 입금해 주시면 바로 발송해 드릴게요. 오늘만 이 가격이에요..."
          rows={7}
          autoFocus
          disabled={loading}
        />
        <div className="textarea-actions">
          <button type="button" className="action-btn" onClick={handlePaste} disabled={loading}>
            붙여넣기
          </button>
          {text && (
            <button type="button" className="action-btn" onClick={() => setText('')} disabled={loading}>
              전체 지우기
            </button>
          )}
        </div>
      </div>

      <div className="char-status">
        <span className={`char-count ${isReady ? 'ready' : length > 0 ? 'warning' : ''}`}>
          {length}자
        </span>
        {!isReady && length > 0 && (
          <span className="char-hint">{MIN_LENGTH - length}자 더 입력하면 분석 가능합니다</span>
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

      <div className="form-footer">
        <span />
        <button
          type="button"
          className="submit-btn"
          disabled={!isReady || loading}
          onClick={() => onNext(text)}
        >
          {loading ? 'AI 분석 중…' : '다음 — 체크리스트 선택'}
        </button>
      </div>
    </div>
  )
}
