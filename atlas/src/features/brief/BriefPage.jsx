import { useMemo } from 'react'
import { AlertTriangle, Crosshair, CalendarClock, ListTodo } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { CountUp } from '../../components/ui/CountUp'
import { EmptyState } from '../../components/ui/EmptyState'
import { useCollection } from '../../lib/useCollection'
import {
  byUrgency,
  daysUntil,
  formatCountdown,
  formatDay,
  urgency,
} from '../../lib/dates'

const URGENCY_TONE = { green: 'green', amber: 'amber', red: 'red' }
const URGENCY_TEXT = {
  green: 'text-ok',
  amber: 'text-warn',
  red: 'text-danger',
}

function CountdownCard({ label, date, sub }) {
  const days = daysUntil(date)
  const tone = urgency(date)
  return (
    <div className="glass p-4 flex flex-col gap-1">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-ink leading-snug">{label}</p>
        <Badge tone={URGENCY_TONE[tone]}>{days < 0 ? 'past' : 'T-' + days}</Badge>
      </div>
      <p className={`font-display text-4xl font-bold tabular-nums ${URGENCY_TEXT[tone]}`}>
        <CountUp value={Math.max(days, 0)} />
        <span className="text-base font-medium text-dim ml-1.5">days</span>
      </p>
      <p className="text-xs font-mono text-dim">
        {formatDay(date)}
        {sub ? ` · ${sub}` : ''}
      </p>
    </div>
  )
}

export function BriefPage() {
  const { data: university } = useCollection('university')
  const { data: todos, save: saveTodos } = useCollection('todos')
  const { data: sat } = useCollection('sat')

  const deadlines = useMemo(() => {
    if (!university) return []
    const items = [
      ...university.schools.map((s) => ({
        label: s.school,
        date: s.deadline,
        sub: s.platform,
      })),
      ...university.milestones.map((m) => ({ label: m.label, date: m.date })),
    ]
    return items
      .filter((d) => d.date && daysUntil(d.date) >= 0)
      .sort((a, b) => daysUntil(a.date) - daysUntil(b.date))
      .slice(0, 4)
  }, [university])

  const openTodos = useMemo(
    () => (todos ? todos.filter((t) => !t.done).sort(byUrgency) : []),
    [todos]
  )
  const overdue = openTodos.filter((t) => t.due && daysUntil(t.due) < 0)
  const top3 = openTodos.slice(0, 3)

  // One recommended focus: the most urgent open todo; if none, the nearest
  // deadline; each with a one-line reason.
  const focus = useMemo(() => {
    if (top3.length > 0) {
      const t = top3[0]
      const reason = t.due
        ? daysUntil(t.due) < 0
          ? `overdue by ${Math.abs(daysUntil(t.due))} day(s) — clear it before it compounds`
          : `due ${formatCountdown(t.due)} and it's your highest-priority open task`
        : `highest-priority open task with nothing dated ahead of it`
      return { title: t.text, reason, tag: t.tag }
    }
    if (deadlines.length > 0) {
      const d = deadlines[0]
      return {
        title: d.label,
        reason: `nearest hard deadline — ${formatCountdown(d.date)} out`,
        tag: 'uni',
      }
    }
    return null
  }, [top3, deadlines])

  const toggleTodo = (id) =>
    saveTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  return (
    <div className="space-y-5">
      {/* Countdown cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {deadlines.map((d) => (
          <CountdownCard key={d.label + d.date} {...d} />
        ))}
        {deadlines.length === 0 && (
          <Card className="sm:col-span-2 xl:col-span-4">
            <EmptyState
              icon={CalendarClock}
              title="No upcoming deadlines"
              hint="Add schools or milestones on the University tab."
            />
          </Card>
        )}
      </div>

      {/* Overdue banner */}
      {overdue.length > 0 && (
        <div className="glass border-danger/40 p-4 flex items-center gap-3">
          <AlertTriangle size={18} className="text-danger shrink-0" />
          <div className="text-sm">
            <span className="text-danger font-semibold">
              {overdue.length} overdue item{overdue.length > 1 ? 's' : ''}:
            </span>{' '}
            <span className="text-ink">
              {overdue.map((t) => t.text).join(' · ')}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Recommended focus */}
        <Card title="Work on this next" className="lg:col-span-2 border-accent/30 shadow-glow">
          {focus ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-accent">
                <Crosshair size={18} />
                <p className="font-display text-lg font-semibold text-ink">
                  {focus.title}
                </p>
              </div>
              <p className="text-sm text-dim leading-relaxed">
                Because it's {focus.reason}.
              </p>
              {sat && (
                <p className="text-xs font-mono text-dim/70 mt-2 border-t hairline pt-2">
                  SAT best {Math.max(...sat.attempts.map((a) => a.total), 0) || '—'} · target{' '}
                  {sat.targetBand[0]}–{sat.targetBand[1]} · retake {sat.retakeWindow}
                </p>
              )}
            </div>
          ) : (
            <EmptyState
              icon={Crosshair}
              title="Nothing queued"
              hint="Add todos and deadlines to get a recommendation."
            />
          )}
        </Card>

        {/* Top 3 priorities */}
        <Card title="Top priorities today" className="lg:col-span-3">
          {top3.length > 0 ? (
            <ul className="divide-y divide-edge/40">
              {top3.map((t, i) => (
                <li key={t.id} className="flex items-center gap-3 py-2.5">
                  <span className="font-mono text-dim/60 text-sm w-5">{i + 1}</span>
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggleTodo(t.id)}
                    className="accent-cyan-400 h-4 w-4 shrink-0"
                  />
                  <span className="flex-1 text-sm">{t.text}</span>
                  <Badge tone={t.priority === 'high' ? 'red' : t.priority === 'med' ? 'amber' : 'dim'}>
                    {t.priority}
                  </Badge>
                  {t.due && (
                    <span
                      className={`text-xs font-mono ${URGENCY_TEXT[urgency(t.due)]}`}
                    >
                      {formatCountdown(t.due)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={ListTodo}
              title="No open tasks"
              hint="Everything's done — or the Todos tab is waiting."
            />
          )}
        </Card>
      </div>
    </div>
  )
}
