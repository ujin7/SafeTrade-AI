import { useEffect, useState } from 'react'

const CATEGORY_LABEL = {
  used_trade: '중고거래',
  real_estate: '부동산',
}

const GRADE_META = {
  LOW:    { label: '낮음', color: '#22c55e' },
  MEDIUM: { label: '보통', color: '#f59e0b' },
  HIGH:   { label: '높음', color: '#ef4444' },
}

function formatDate(iso) {
  const d = new Date(iso)
  const mo = (d.getMonth() + 1).toString()
  const day = d.getDate().toString()
  const hh = d.getHours().toString().padStart(2, '0')
  const mm = d.getMinutes().toString().padStart(2, '0')
  return `${mo}.${day} ${hh}:${mm}`
}

const HOW_STEPS = [
  {
    icon: '📋',
    title: '체크리스트 선택',
    desc: '중고거래 또는 부동산 중 해당하는 거래 유형을 선택하세요.',
  },
  {
    icon: '🔍',
    title: '위험 신호 확인',
    desc: '거래 상대에게서 느낀 의심 신호를 체크리스트에서 선택하세요.',
  },
  {
    icon: '📊',
    title: '위험도 리포트',
    desc: '선택한 신호를 분석해 위험도 점수와 대처 방법을 알려드립니다.',
  },
]

export default function HomePage({ onStart, onCases }) {
  const [history, setHistory] = useState([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('safetrade_history')
      if (stored) setHistory(JSON.parse(stored))
    } catch {}
  }, [])

  return (
    <div className="home-page">
      <div className="hero">
        <div className="hero-icon">🛡️</div>
        <h2 className="hero-title">
          거래 전, 위험 신호를<br />미리 확인하세요
        </h2>
        <p className="hero-subtitle">
          체크리스트 기반 분석으로<br />사기 위험을 사전에 예방하세요
        </p>
        <button className="start-btn" type="button" onClick={onStart}>
          분석 시작하기
        </button>
        <button className="cases-link-btn" type="button" onClick={onCases}>
          실제 피해 사례 보기 →
        </button>
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
              <div className="how-body">
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
          <ul className="history-list">
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