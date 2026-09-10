import { useState } from 'react'
import { toneStyle } from '../lib/tones.js'
import { relativeTime } from '../lib/time.js'
import { exportCardAsPng, downloadBlob, slugify } from '../lib/exportCard.js'

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  )
}

function ShuffleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m18 4 3 3-3 3" />
      <path d="M3 7h5.5c1.2 0 2.3.6 3 1.6L15 16" />
      <path d="m18 20 3-3-3-3" />
      <path d="M3 17h5.5c1.2 0 2.3-.6 3-1.6L14 9" />
    </svg>
  )
}

export default function CaptionCard({ article, onRemix, style }) {
  const tone = toneStyle(article.tone)
  const when = relativeTime(article.publishedAt)
  const [downloading, setDownloading] = useState(false)

  async function handleDownload() {
    setDownloading(true)
    try {
      const blob = await exportCardAsPng(article)
      downloadBlob(blob, `${slugify(article.caption || article.title)}.png`)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <article
      className="rise-in relative rounded-2xl bg-card border border-line px-6 py-6 sm:px-8 sm:py-7 transition-shadow duration-300"
      style={{
        borderLeft: `3px solid ${tone.color}`,
        boxShadow: `0 24px 60px -32px ${tone.color}66`,
        ...style
      }}
    >
      <div className="flex items-center justify-between gap-4 mb-4">
        <p className="font-body text-sm text-muted">
          {article.source}
          {when ? `, ${when}` : ''}
        </p>
        <span
          className="font-body text-xs px-2.5 py-1 rounded-full inline-flex items-center gap-1.5"
          style={{ color: tone.color, backgroundColor: `${tone.dim}55` }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: tone.color }} />
          {tone.label}
        </span>
      </div>

      <p className="font-display text-2xl sm:text-[1.7rem] leading-snug font-medium text-paper tracking-tight">
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

      <div className="mt-5 flex items-center justify-between gap-4">
        <button
          onClick={() => onRemix(article.id)}
          disabled={article.remixing}
          className="font-body text-sm text-gold hover:text-paper transition-colors disabled:opacity-40 flex items-center gap-1.5"
        >
          <ShuffleIcon />
          {article.remixing ? 'Remixing…' : 'Try another angle'}
        </button>

        <button
          onClick={handleDownload}
          disabled={downloading || article.remixing}
          className="font-body text-sm text-muted hover:text-paper transition-colors disabled:opacity-40 flex items-center gap-1.5"
        >
          <DownloadIcon />
          {downloading ? 'Rendering…' : 'Download PNG'}
        </button>
      </div>
    </article>
  )
}
