import { useState } from 'react'
import { Plus, Trash2, Building2 } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { useCollection } from '../../lib/useCollection'
import { daysUntil, urgency } from '../../lib/dates'
import { Timeline } from './Timeline'

const STATUSES = ['Not started', 'In progress', 'Submitted', 'Decision']
const STATUS_TONE = {
  'Not started': 'dim',
  'In progress': 'cyan',
  Submitted: 'violet',
  Decision: 'green',
}
const URGENCY_TEXT = { green: 'text-ok', amber: 'text-warn', red: 'text-danger' }

const BLANK = { school: '', program: '', platform: 'OUAC', deadline: '', status: 'Not started' }

export function UniversityPage() {
  const { data, save, loading } = useCollection('university')
  const [draft, setDraft] = useState(null)

  if (loading || !data) return null

  const patchSchool = (id, patch) =>
    save({
      ...data,
      schools: data.schools.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    })

  const removeSchool = (id) =>
    save({ ...data, schools: data.schools.filter((s) => s.id !== id) })

  const addSchool = (e) => {
    e.preventDefault()
    if (!draft.school || !draft.deadline) return
    save({
      ...data,
      schools: [...data.schools, { ...draft, id: `uni-${Date.now()}`, notes: '' }],
    })
    setDraft(null)
  }

  const timelineItems = [
    ...data.schools.map((s) => ({ id: s.id, label: s.school, date: s.deadline })),
    ...data.milestones.map((m) => ({ id: m.id, label: m.label, date: m.date })),
  ]

  return (
    <div className="space-y-5">
      <Card title="Deadline timeline">
        <Timeline items={timelineItems} />
      </Card>

      <Card
        title="Application tracker"
        right={
          <button
            onClick={() => setDraft(draft ? null : { ...BLANK })}
            className="flex items-center gap-1.5 text-xs font-display text-accent border border-accent/40 bg-accent/10 rounded-lg px-2.5 py-1.5 hover:bg-accent/20 transition-colors"
          >
            <Plus size={14} /> Add school
          </button>
        }
      >
        {draft && (
          <form
            onSubmit={addSchool}
            className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4 p-3 rounded-lg border border-accent/25 bg-raised/60"
          >
            <input
              placeholder="School"
              required
              value={draft.school}
              onChange={(e) => setDraft({ ...draft, school: e.target.value })}
            />
            <input
              placeholder="Program"
              value={draft.program}
              onChange={(e) => setDraft({ ...draft, program: e.target.value })}
            />
            <input
              placeholder="Platform"
              value={draft.platform}
              onChange={(e) => setDraft({ ...draft, platform: e.target.value })}
            />
            <input
              type="date"
              required
              value={draft.deadline}
              onChange={(e) => setDraft({ ...draft, deadline: e.target.value })}
            />
            <button
              type="submit"
              className="rounded-lg border border-accent/40 bg-accent/10 text-accent px-3 py-2 text-sm font-display hover:bg-accent/20 transition-colors"
            >
              Save
            </button>
          </form>
        )}

        {data.schools.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-left text-[11px] font-mono uppercase tracking-wider text-dim border-b hairline">
                  <th className="py-2 pr-3 font-medium">School</th>
                  <th className="py-2 pr-3 font-medium">Program</th>
                  <th className="py-2 pr-3 font-medium">Platform</th>
                  <th className="py-2 pr-3 font-medium">Deadline</th>
                  <th className="py-2 pr-3 font-medium">T-minus</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 w-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-edge/40">
                {data.schools.map((s) => {
                  const d = daysUntil(s.deadline)
                  return (
                    <tr key={s.id} className="hover:bg-panel/50 transition-colors">
                      <td className="py-2.5 pr-3 text-ink">{s.school}</td>
                      <td className="py-2.5 pr-3 text-dim">
                        <input
                          className="bg-transparent border-0 px-0 py-0 rounded-none w-full focus:border-0 text-dim focus:text-ink"
                          value={s.program}
                          onChange={(e) => patchSchool(s.id, { program: e.target.value })}
                        />
                      </td>
                      <td className="py-2.5 pr-3">
                        <Badge tone="dim">{s.platform}</Badge>
                      </td>
                      <td className="py-2.5 pr-3">
                        <input
                          type="date"
                          className="bg-transparent border-0 px-0 py-0 rounded-none font-mono text-xs text-dim focus:text-ink"
                          value={s.deadline}
                          onChange={(e) => patchSchool(s.id, { deadline: e.target.value })}
                        />
                      </td>
                      <td
                        className={`py-2.5 pr-3 font-mono text-xs ${
                          d < 0 ? 'text-dim/60' : URGENCY_TEXT[urgency(s.deadline)]
                        }`}
                      >
                        {d < 0 ? 'passed' : `${d}d`}
                      </td>
                      <td className="py-2.5 pr-3">
                        <select
                          value={s.status}
                          onChange={(e) => patchSchool(s.id, { status: e.target.value })}
                          className={`text-xs py-1 ${
                            STATUS_TONE[s.status] === 'cyan'
                              ? 'text-accent'
                              : STATUS_TONE[s.status] === 'green'
                                ? 'text-ok'
                                : STATUS_TONE[s.status] === 'violet'
                                  ? 'text-violet'
                                  : 'text-dim'
                          }`}
                        >
                          {STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2.5">
                        <button
                          onClick={() => removeSchool(s.id)}
                          className="text-dim/50 hover:text-danger transition-colors"
                          title="Remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Building2}
            title="No schools tracked yet"
            hint="Add your first school to start the countdown."
          />
        )}
      </Card>
    </div>
  )
}
