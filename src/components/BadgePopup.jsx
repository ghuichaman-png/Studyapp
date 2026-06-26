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
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md grid place-items-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-[32px] shadow-2xl max-w-sm w-full p-8 text-center relative overflow-hidden animate-pop-in">
        
        {/* Glow Decorativo de Fondo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-br from-amber-400/20 to-violet-500/20 dark:from-amber-400/10 dark:to-violet-500/10 rounded-full filter blur-2xl pointer-events-none" />

        <div className="text-xs uppercase tracking-widest text-amber-500 dark:text-amber-400 font-black">
          🏆 ¡Insignia obtenida!
        </div>

        <div className="relative my-6 flex justify-center">
          {/* Pulsing ring around the emoji */}
          <div className="absolute inset-0 bg-amber-400/10 dark:bg-amber-400/5 rounded-full filter blur-xl w-32 h-32 mx-auto animate-pulse" />
          <div className="text-7xl relative z-10 animate-bounce duration-1000">
            {badge.icon_emoji}
          </div>
        </div>

        <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 leading-tight">
          {badge.name}
        </h3>
        
        <p className="mt-2.5 text-slate-500 dark:text-slate-400 font-semibold text-sm leading-relaxed">
          {badge.description}
        </p>

        {badges.length > 1 && (
          <div className="mt-5 flex justify-center gap-1.5">
            {badges.map((_, i) => (
              <span 
                key={i} 
                className={`h-2 rounded-full transition-all duration-150 ${
                  i === index 
                    ? 'w-5 bg-sky-500 dark:bg-sky-400' 
                    : 'w-2 bg-slate-200 dark:bg-slate-700'
                }`} 
              />
            ))}
          </div>
        )}

        <button
          onClick={next}
          className="mt-8 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-black uppercase text-sm tracking-wider py-3.5 rounded-2xl shadow-[0_4px_0_0_#16a34a] active:translate-y-0.5 active:shadow-[0_0px_0_0_transparent] transition-all duration-100"
        >
          {index < badges.length - 1 ? 'Siguiente' : '¡Excelente!'}
        </button>
      </div>
    </div>
  )
}

