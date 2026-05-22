import Icon from './Icon'

export default function Rail({ route, onHome, onStart, onCases }) {
  return (
    <aside className="rail">
      <div className="rail-logo" onClick={onHome} role="button" tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && onHome()}>
        <span className="rail-logo-icon">🛡️</span>
        <span className="rail-logo-text">SafeTrade AI</span>
      </div>

      <nav className="rail-nav">
        <button
          type="button"
          className={`rail-item ${route === 'home' ? 'active' : ''}`}
          onClick={onHome}
        >
          <Icon name="home" />
          홈
        </button>
        <button
          type="button"
          className={`rail-item ${route === 'analyze' || route === 'result' ? 'active' : ''}`}
          onClick={onStart}
        >
          <Icon name="analyze" />
          위험도 분석
        </button>
        <button
          type="button"
          className={`rail-item ${route === 'cases' ? 'active' : ''}`}
          onClick={onCases}
        >
          <Icon name="cases" />
          피해 사례
        </button>
      </nav>

      <div className="rail-footer">
        AI 분석 결과는 참고용입니다.<br />
        법적 판단은 전문가에게 문의하세요.
      </div>
    </aside>
  )
}
