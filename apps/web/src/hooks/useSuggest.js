import { useState, useCallback } from 'react'

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
      const msg = e instanceof TypeError ? '인터넷 연결을 확인해주세요.' : e.message
      setError(msg)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  return { suggest, loading, error }
}
