import { CATEGORIES } from '../lib/tones.js'

export default function FilterBar({ active, onChange, onRefresh, refreshing }) {
  return (
    <div className="max-w-prose mx-auto px-6 mt-10 flex items-center justify-between gap-4">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const isActive = c.id === active
          return (
            <button
              key={c.id}
              onClick={() => onChange(c.id)}
              className={
                'font-body text-sm px-3.5 py-1.5 rounded-full border transition-colors ' +
                (isActive
                  ? 'bg-paper text-ink border-paper'
                  : 'border-line text-muted hover:text-paper hover:border-muted')
              }
            >
              {c.label}
            </button>
          )
        })}
      </div>

      <button
        onClick={onRefresh}
        disabled={refreshing}
        aria-label="Refresh feed"
        className="shrink-0 font-body text-sm text-muted hover:text-paper transition-colors disabled:opacity-40"
      >
        {refreshing ? 'Refreshing…' : 'Refresh'}
      </button>
    </div>
  )
}
