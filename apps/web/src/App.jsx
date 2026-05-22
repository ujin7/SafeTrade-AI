import { useState, useEffect } from 'react'
import Rail from './components/Rail'
import Topbar from './components/Topbar'
import HomePage from './components/HomePage'
import CategorySelect from './components/CategorySelect'
import TextInput from './components/TextInput'
import ChecklistForm from './components/ChecklistForm'
import ResultView from './components/ResultView'
import CasesPage from './components/CasesPage'
import { useAnalyze } from './hooks/useAnalyze'
import { useSuggest } from './hooks/useSuggest'
import './App.css'

const WIZ_STEPS = ['거래 유형', '내용 입력', '체크리스트']

export default function App() {
  const [route, setRoute] = useState('home')
  const [step, setStep] = useState(0)
  const [category, setCategory] = useState(null)
  const [inputText, setInputText] = useState('')
  const [checked, setChecked] = useState(() => new Set())
  const [suggested, setSuggested] = useState([])
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('safetrade_history') || '[]') }
    catch { return [] }
  })

  const { analyze, loading: analyzeLoading, error: analyzeError } = useAnalyze()
  const { suggest, loading: suggestLoading } = useSuggest()

  useEffect(() => {
    try { localStorage.setItem('safetrade_history', JSON.stringify(history)) }
    catch {}
  }, [history])

  function handleReset() {
    setRoute('home')
    setStep(0)
    setCategory(null)
    setInputText('')
    setChecked(new Set())
    setSuggested([])
    setResult(null)
  }

  function handleAnalyzeStart() {
    setRoute('analyze')
    setStep(0)
  }

  function handleCategorySelect(cat) {
    setCategory(cat)
    setStep(1)
  }

  async function handleTextNext(text) {
    setInputText(text)
    const ids = await suggest({ category, input_text: text })
    setSuggested(ids)
    setChecked(new Set(ids))
    setStep(2)
  }

  async function handleSubmit() {
    const data = await analyze({
      category,
      checked_items: [...checked],
      input_text: inputText,
    })
    if (data) {
      const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        category,
        grade: data.grade,
        score: data.total_score,
        signal_count: data.triggered_items.length,
      }
      setHistory(prev => [entry, ...prev].slice(0, 5))
      setResult(data)
      setRoute('result')
    }
  }

  return (
    <div className="app">
      <Rail
        route={route}
        onHome={handleReset}
        onStart={handleAnalyzeStart}
        onCases={() => setRoute('cases')}
      />

      <div className="main-wrap">
        <Topbar route={route} step={step} />

        <main className="page-content">
          {route === 'home' && (
            <HomePage
              onStart={handleAnalyzeStart}
              onCases={() => setRoute('cases')}
              history={history}
            />
          )}

          {route === 'cases' && <CasesPage />}

          {route === 'analyze' && (
            <div className="wiz">
              <aside className="wiz-side">
                <ol className="wiz-step-list">
                  {WIZ_STEPS.map((label, i) => (
                    <li
                      key={i}
                      className={`wiz-step ${i === step ? 'active' : i < step ? 'done' : ''}`}
                    >
                      <span className="wiz-step-num">
                        {i < step ? '✓' : i + 1}
                      </span>
                      <span className="wiz-step-label">{label}</span>
                    </li>
                  ))}
                </ol>
              </aside>

              <div className="wiz-main">
                {step === 0 && (
                  <CategorySelect onSelect={handleCategorySelect} />
                )}
                {step === 1 && (
                  <TextInput
                    category={category}
                    onNext={handleTextNext}
                    onBack={() => setStep(0)}
                    loading={suggestLoading}
                  />
                )}
                {step === 2 && (
                  <ChecklistForm
                    category={category}
                    checked={checked}
                    setChecked={setChecked}
                    onSubmit={handleSubmit}
                    onBack={() => setStep(1)}
                    loading={analyzeLoading}
                    error={analyzeError}
                    suggestedItems={suggested}
                  />
                )}
              </div>
            </div>
          )}

          {route === 'result' && result && (
            <ResultView result={result} onReset={handleReset} />
          )}
        </main>
      </div>
    </div>
  )
}
