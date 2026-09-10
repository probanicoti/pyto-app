import { useCallback, useEffect, useState } from 'react'

export function useFeed(category) {
  const [articles, setArticles] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error | empty
  const [errorMessage, setErrorMessage] = useState(null)
  const [sourcesUsed, setSourcesUsed] = useState([])

  const load = useCallback(async () => {
    setStatus('loading')
    setErrorMessage(null)
    try {
      const res = await fetch(`/api/feed?category=${category}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'The feed fell over.')

      setSourcesUsed(data.sourcesUsed || [])
      setArticles(data.articles || [])
      setStatus(data.articles?.length ? 'ready' : 'empty')
      if (data.warning) setErrorMessage(data.warning)
    } catch (err) {
      setStatus('error')
      setErrorMessage(err.message)
    }
  }, [category])

  useEffect(() => {
    load()
  }, [load])

  const remix = useCallback(async (id) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, remixing: true } : a))
    )
    const article = articles.find((a) => a.id === id)
    if (!article) return

    try {
      const res = await fetch('/api/remix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: article.title, description: article.description })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setArticles((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, caption: data.caption, tone: data.tone, remixing: false } : a
        )
      )
    } catch {
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, remixing: false } : a))
      )
    }
  }, [articles])

  return { articles, status, errorMessage, sourcesUsed, reload: load, remix }
}
