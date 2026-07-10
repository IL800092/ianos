import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { TrendingUp } from 'lucide-react'
import { formatDay } from '../../lib/dates'
import { AXIS, GRID, SERIES_1, SERIES_2, SURFACE, TOOLTIP_STYLE } from './chartTheme'

export function SatSection({ sat, save }) {
  const [form, setForm] = useState({ date: '', total: '', rw: '', math: '', notes: '' })

  const attempts = useMemo(
    () => [...sat.attempts].sort((a, b) => a.date.localeCompare(b.date)),
    [sat.attempts]
  )
  // Two series over one date axis: official vs practice point styles.
  const chartData = attempts.map((a) => ({
    date: a.date,
    official: a.kind === 'official' ? a.total : null,
    practice: a.kind === 'practice' ? a.total : null,
    notes: a.notes,
  }))

  const best = attempts.length ? Math.max(...attempts.map((a) => a.total)) : null
  const [lo, hi] = sat.targetBand
  const gap = best !== null ? lo - best : null

  const submit = (e) => {
    e.preventDefault()
    if (!form.date || !form.total) return
    const entry = {
      id: `sat-${Date.now()}`,
      date: form.date,
      total: Number(form.total),
      rw: form.rw ? Number(form.rw) : null,
      math: form.math ? Number(form.math) : null,
      kind: 'practice',
      notes: form.notes,
    }
    save({ ...sat, attempts: [...sat.attempts, entry] })
    setForm({ date: '', total: '', rw: '', math: '', notes: '' })
  }

  return (
    <Card
      title="SAT trajectory"
      right={
        <div className="flex items-center gap-2">
          {best !== null && <Badge tone="cyan">best {best}</Badge>}
          {gap !== null && (
            <Badge tone={gap <= 0 ? 'green' : gap <= 50 ? 'amber' : 'red'}>
              {gap <= 0 ? 'in target band' : `${gap} to target`}
            </Badge>
          )}
        </div>
      }
    >
      {attempts.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 8, right: 16 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis
                dataKey="date"
                tick={AXIS}
                stroke={GRID}
                tickLine={false}
                tickFormatter={(d) => formatDay(d).replace(/, \d{4}$/, '')}
              />
              <YAxis
                domain={[1200, 1600]}
                ticks={[1200, 1300, 1400, 1500, 1600]}
                tick={AXIS}
                stroke="transparent"
                tickLine={false}
                width={44}
              />
              {/* Target band 1450–1500 drawn on the chart */}
              <ReferenceArea
                y1={lo}
                y2={hi}
                fill={SERIES_1}
                fillOpacity={0.12}
                stroke={SERIES_1}
                strokeOpacity={0.35}
                strokeDasharray="0"
                label={{
                  value: `target ${lo}–${hi}`,
                  position: 'insideTopRight',
                  fill: '#7a91b0',
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono',
                }}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                labelFormatter={formatDay}
                formatter={(v, name) => [v, name === 'official' ? 'Official' : 'Practice']}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, fontFamily: 'JetBrains Mono' }}
                iconSize={10}
              />
              <Line
                name="Official"
                dataKey="official"
                stroke={SERIES_1}
                strokeWidth={2}
                connectNulls
                dot={{ r: 5, fill: SERIES_1, stroke: SURFACE, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line
                name="Practice"
                dataKey="practice"
                stroke={SERIES_2}
                strokeWidth={2}
                connectNulls
                dot={{ r: 4, fill: SURFACE, stroke: SERIES_2, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState
          icon={TrendingUp}
          title="No attempts logged yet"
          hint="Log your first practice test below."
        />
      )}

      {/* Log a practice test — persists to the backend */}
      <form
        onSubmit={submit}
        className="mt-4 pt-4 border-t hairline grid grid-cols-2 sm:grid-cols-6 gap-2 items-end"
      >
        <label className="flex flex-col gap-1 text-xs text-dim col-span-2 sm:col-span-1">
          Date
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-dim">
          Total
          <input
            type="number"
            min="400"
            max="1600"
            required
            placeholder="1450"
            value={form.total}
            onChange={(e) => setForm({ ...form, total: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-dim">
          R/W
          <input
            type="number"
            min="200"
            max="800"
            placeholder="720"
            value={form.rw}
            onChange={(e) => setForm({ ...form, rw: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-dim">
          Math
          <input
            type="number"
            min="200"
            max="800"
            placeholder="730"
            value={form.math}
            onChange={(e) => setForm({ ...form, math: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-dim col-span-2 sm:col-span-1">
          Notes
          <input
            type="text"
            placeholder="Bluebook #4"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </label>
        <button
          type="submit"
          className="rounded-lg border border-accent/40 bg-accent/10 text-accent px-3 py-2 text-sm font-display hover:bg-accent/20 transition-colors"
        >
          Log test
        </button>
      </form>
    </Card>
  )
}
