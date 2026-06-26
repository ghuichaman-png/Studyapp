import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Tarjeta de tema con diseño Duolingo, hover reactivo y soporte de modo claro/oscuro
export default function TopicCard({ topic, onClick, reviewed = false, footer }) {
  const navigate = useNavigate()
  const [hover, setHover] = useState(false)
  const handle = onClick ?? (() => navigate(`/study?topic=${topic.id}`))

  // Icono dinámico según el orden o nombre del tema
  const getIcon = (name) => {
    const lowercaseName = name.toLowerCase()
    if (lowercaseName.includes('antineopl')) return '🧪'
    if (lowercaseName.includes('roja') || lowercaseName.includes('emergencia')) return '🚨'
    if (lowercaseName.includes('ética') || lowercaseName.includes('comité')) return '⚖️'
    if (lowercaseName.includes('paciente') || lowercaseName.includes('seguridad')) return '🛡️'
    if (lowercaseName.includes('infección') || lowercaseName.includes('higiene')) return '🧼'
    if (lowercaseName.includes('derecho') || lowercaseName.includes('deber')) return '📁'
    return '📖'
  }

  return (
    <button
      onClick={handle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={hover ? { boxShadow: `0 0 0 3px ${topic.color || '#38BDF8'}66`, transform: 'translateY(-3px)' } : {}}
      className="group text-left bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-800/80 overflow-hidden transition-all duration-200 w-full shadow-sm relative hover:shadow-md flex flex-col justify-between min-h-[170px]"
    >
      {/* Franja superior con el color del tema */}
      <div className="h-2.5 w-full shrink-0" style={{ backgroundColor: topic.color || '#38BDF8' }} />
      
      <div className="p-5 flex-1 flex flex-col justify-between w-full">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <span className="text-3xl shrink-0 filter drop-shadow-sm group-hover:scale-110 transition-transform duration-200">
              {getIcon(topic.name)}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-snug truncate-2-lines">
                {topic.name}
              </h3>
            </div>
            {reviewed && (
              <span className="shrink-0 flex items-center justify-center bg-green-500/10 dark:bg-green-400/15 text-green-600 dark:text-green-400 h-6 w-6 rounded-full text-sm font-bold shadow-sm" title="Revisado">
                ✓
              </span>
            )}
          </div>
          {topic.description && (
            <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-3 leading-relaxed font-medium">
              {topic.description}
            </p>
          )}
        </div>
        {footer && <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 w-full">{footer}</div>}
      </div>
    </button>
  )
}
