import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { useCollection } from '../../lib/useCollection'
import { GradesChart } from './GradesChart'
import { SatSection } from './SatSection'

export function AcademicsPage() {
  const { data: academics, loading } = useCollection('academics')
  const { data: sat, save: saveSat } = useCollection('sat')

  if (loading || !sat) return null

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <Card
          title="Grade 11 finals"
          right={<Badge tone="cyan">avg {academics.grade11Average}</Badge>}
          className="xl:col-span-3"
        >
          <GradesChart courses={academics.grade11} />
        </Card>

        <Card title="Grade 12 — current load" className="xl:col-span-2">
          <div className="grid grid-cols-2 gap-2">
            {academics.grade12.map((c) => (
              <div
                key={c.code}
                className="rounded-lg border hairline bg-raised/60 p-3 hover:border-accent/40 transition-colors"
              >
                <p className="font-mono text-[11px] text-accent/80 tracking-wider">
                  {c.code}
                </p>
                <p className="text-sm mt-0.5">{c.name}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <SatSection sat={sat} save={saveSat} />
    </div>
  )
}
