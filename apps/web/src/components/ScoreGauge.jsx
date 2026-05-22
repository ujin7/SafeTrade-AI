import { useEffect, useState } from 'react'

const R = 56
const CIRC = 2 * Math.PI * R
const DASH_TOTAL = CIRC * 0.75

const GRADE_COLOR = {
  LOW:    'var(--safe)',
  MEDIUM: 'var(--warn)',
  HIGH:   'var(--danger)',
}

export default function ScoreGauge({ score, grade }) {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    let start = null
    const duration = 800
    function tick(ts) {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplayed(Math.round(score * eased))
      if (p < 1) requestAnimationFrame(tick)
    }
    const id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [score])

  const color = GRADE_COLOR[grade] ?? 'var(--text-3)'
  const filled = DASH_TOTAL * (displayed / 100)

  return (
    <div className="gauge-wrap">
      <svg viewBox="0 0 140 140" width="140" height="140" aria-hidden="true">
        <g transform="rotate(135, 70, 70)">
          <circle
            cx="70" cy="70" r={R}
            fill="none"
            stroke="var(--border-2)"
            strokeWidth="10"
            strokeDasharray={`${DASH_TOTAL} ${CIRC - DASH_TOTAL}`}
            strokeLinecap="round"
          />
          <circle
            cx="70" cy="70" r={R}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={`${filled} ${CIRC - filled}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.05s linear' }}
          />
        </g>
        <text
          x="70" y="63"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="30"
          fontWeight="800"
          fontFamily="var(--font-mono)"
          fill={color}
        >
          {displayed}
        </text>
        <text
          x="70" y="86"
          textAnchor="middle"
          fontSize="12"
          fill="var(--text-3)"
          fontFamily="var(--font-mono)"
        >
          / 100
        </text>
      </svg>
    </div>
  )
}
