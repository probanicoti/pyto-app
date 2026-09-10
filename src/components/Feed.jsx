import CaptionCard from './CaptionCard.jsx'
import { LoadingSkeleton, ErrorState, EmptyState } from './FeedStates.jsx'

export default function Feed({ status, articles, errorMessage, onRetry, onRemix }) {
  return (
    <div className="max-w-prose mx-auto px-6 mt-6 pb-24">
      {status === 'loading' && <LoadingSkeleton />}

      {status === 'error' && <ErrorState message={errorMessage} onRetry={onRetry} />}

      {status === 'empty' && <EmptyState message={errorMessage} />}

      {status === 'ready' && (
        <div className="space-y-4">
          {articles.map((article, i) => (
            <CaptionCard
              key={article.id}
              article={article}
              onRemix={onRemix}
              style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
