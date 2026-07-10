import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ListTodo, Plus, Trash2 } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { useCollection } from '../../lib/useCollection'
import { byUrgency, daysUntil, formatCountdown, urgency } from '../../lib/dates'

const TAGS = ['school', 'uni', 'project', 'personal']
const TAG_TONE = { school: 'cyan', uni: 'violet', project: 'green', personal: 'dim' }
const PRIORITY_TONE = { high: 'red', med: 'amber', low: 'dim' }
const URGENCY_TEXT = { green: 'text-ok', amber: 'text-warn', red: 'text-danger' }

const BLANK = { text: '', priority: 'med', due: '', tag: 'school' }

function TodoRow({ todo, onToggle, onRemove }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.16 }}
      className="flex items-center gap-3 py-2.5 group"
    >
      <input
        type="checkbox"
        checked={todo.done}
        onChange={onToggle}
        className="accent-cyan-400 h-4 w-4 shrink-0"
      />
      <span className={`flex-1 text-sm ${todo.done ? 'line-through text-dim/50' : ''}`}>
        {todo.text}
      </span>
      <Badge tone={TAG_TONE[todo.tag] || 'dim'}>{todo.tag}</Badge>
      <Badge tone={PRIORITY_TONE[todo.priority]}>{todo.priority}</Badge>
      {todo.due && !todo.done && (
        <span
          className={`text-xs font-mono w-20 text-right ${
            daysUntil(todo.due) < 0 ? 'text-danger' : URGENCY_TEXT[urgency(todo.due)]
          }`}
        >
          {formatCountdown(todo.due)}
        </span>
      )}
      <button
        onClick={onRemove}
        className="text-dim/40 hover:text-danger opacity-0 group-hover:opacity-100 transition-all"
        title="Delete"
      >
        <Trash2 size={14} />
      </button>
    </motion.li>
  )
}

export function TodosPage() {
  const { data: todos, save, loading } = useCollection('todos')
  const [draft, setDraft] = useState(BLANK)
  const [filter, setFilter] = useState(null)
  const [showDone, setShowDone] = useState(false)

  const open = useMemo(
    () =>
      (todos || [])
        .filter((t) => !t.done && (!filter || t.tag === filter))
        .sort(byUrgency),
    [todos, filter]
  )
  const done = useMemo(
    () => (todos || []).filter((t) => t.done && (!filter || t.tag === filter)),
    [todos, filter]
  )

  if (loading || !todos) return null

  const add = (e) => {
    e.preventDefault()
    if (!draft.text.trim()) return
    save([
      ...todos,
      {
        ...draft,
        id: `todo-${Date.now()}`,
        done: false,
        createdAt: new Date().toISOString().slice(0, 10),
      },
    ])
    setDraft(BLANK)
  }

  const toggle = (id) =>
    save(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  const remove = (id) => save(todos.filter((t) => t.id !== id))

  return (
    <div className="space-y-4">
      <Card title="New task">
        <form onSubmit={add} className="grid grid-cols-2 sm:grid-cols-6 gap-2 items-end">
          <input
            className="col-span-2"
            placeholder="What needs doing?"
            value={draft.text}
            onChange={(e) => setDraft({ ...draft, text: e.target.value })}
          />
          <select
            value={draft.priority}
            onChange={(e) => setDraft({ ...draft, priority: e.target.value })}
          >
            <option value="high">high</option>
            <option value="med">med</option>
            <option value="low">low</option>
          </select>
          <input
            type="date"
            value={draft.due}
            onChange={(e) => setDraft({ ...draft, due: e.target.value })}
          />
          <select
            value={draft.tag}
            onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
          >
            {TAGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 text-accent px-3 py-2 text-sm font-display hover:bg-accent/20 transition-colors"
          >
            <Plus size={14} /> Add
          </button>
        </form>
      </Card>

      <Card
        title={`Open (${open.length})`}
        right={
          <div className="flex gap-1.5">
            {TAGS.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(filter === t ? null : t)}
                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-mono transition-colors ${
                  filter === t
                    ? 'border-accent/60 bg-accent/15 text-accent'
                    : 'border-edge text-dim hover:text-ink'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        }
      >
        {open.length > 0 ? (
          <ul className="divide-y divide-edge/40">
            <AnimatePresence initial={false}>
              {open.map((t) => (
                <TodoRow
                  key={t.id}
                  todo={t}
                  onToggle={() => toggle(t.id)}
                  onRemove={() => remove(t.id)}
                />
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <EmptyState
            icon={ListTodo}
            title={filter ? `No open ${filter} tasks` : 'Inbox zero'}
            hint={filter ? 'Try clearing the filter.' : 'Add a task above to get started.'}
          />
        )}
      </Card>

      {done.length > 0 && (
        <Card>
          <button
            onClick={() => setShowDone(!showDone)}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-dim hover:text-ink transition-colors w-full"
          >
            <ChevronDown
              size={14}
              className={`transition-transform ${showDone ? '' : '-rotate-90'}`}
            />
            Done ({done.length})
          </button>
          {showDone && (
            <ul className="divide-y divide-edge/40 mt-2">
              <AnimatePresence initial={false}>
                {done.map((t) => (
                  <TodoRow
                    key={t.id}
                    todo={t}
                    onToggle={() => toggle(t.id)}
                    onRemove={() => remove(t.id)}
                  />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </Card>
      )}
    </div>
  )
}
