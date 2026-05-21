import { useState } from 'react'
import HomePage from './components/HomePage'
import CategorySelect from './components/CategorySelect'
import TextInput from './components/TextInput'
import ChecklistForm from './components/ChecklistForm'
import ResultView from './components/ResultView'
import CasesPage from './components/CasesPage'
import { useAnalyze } from './hooks/useAnalyze'
import './App.css'

const STEPS = ['카테고리', '내용 입력', '체크리스트', '결과']

function saveToHistory(category, result) {
  try {
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      category,
      grade: result.grade,
      score: result.total_score,
      signal_count: result.triggered_items.length,
    }
    const prev = JSON.parse(localStorage.getItem('safetrade_history') || '[]')
    localStorage.setItem(
      'safetrade_history',
      JSON.stringify([entry, ...prev].slice(0, 5))
    )
  } catch {}
}

function AppNav({ screen, onHome, onCases }) {
  return (
    <nav className="app-nav">
      <button className="nav-logo" type="button" onClick={onHome}>
        🛡️ SafeTrade
      </button>
      <div className="nav-links">
        <button
          type="button"
          className={`nav-link ${screen === 'home' || screen === 'analyze' ? 'active' : ''}`}
          onClick={onHome}
        >
          홈
        </button>
        <button
          type="button"
          className={`nav-link ${screen === 'cases' ? 'active' : ''}`}
          onClick={onCases}
        >
          피해 사례
        </button>
      </div>
    </nav>
  )
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [step, setStep] = useState(0)
  const [category, setCategory] = useState(null)
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState(null)
  const { analyze, loading, error } = useAnalyze()

  function handleStart() {
    setScreen('analyze')
    setStep(0)
  }

  function handleCategorySelect(cat) {
    setCategory(cat)
    setStep(1)
  }

  function handleTextNext(text) {
    setInputText(text)
    setStep(2)
  }

  async function handleSubmit({ category, checked_items }) {
    const data = await analyze({ category, checked_items, input_text: inputText })
    if (data) {
      saveToHistory(category, data)
      setResult(data)
      setStep(3)
    }
  }

  function handleReset() {
    setScreen('home')
    setStep(0)
    setCategory(null)
    setInputText('')
    setResult(null)
  }

  return (
    <div className="app">
      <AppNav
        screen={screen}
        onHome={handleReset}
        onCases={() => setScreen('cases')}
      />

      <main className="app-main">
        {screen === 'home' && (
          <HomePage onStart={handleStart} onCases={() => setScreen('cases')} />
        )}

        {screen === 'cases' && (
          <CasesPage onBack={() => setScreen('home')} />
        )}

        {screen === 'analyze' && (
          <>
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
              <TextInput
                category={category}
                onNext={handleTextNext}
                onBack={handleReset}
              />
            )}
            {step === 2 && (
              <ChecklistForm
                category={category}
                onSubmit={handleSubmit}
                onBack={() => setStep(1)}
                loading={loading}
                error={error}
              />
            )}
            {step === 3 && (
              <ResultView result={result} onReset={handleReset} />
            )}
          </>
        )}
      </main>
    </div>
  )
}