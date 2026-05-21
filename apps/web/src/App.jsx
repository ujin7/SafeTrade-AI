import { useState } from 'react'
import CategorySelect from './components/CategorySelect'
import ChecklistForm from './components/ChecklistForm'
import ResultView from './components/ResultView'
import { useAnalyze } from './hooks/useAnalyze'
import './App.css'

const STEPS = ['카테고리', '체크리스트', '결과']

export default function App() {
  const [step, setStep] = useState(0)
  const [category, setCategory] = useState(null)
  const [result, setResult] = useState(null)
  const { analyze, loading, error } = useAnalyze()

  function handleCategorySelect(cat) {
    setCategory(cat)
    setStep(1)
  }

  async function handleSubmit({ category, checked_items }) {
    const data = await analyze({ category, checked_items })
    if (data) {
      setResult(data)
      setStep(2)
    }
  }

  function handleReset() {
    setStep(0)
    setCategory(null)
    setResult(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">SafeTrade</h1>
        <p className="app-subtitle">안전거래 위험도 분석</p>
      </header>

      <div className="step-indicator">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`step-dot ${i === step ? 'active' : i < step ? 'done' : ''}`}
          />
        ))}
      </div>

      {step === 0 && (
        <CategorySelect onSelect={handleCategorySelect} />
      )}
      {step === 1 && (
        <ChecklistForm
          category={category}
          onSubmit={handleSubmit}
          onBack={handleReset}
          loading={loading}
          error={error}
        />
      )}
      {step === 2 && (
        <ResultView result={result} onReset={handleReset} />
      )}
    </div>
  )
}
