import { useState } from 'react'
import TopicsAdmin from '../admin/TopicsAdmin'
import ContentAdmin from '../admin/ContentAdmin'
import QuestionsAdmin from '../admin/QuestionsAdmin'
import TeamAdmin from '../admin/TeamAdmin'

const TABS = [
  { key: 'topics',    label: 'Temas',              icon: '🗂️', C: TopicsAdmin },
  { key: 'content',   label: 'Contenido educativo', icon: '📚', C: ContentAdmin },
  { key: 'questions', label: 'Banco de preguntas',  icon: '❓', C: QuestionsAdmin },
  { key: 'team',      label: 'Equipo',              icon: '👥', C: TeamAdmin },
]

export default function Admin() {
  const [tab, setTab] = useState('topics')
  const Active = TABS.find((t) => t.key === tab).C

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-institutional">Panel de administración</h1>
      <p className="text-slate-500 mt-1">Gestiona temas, contenido, preguntas y el equipo.</p>

      <div className="mt-6 flex gap-1 border-b border-slate-200 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors flex items-center gap-1.5 ${
              tab === t.key ? 'border-institutional text-institutional' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <Active />
      </div>
    </div>
  )
}
