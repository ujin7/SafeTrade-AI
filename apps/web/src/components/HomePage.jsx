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

export default function HomePage({ onStart }) {
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

      {history.length > 0 && (
        <section className="history-section">
          <h3 className="history-title">최근 분석 내역</h3>
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
                    <span
                      className="history-grade"
                      style={{ color: meta?.color }}
                    >
                      {meta?.label}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </div>
  )
}