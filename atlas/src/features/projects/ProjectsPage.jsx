import { ExternalLink, Wrench } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { useCollection } from '../../lib/useCollection'

const STATUS_CYCLE = { active: 'paused', paused: 'done', done: 'active' }
const STATUS_TONE = { active: 'green', paused: 'amber', done: 'dim' }

export function ProjectsPage() {
  const { data: projects, save, loading } = useCollection('projects')
  if (loading || !projects) return null

  const patch = (id, p) =>
    save(projects.map((x) => (x.id === id ? { ...x, ...p } : x)))

  if (projects.length === 0) {
    return (
      <Card>
        <EmptyState icon={Wrench} title="No projects yet" />
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((p) => (
        <Card key={p.id} className="hover:border-accent/30 transition-colors">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-display text-lg font-semibold flex items-center gap-2">
              {p.name}
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-dim hover:text-accent transition-colors"
                  title={p.link}
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </h3>
            <button
              onClick={() => patch(p.id, { status: STATUS_CYCLE[p.status] })}
              title="Click to cycle status"
            >
              <Badge tone={STATUS_TONE[p.status]}>{p.status}</Badge>
            </button>
          </div>
          <p className="text-sm text-dim leading-relaxed mb-3">{p.description}</p>
          <label className="flex flex-col gap-1 text-[11px] font-mono uppercase tracking-wider text-dim/70">
            Next action
            <input
              className="text-sm normal-case tracking-normal font-body"
              value={p.nextAction}
              placeholder="What's the next concrete step?"
              onChange={(e) => patch(p.id, { nextAction: e.target.value })}
            />
          </label>
        </Card>
      ))}
    </div>
  )
}
