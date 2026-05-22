import { useState, useCallback } from 'react'
import { suggestFromText } from '../data/checklist'

export function useSuggest() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const suggest = useCallback(async ({ category, input_text }) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, input_text }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail ?? 'AI 추천에 실패했습니다.')
      }
      const data = await res.json()
      return data.suggested_ids ?? []
    } catch (e) {
      if (e instanceof TypeError) {
        return suggestFromText(category, input_text)
      }
      setError(e.message)
      return suggestFromText(category, input_text)
    } finally {
      setLoading(false)
    }
  }, [])

  return { suggest, loading, error }
}
