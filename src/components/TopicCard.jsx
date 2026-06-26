import { useNavigate } from 'react-router-dom'

// Tarjeta de tema. Acepta onClick personalizado o navega a /study?topic=id.
export default function TopicCard({ topic, onClick, reviewed = false, footer }) {
  const navigate = useNavigate()
  const handle = onClick ?? (() => navigate(`/study?topic=${topic.id}`))

  return (
    <button
      onClick={handle}
      className="group text-left bg-white rounded-2xl shadow-sm hover:shadow-lg border border-slate-100 overflow-hidden transition-all hover:-translate-y-0.5 w-full"
    >
      <div className="h-2 w-full" style={{ backgroundColor: topic.color || '#1e3a5f' }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg text-institutional leading-snug">{topic.name}</h3>
          {reviewed && (
            <span className="shrink-0 text-success text-xl" title="Revisado">✓</span>
          )}
        </div>
        {topic.description && (
          <p className="mt-2 text-sm text-slate-500 line-clamp-3">{topic.description}</p>
        )}
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </button>
  )
}
