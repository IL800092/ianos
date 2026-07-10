import { useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Dumbbell } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { useCollection } from '../../lib/useCollection'
import { currentSport, formatDay } from '../../lib/dates'
import { AXIS, GRID, SERIES_1, SURFACE, TOOLTIP_STYLE } from '../academics/chartTheme'

const WARN = '#fbbf24'

export function TrainingPage() {
  const { data: training, save, loading } = useCollection('training')
  const { data: profile } = useCollection('profile')
  const [form, setForm] = useState({ date: '', touch: '', notes: '' })

  if (loading || !training) return null

  const entries = [...training.entries].sort((a, b) => a.date.localeCompare(b.date))
  const target = training.goal.targetInches
  const best = entries.length ? Math.max(...entries.map((e) => e.touch)) : null
  const sport = profile ? currentSport(profile.sports) : null

  const submit = (e) => {
    e.preventDefault()
    if (!form.date || !form.touch) return
    save({
      ...training,
      entries: [
        ...training.entries,
        {
          id: `jump-${Date.now()}`,
          date: form.date,
          touch: Number(form.touch),
          notes: form.notes,
        },
      ],
    })
    setForm({ date: '', touch: '', notes: '' })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card title="Goal">
          <p className="font-display text-2xl font-semibold text-ink">
            {training.goal.label}
          </p>
          <p className="text-xs font-mono text-dim mt-1">
            rim = {target}&Prime; standing touch
          </p>
        </Card>
        <Card title="Best touch">
          <p className="font-display text-2xl font-semibold text-accent tabular-nums">
            {best !== null ? `${best}"` : '—'}
          </p>
          <p className="text-xs font-mono text-dim mt-1">
            {best !== null
              ? best >= target
                ? 'RIM ACQUIRED 🏀'
                : `${target - best}" to go`
              : 'log a jump to start tracking'}
          </p>
        </Card>
        <Card title="Current season">
          {sport ? (
            <>
              <p className="font-display text-2xl font-semibold text-ink">
                {sport.sport}
              </p>
              <Badge tone="violet" className="mt-1.5">
                {sport.season}
              </Badge>
            </>
          ) : (
            <p className="text-dim text-sm">—</p>
          )}
        </Card>
      </div>

      <Card title="Vertical jump log">
        {entries.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={entries} margin={{ top: 16, right: 16 }}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={AXIS}
                  stroke={GRID}
                  tickLine={false}
                  tickFormatter={(d) => formatDay(d).replace(/, \d{4}$/, '')}
                />
                <YAxis
                  domain={[
                    (min) => Math.min(Math.floor(min - 4), target - 6),
                    (max) => Math.max(Math.ceil(max + 4), target + 4),
                  ]}
                  tick={AXIS}
                  stroke="transparent"
                  tickLine={false}
                  width={40}
                  unit={'"'}
                />
                {/* Rim-touch goal drawn as a target line */}
                <ReferenceLine
                  y={target}
                  stroke={WARN}
                  strokeWidth={1.5}
                  label={{
                    value: `RIM ${target}"`,
                    position: 'insideTopRight',
                    fill: WARN,
                    fontSize: 11,
                    fontFamily: 'JetBrains Mono',
                  }}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelFormatter={formatDay}
                  formatter={(v) => [`${v}"`, 'Touch height']}
                />
                <Line
                  dataKey="touch"
                  stroke={SERIES_1}
                  strokeWidth={2}
                  dot={{ r: 4, fill: SERIES_1, stroke: SURFACE, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState
            icon={Dumbbell}
            title="Empty log — first entry sets the baseline"
            hint="Measure your standing-jump touch height and log it below."
          />
        )}

        <form
          onSubmit={submit}
          className="mt-4 pt-4 border-t hairline grid grid-cols-2 sm:grid-cols-4 gap-2 items-end"
        >
          <label className="flex flex-col gap-1 text-xs text-dim">
            Date
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-dim">
            Touch height (in)
            <input
              type="number"
              step="0.5"
              min="60"
              max="140"
              required
              placeholder="112"
              value={form.touch}
              onChange={(e) => setForm({ ...form, touch: e.target.value })}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-dim col-span-2 sm:col-span-1">
            Notes
            <input
              type="text"
              placeholder="post power-clean session"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </label>
          <button
            type="submit"
            className="rounded-lg border border-accent/40 bg-accent/10 text-accent px-3 py-2 text-sm font-display hover:bg-accent/20 transition-colors"
          >
            Log jump
          </button>
        </form>
      </Card>
    </div>
  )
}
