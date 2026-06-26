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
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 animate-slide-up space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-800 dark:text-slate-100">
          Panel de <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">Administración</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">
          Gestiona temas, contenido educativo, banco de preguntas y miembros del equipo.
        </p>
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto select-none no-scrollbar">
        {TABS.map((t) => {
          const active = tab === t.key
          return (
            <button
              key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-xs sm:text-sm font-extrabold whitespace-nowrap rounded-2xl transition-all flex items-center gap-2 border-2 ${
                active 
                  ? 'border-violet-500 bg-violet-500/5 text-violet-600 dark:text-violet-400 shadow-[0_3px_0_0_rgba(139,92,246,0.3)]' 
                  : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <span className="text-base sm:text-lg">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-6">
        <Active />
      </div>
    </div>
  )
}

