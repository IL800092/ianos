import {
  LayoutDashboard,
  GraduationCap,
  Building2,
  Wrench,
  Dumbbell,
  ListTodo,
  Sparkles,
} from 'lucide-react'
import { motion } from 'framer-motion'

export const TABS = [
  { id: 'brief', label: 'Brief', icon: LayoutDashboard },
  { id: 'academics', label: 'Academics', icon: GraduationCap },
  { id: 'university', label: 'University', icon: Building2 },
  { id: 'projects', label: 'Projects', icon: Wrench },
  { id: 'training', label: 'Training', icon: Dumbbell },
  { id: 'todos', label: 'Todos', icon: ListTodo },
  { id: 'chat', label: 'ATLAS', icon: Sparkles },
]

export function Nav({ tab, onChange }) {
  return (
    <nav
      className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible px-3 py-2 lg:py-4
                 border-b lg:border-b-0 lg:border-r hairline shrink-0 lg:w-48"
    >
      {TABS.map(({ id, label, icon: Icon }) => {
        const active = tab === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors
              ${active ? 'text-accent' : 'text-dim hover:text-ink hover:bg-panel/60'}`}
          >
            {active && (
              <motion.span
                layoutId="nav-active"
                className="absolute inset-0 rounded-lg bg-accent/10 border border-accent/25"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <Icon size={16} className="relative" strokeWidth={1.75} />
            <span className="relative font-display tracking-wide">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
