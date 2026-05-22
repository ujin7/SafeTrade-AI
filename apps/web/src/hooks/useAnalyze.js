import { useState, useCallback } from 'react'
import { scoreCheck } from '../data/checklist'

export function useAnalyze() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const analyze = useCallback(async ({ category, checked_items, input_text = '' }) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, checked_items, input_text }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail ?? '분석 요청에 실패했습니다.')
      }
      return await res.json()
    } catch (e) {
      if (e instanceof TypeError) {
        return scoreCheck(category, checked_items)
      }
      setError(e.message)
      return scoreCheck(category, checked_items)
    } finally {
      setLoading(false)
    }
  }, [])

  return { analyze, loading, error }
}
