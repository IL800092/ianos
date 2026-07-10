// All date math flows from the real system clock — nothing hardcodes "today".

export function today() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function parseDay(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function daysUntil(iso) {
  return Math.round((parseDay(iso) - today()) / 86400000)
}

export function isOverdue(iso) {
  return daysUntil(iso) < 0
}

// green > 30d, amber 8–30d, red <= 7d (and overdue)
export function urgency(iso) {
  const d = daysUntil(iso)
  if (d <= 7) return 'red'
  if (d <= 30) return 'amber'
  return 'green'
}

export function formatDay(iso) {
  return parseDay(iso).toLocaleDateString('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatCountdown(iso) {
  const d = daysUntil(iso)
  if (d === 0) return 'today'
  if (d === 1) return 'tomorrow'
  if (d < 0) return `${Math.abs(d)}d overdue`
  return `${d} days`
}

const PRIORITY_WEIGHT = { high: 0, med: 1, low: 2 }

// Sort todos by urgency: overdue first, then by due date, then priority.
// Undated items sort after dated ones, by priority.
export function byUrgency(a, b) {
  if (a.due && b.due) {
    const da = daysUntil(a.due)
    const db = daysUntil(b.due)
    if (da !== db) return da - db
  } else if (a.due || b.due) {
    return a.due ? -1 : 1
  }
  return (PRIORITY_WEIGHT[a.priority] ?? 3) - (PRIORITY_WEIGHT[b.priority] ?? 3)
}

export function currentSport(sports) {
  const month = new Date().getMonth() + 1
  return sports?.find((s) => s.months.includes(month)) || null
}
