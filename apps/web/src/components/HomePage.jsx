const CATEGORY_LABEL = {
  used_trade: '중고거래',
  real_estate: '부동산',
}

const GRADE_META = {
  LOW:    { label: '낮음', color: 'var(--safe)'   },
  MEDIUM: { label: '보통', color: 'var(--warn)'   },
  HIGH:   { label: '높음', color: 'var(--danger)' },
}

function formatDate(iso) {
  const d = new Date(iso)
  return `${d.getMonth() + 1}.${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const HOW_STEPS = [
  {
    icon: '📋',
    title: '거래 유형 선택',
    desc: '중고거래 또는 부동산 중 해당하는 거래 유형을 선택하세요.',
  },
  {
    icon: '✍️',
    title: '거래 내용 입력',
    desc: '의심스러운 채팅·문자 내용을 붙여넣으면 AI가 위험 신호를 자동 감지합니다.',
  },
  {
    icon: '📊',
    title: '위험도 리포트',
    desc: '선택한 신호를 분석해 위험도 점수와 대처 방법을 알려드립니다.',
  },
]

export default function HomePage({ onStart, onCases, history }) {
  return (
    <div className="home-page rise">
      <div className="hero-card">
        <div className="hero-icon">🛡️</div>
        <h2 className="hero-title">
          거래 전, 위험 신호를<br />미리 확인하세요
        </h2>
        <p className="hero-subtitle">
          체크리스트 + AI 기반 분석으로<br />
          사기 위험을 사전에 예방하세요
        </p>
        <div className="hero-actions">
          <button className="start-btn" type="button" onClick={onStart}>
            분석 시작하기
          </button>
          <button className="cases-link-btn" type="button" onClick={onCases}>
            실제 피해 사례 보기 →
          </button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-chip">
          <span className="stat-num">10만건+</span>
          <span className="stat-desc">연간 중고거래 사기</span>
        </div>
        <div className="stat-chip">
          <span className="stat-num">3,340억</span>
          <span className="stat-desc">중고거래 피해액</span>
        </div>
        <div className="stat-chip">
          <span className="stat-num">20개</span>
          <span className="stat-desc">분석 위험 신호</span>
        </div>
      </div>

      <section className="how-section">
        <h3 className="how-title">이렇게 사용하세요</h3>
        <ol className="how-list">
          {HOW_STEPS.map((step, i) => (
            <li key={i} className="how-item">
              <div className="how-icon">{step.icon}</div>
              <div>
                <p className="how-step-title">{step.title}</p>
                <p className="how-step-desc">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="history-section">
        <h3 className="history-title">최근 분석 내역</h3>
        {history.length > 0 ? (
          <ul>
            {history.map(item => {
              const meta = GRADE_META[item.grade]
              return (
                <li key={item.id} className="history-item">
                  <div className="history-left">
                    <span className="history-category">
                      {CATEGORY_LABEL[item.category] ?? item.category}
                    </span>
                    <span className="history-date">{formatDate(item.date)}</span>
                  </div>
                  <div className="history-right">
                    <span className="history-score">{item.score}점</span>
                    <span className="history-grade" style={{ color: meta?.color }}>
                      {meta?.label}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="history-empty">
            <p className="history-empty-text">아직 분석 내역이 없습니다.</p>
            <p className="history-empty-sub">분석을 시작하면 여기에 기록됩니다.</p>
            <button className="history-empty-btn" type="button" onClick={onStart}>
              첫 분석 시작하기
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
