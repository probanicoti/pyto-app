import { useEffect, useState } from 'react'

const MOODS = ['unbothered', 'quietly feral', 'caffeinated', 'suspiciously calm', 'one coffee too deep']

export default function Hero({ headlines }) {
  const [moodIndex, setMoodIndex] = useState(0)
  const loopable = headlines.length ? [...headlines, ...headlines] : []

  useEffect(() => {
    const id = setInterval(() => setMoodIndex((i) => (i + 1) % MOODS.length), 3200)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden="true"
        className="aurora-a pointer-events-none absolute -top-40 -right-32 w-[36rem] h-[36rem] rounded-full opacity-30 blur-[100px]"
        style={{ background: 'radial-gradient(circle, #E8A33D, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="aurora-b pointer-events-none absolute -top-24 -left-40 w-[30rem] h-[30rem] rounded-full opacity-20 blur-[100px]"
        style={{ background: 'radial-gradient(circle, #4FA69C, transparent 70%)' }}
      />

      <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-10">
        <p className="font-body text-sm text-teal mb-4">
          Today's mood:{' '}
          <span key={moodIndex} className="rise-in inline-block text-paper/80">
            {MOODS[moodIndex]}
          </span>
        </p>
        <h1 className="font-display text-5xl sm:text-7xl leading-[1.03] font-semibold text-paper max-w-2xl">
          Doomscroll,
          <br />
          but funnier.
        </h1>
        <p className="font-body text-base text-muted mt-5 max-w-[46ch]">
          Real headlines from three different wire services, each one handed to an AI that was
          told to be honest and a little unhinged about it.
        </p>
      </div>

      {loopable.length > 0 && (
        <div className="relative overflow-hidden no-scrollbar ticker-mask border-t border-line bg-card/60 py-3">
          <div className="flex gap-3 whitespace-nowrap ticker-track w-max">
            {loopable.map((title, i) => (
              <span key={i} className="flex items-center gap-3">
                <span className="font-body text-sm text-muted">{title}</span>
                <span className="w-1 h-1 rounded-full bg-line" />
              </span>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
