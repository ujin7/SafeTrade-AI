import { useEffect, useState } from 'react'

const R = 80
const CIRC = Math.PI * R  // 251.33

const GRADE_COLOR = {
  LOW:    '#22c55e',
  MEDIUM: '#f59e0b',
  HIGH:   '#ef4444',
}

export default function ScoreGauge({ score, grade }) {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    let start = null
    const duration = 900

    function tick(ts) {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(score * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }

    const id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [score])

  const color = GRADE_COLOR[grade]
  const filled = (displayed / 100) * CIRC

  return (
    <div className="gauge-wrap">
      <svg viewBox="0 0 200 112" className="gauge-svg" aria-hidden="true">
        {/* 배경 트랙 */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="var(--border)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* 점수 아크 */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${CIRC}`}
        />
        {/* 점수 숫자 */}
        <text
          x="100"
          y="80"
          textAnchor="middle"
          className="gauge-num"
          fill="var(--text-h)"
        >
          {displayed}
        </text>
        {/* / 100 */}
        <text
          x="100"
          y="100"
          textAnchor="middle"
          className="gauge-sub"
          fill="var(--text)"
        >
          / 100
        </text>
      </svg>
    </div>
  )
}