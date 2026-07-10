import { daysUntil, formatDay, parseDay, today, urgency } from '../../lib/dates'

const DOT = {
  green: 'bg-ok',
  amber: 'bg-warn',
  red: 'bg-danger',
  past: 'bg-dim/50',
}

// All deadlines on one horizontal axis, positioned proportionally by date,
// with live days-remaining on each marker. Items sharing a date collapse
// into one marker so labels never stack on top of each other.
export function Timeline({ items }) {
  const dated = items
    .filter((i) => i.date)
    .sort((a, b) => a.date.localeCompare(b.date))
  if (dated.length === 0) return null

  const groups = []
  for (const item of dated) {
    const g = groups.find((x) => x.date === item.date)
    if (g) g.labels.push(item.label)
    else groups.push({ id: item.id, date: item.date, labels: [item.label] })
  }

  const start = Math.min(today().getTime(), parseDay(groups[0].date).getTime())
  const end = parseDay(groups[groups.length - 1].date).getTime()
  const span = Math.max(end - start, 1)
  const pos = (iso) => ((parseDay(iso).getTime() - start) / span) * 100
  const todayPos = ((today().getTime() - start) / span) * 100

  return (
    <div className="overflow-x-auto pb-2">
      <div className="relative min-w-[760px] h-48 mt-2 pr-16">
        {/* axis */}
        <div className="absolute left-0 right-0 top-1/2 h-px bg-edge" />

        {/* today marker */}
        {todayPos >= 0 && todayPos <= 100 && (
          <div
            className="absolute top-3 bottom-3 w-px bg-accent/70"
            style={{ left: `${todayPos}%` }}
          >
            <span className="absolute -top-1 left-1.5 text-[10px] font-mono text-accent">
              TODAY
            </span>
          </div>
        )}

        {groups.map((g, i) => {
          const d = daysUntil(g.date)
          const tone = d < 0 ? 'past' : urgency(g.date)
          const above = i % 2 === 0
          const shown = g.labels.slice(0, 2)
          const more = g.labels.length - shown.length
          const p = Math.min(Math.max(pos(g.date), 2), 98)
          // Near the edges, anchor the label inward so it never clips.
          const anchor =
            p > 88
              ? 'right-0 text-right'
              : p < 8
                ? 'left-0 text-left'
                : 'left-1/2 -translate-x-1/2 text-center'
          return (
            <div
              key={g.id}
              className="absolute top-1/2 -translate-x-1/2"
              style={{ left: `${p}%` }}
            >
              <span
                className={`block h-3 w-3 -translate-y-1/2 rounded-full ring-2 ring-bg ${DOT[tone]}`}
              />
              <div
                className={`absolute w-36 ${anchor} ${above ? 'bottom-4' : 'top-3'}`}
              >
                {shown.map((label) => (
                  <p
                    key={label}
                    className="text-[11px] leading-tight text-ink truncate"
                    title={g.labels.join(' · ')}
                  >
                    {label}
                  </p>
                ))}
                {more > 0 && (
                  <p className="text-[10px] font-mono text-dim" title={g.labels.join(' · ')}>
                    +{more} more
                  </p>
                )}
                <p className="text-[10px] font-mono text-dim">{formatDay(g.date)}</p>
                <p
                  className={`text-[10px] font-mono ${
                    d < 0
                      ? 'text-dim/60'
                      : d <= 7
                        ? 'text-danger'
                        : d <= 30
                          ? 'text-warn'
                          : 'text-ok'
                  }`}
                >
                  {d < 0 ? 'passed' : `T-${d}d`}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
