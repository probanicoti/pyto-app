import { toneStyle } from '../lib/tones.js'
import { relativeTime } from '../lib/time.js'

export default function CaptionCard({ article, onRemix, style }) {
  const tone = toneStyle(article.tone)
  const when = relativeTime(article.publishedAt)

  return (
    <article
      className="rise-in rounded-2xl bg-card border border-line px-6 py-6 sm:px-8 sm:py-7"
      style={{ borderLeft: `3px solid ${tone.color}`, ...style }}
    >
      <div className="flex items-center justify-between gap-4 mb-4">
        <p className="font-body text-sm text-muted">
          {article.source}
          {when ? `, ${when}` : ''}
        </p>
        <span
          className="font-body text-xs px-2 py-0.5 rounded-full"
          style={{ color: tone.color, backgroundColor: `${tone.dim}55` }}
        >
          {tone.label}
        </span>
      </div>

      <p className="font-display text-2xl sm:text-[1.7rem] leading-snug font-medium text-paper">
        {article.remixing ? 'Cooking up another take…' : article.caption || 'The AI had no comment.'}
      </p>

      <p className="font-body text-sm text-muted mt-4 leading-relaxed">
        Reacting to:{' '}
        {article.url ? (
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="text-paper/80 hover:text-teal underline decoration-line underline-offset-4 transition-colors"
          >
            {article.title}
          </a>
        ) : (
          article.title
        )}
      </p>

      <button
        onClick={() => onRemix(article.id)}
        disabled={article.remixing}
        className="mt-5 font-body text-sm text-gold hover:text-paper transition-colors disabled:opacity-40"
      >
        {article.remixing ? 'Remixing…' : 'Try another angle'}
      </button>
    </article>
  )
}
