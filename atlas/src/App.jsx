import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TopBar } from './components/layout/TopBar'
import { Nav } from './components/layout/Nav'
import { BriefPage } from './features/brief/BriefPage'
import { AcademicsPage } from './features/academics/AcademicsPage'
import { UniversityPage } from './features/university/UniversityPage'
import { ProjectsPage } from './features/projects/ProjectsPage'
import { TrainingPage } from './features/training/TrainingPage'
import { TodosPage } from './features/todos/TodosPage'
import { ChatPanel } from './features/chat/ChatPanel'
import { useCollection } from './lib/useCollection'
import { daysUntil, formatDay } from './lib/dates'

const PAGES = {
  brief: BriefPage,
  academics: AcademicsPage,
  university: UniversityPage,
  projects: ProjectsPage,
  training: TrainingPage,
  todos: TodosPage,
  chat: ChatPanel,
}

export default function App() {
  const [tab, setTab] = useState('brief')
  const { data: university } = useCollection('university')
  const { data: todos } = useCollection('todos')

  const statusLine = useMemo(() => {
    const parts = []
    if (university) {
      const next = [...university.schools, ...university.milestones]
        .map((x) => ({ label: x.label || x.school, date: x.deadline || x.date }))
        .filter((x) => x.date && daysUntil(x.date) >= 0)
        .sort((a, b) => daysUntil(a.date) - daysUntil(b.date))[0]
      if (next)
        parts.push(
          `NEXT DEADLINE: ${next.label.toUpperCase()} · ${formatDay(next.date)} (T-${daysUntil(next.date)})`
        )
    }
    if (todos) {
      const open = todos.filter((t) => !t.done).length
      parts.push(`${open} OPEN TASKS`)
    }
    return parts.join('  ·  ') || 'ALL SYSTEMS NOMINAL'
  }, [university, todos])

  const Page = PAGES[tab]

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar statusLine={statusLine} />
      <div className="flex flex-col lg:flex-row flex-1">
        <Nav tab={tab} onChange={setTab} />
        <main className="flex-1 p-4 sm:p-6 max-w-6xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <Page />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
