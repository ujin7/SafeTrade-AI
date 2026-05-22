const ROUTE_LABEL = {
  home: '홈',
  analyze: '위험도 분석',
  result: '분석 결과',
  cases: '피해 사례',
}

const STEP_LABELS = ['거래 유형', '내용 입력', '체크리스트']

export default function Topbar({ route, step }) {
  const parts = route === 'analyze'
    ? [ROUTE_LABEL.analyze, STEP_LABELS[step]]
    : [ROUTE_LABEL[route] ?? route]

  return (
    <header className="topbar">
      <div className="topbar-breadcrumb">
        {parts.map((part, i) => (
          <span key={i} className={`breadcrumb-part ${i === parts.length - 1 ? 'current' : ''}`}>
            {i > 0 && <span className="breadcrumb-sep">›</span>}
            {part}
          </span>
        ))}
      </div>

      {route === 'analyze' && (
        <div className="topbar-steps">
          {STEP_LABELS.map((_, i) => (
            <div
              key={i}
              className={`step-dot ${i === step ? 'active' : i < step ? 'done' : ''}`}
            />
          ))}
        </div>
      )}
    </header>
  )
}
