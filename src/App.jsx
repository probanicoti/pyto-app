import { useState } from 'react'
import Hero from './components/Hero.jsx'
import FilterBar from './components/FilterBar.jsx'
import Feed from './components/Feed.jsx'
import { useFeed } from './hooks/useFeed.js'

export default function App() {
  const [category, setCategory] = useState('all')
  const { articles, status, errorMessage, reload, remix } = useFeed(category)

  return (
    <div className="min-h-screen">
      <Hero headlines={articles.slice(0, 10).map((a) => a.title)} />

      <main>
        <FilterBar
          active={category}
          onChange={setCategory}
          onRefresh={reload}
          refreshing={status === 'loading'}
        />
        <Feed
          status={status}
          articles={articles}
          errorMessage={errorMessage}
          onRetry={reload}
          onRemix={remix}
        />
      </main>

      <footer className="max-w-prose mx-auto px-6 pb-16">
        <p className="font-body text-xs text-muted">
          Headlines via GNews, NewsData.io and NewsAPI.org. Captions generated live by an LLM and
          may be wrong, unfair, or funnier than intended.
        </p>
      </footer>
    </div>
  )
}
