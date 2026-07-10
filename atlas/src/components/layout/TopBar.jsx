import { useEffect, useState } from 'react'

function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export function TopBar({ statusLine }) {
  const now = useClock()
  const time = now.toLocaleTimeString('en-CA', { hour12: false })
  const date = now.toLocaleDateString('en-CA', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <header className="sticky top-0 z-20 border-b hairline bg-bg/80 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 h-14">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-lg font-bold tracking-[0.35em] text-ink">
            ATLAS
          </span>
          <span className="hidden sm:inline text-[11px] font-mono text-accent/80 tracking-widest">
            // COMMAND CENTER
          </span>
        </div>

        <div className="hidden md:block flex-1 text-center text-xs font-mono text-dim truncate">
          {statusLine}
        </div>

        <div className="flex items-center gap-3 font-mono text-sm">
          <span className="text-accent tabular-nums">{time}</span>
          <span className="text-dim hidden sm:inline">{date}</span>
          <span
            className="h-2 w-2 rounded-full bg-ok shadow-[0_0_8px_rgb(var(--c-ok))]"
            title="Systems nominal"
          />
        </div>
      </div>
    </header>
  )
}
