import { CATEGORIES } from '../lib/tones.js'

export default function FilterBar({ active, onChange, onRefresh, refreshing }) {
  return (
    <div className="max-w-5xl mx-auto px-6 mt-10 flex items-center justify-between gap-4">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const isActive = c.id === active
          return (
            <button
              key={c.id}
              onClick={() => onChange(c.id)}
              className={
                'font-body text-sm px-3.5 py-1.5 rounded-full border transition-all duration-200 active:scale-95 ' +
                (isActive
                  ? 'bg-paper text-ink border-paper shadow-[0_0_0_1px_rgba(243,239,230,0.15)]'
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
        className="shrink-0 font-body text-sm text-muted hover:text-paper transition-colors disabled:opacity-40 flex items-center gap-1.5"
      >
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={refreshing ? 'animate-spin' : ''}
        >
          <path d="M21 12a9 9 0 1 1-2.64-6.36" />
          <path d="M21 3v6h-6" />
        </svg>
        {refreshing ? 'Refreshing…' : 'Refresh'}
      </button>
    </div>
  )
}
