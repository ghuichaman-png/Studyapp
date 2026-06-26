import { useEffect, useState } from 'react'

// Popup animado de insignia desbloqueada. Soporta una cola de varias.
export default function BadgePopup({ badges = [], onClose }) {
  const [index, setIndex] = useState(0)

  useEffect(() => { setIndex(0) }, [badges])

  if (!badges || badges.length === 0) return null
  const badge = badges[index]
  if (!badge) return null

  function next() {
    if (index < badges.length - 1) setIndex((i) => i + 1)
    else onClose?.()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-pop-in">
        <div className="text-xs uppercase tracking-widest text-amber font-bold">
          ¡Insignia desbloqueada!
        </div>
        <div className="my-5 text-7xl animate-pop-in">{badge.icon_emoji}</div>
        <h3 className="text-2xl font-bold text-institutional">{badge.name}</h3>
        <p className="mt-2 text-slate-500">{badge.description}</p>

        {badges.length > 1 && (
          <div className="mt-4 flex justify-center gap-1.5">
            {badges.map((_, i) => (
              <span key={i} className={`h-2 w-2 rounded-full ${i === index ? 'bg-institutional' : 'bg-slate-200'}`} />
            ))}
          </div>
        )}

        <button
          onClick={next}
          className="mt-6 w-full bg-success text-white py-3 rounded-xl font-semibold hover:brightness-95 transition"
        >
          {index < badges.length - 1 ? 'Siguiente' : '¡Genial!'}
        </button>
      </div>
    </div>
  )
}
