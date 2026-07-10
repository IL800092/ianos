import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AXIS, GRID, SERIES_1, TOOLTIP_STYLE } from './chartTheme'

// Horizontal bars, 90–100 domain so single-point differences are visible.
export function GradesChart({ courses }) {
  const data = [...courses].sort((a, b) => b.grade - a.grade)
  return (
    <div className="h-72">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 32 }}>
          <CartesianGrid stroke={GRID} horizontal={false} />
          <XAxis
            type="number"
            domain={[90, 100]}
            ticks={[90, 92, 94, 96, 98, 100]}
            tick={AXIS}
            stroke={GRID}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="code"
            width={72}
            tick={AXIS}
            stroke="transparent"
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgb(34 211 238 / 0.06)' }}
            contentStyle={TOOLTIP_STYLE}
            formatter={(v) => [`${v}%`, 'Grade']}
            labelFormatter={(code) =>
              data.find((c) => c.code === code)?.name || code
            }
          />
          <Bar
            dataKey="grade"
            fill={SERIES_1}
            barSize={14}
            radius={[0, 4, 4, 0]}
            label={{
              position: 'right',
              fill: '#e2eefa',
              fontSize: 11,
              fontFamily: 'JetBrains Mono',
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
