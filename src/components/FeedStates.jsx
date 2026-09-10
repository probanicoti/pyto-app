export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-2xl bg-card border border-line px-6 py-6 sm:px-8 sm:py-7 animate-pulse"
        >
          <div className="h-3 w-32 bg-line rounded mb-6" />
          <div className="h-6 w-full bg-line rounded mb-2" />
          <div className="h-6 w-3/4 bg-line rounded mb-6" />
          <div className="h-3 w-2/3 bg-line rounded" />
        </div>
      ))}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-coral/40 bg-coral/10 px-8 py-10 text-center">
      <p className="font-display text-xl text-paper mb-2">The feed didn't load.</p>
      <p className="font-body text-sm text-muted mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="font-body text-sm px-4 py-2 rounded-full border border-line text-paper hover:border-paper transition-colors"
      >
        Try again
      </button>
    </div>
  )
}

export function EmptyState({ message }) {
  return (
    <div className="rounded-2xl border border-line bg-card px-8 py-10 text-center">
      <p className="font-display text-xl text-paper mb-2">Nothing to react to yet.</p>
      <p className="font-body text-sm text-muted max-w-[42ch] mx-auto">
        {message || 'No headlines came back for this category. Try a different one, or refresh in a bit.'}
      </p>
    </div>
  )
}
