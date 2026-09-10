import CaptionCard from './CaptionCard.jsx'
import { LoadingSkeleton, ErrorState, EmptyState } from './FeedStates.jsx'

export default function Feed({ status, articles, errorMessage, onRetry, onRemix }) {
  return (
    <div className="max-w-5xl mx-auto px-6 mt-6 pb-24">
      {status === 'loading' && <LoadingSkeleton />}

      {status === 'error' && <ErrorState message={errorMessage} onRetry={onRetry} />}

      {status === 'empty' && <EmptyState message={errorMessage} />}

      {status === 'ready' && (
        <div className="columns-1 lg:columns-2 gap-5 [column-fill:_balance]">
          {articles.map((article, i) => (
            <div key={article.id} className="break-inside-avoid mb-5">
              <CaptionCard
                article={article}
                onRemix={onRemix}
                style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
