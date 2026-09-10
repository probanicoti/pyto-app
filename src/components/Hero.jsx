export default function Hero({ headlines }) {
  const loopable = headlines.length ? [...headlines, ...headlines] : []

  return (
    <header className="border-b border-line">
      <div className="max-w-prose mx-auto px-6 pt-16 pb-10">
        <p className="font-body text-sm text-teal mb-4">The news, filtered through a machine with opinions</p>
        <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] font-semibold text-paper">
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
        <div className="overflow-hidden no-scrollbar border-t border-line bg-card/60 py-3">
          <div className="flex gap-10 whitespace-nowrap ticker-track w-max">
            {loopable.map((title, i) => (
              <span key={i} className="font-body text-sm text-muted">
                {title}
              </span>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
