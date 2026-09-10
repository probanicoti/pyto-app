import { useState } from 'react'
import Hero from './components/Hero.jsx'
import FilterBar from './components/FilterBar.jsx'
import Feed from './components/Feed.jsx'
import Grain from './components/Grain.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import { useFeed } from './hooks/useFeed.js'
import { useTheme } from './hooks/useTheme.js'

export default function App() {
  const [category, setCategory] = useState('all')
  const { articles, status, errorMessage, reload, remix } = useFeed(category)
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen relative">
      <Grain
        opacity={theme === 'light' ? 0.025 : 0.035}
        position="fixed"
        className="z-40"
        blend={theme === 'light' ? 'multiply' : 'overlay'}
      />
      <ThemeToggle theme={theme} onToggle={toggle} />

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

      <footer className="max-w-5xl mx-auto px-6 pb-16">
        <p className="font-body text-xs text-muted">
          Headlines via GNews, NewsData.io and NewsAPI.org. Captions generated live by an LLM and
          may be wrong, unfair, or funnier than intended.
        </p>
      </footer>
    </div>
  )
}
