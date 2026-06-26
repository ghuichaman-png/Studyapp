import { useState, useEffect } from 'react'

// Tarjeta educativa con animación flip y borde dinámico degradado
export default function FlashCard({ card }) {
  const [flipped, setFlipped] = useState(false)

  useEffect(() => { setFlipped(false) }, [card?.id])

  if (!card) return null

  return (
    <div
      className={`flip-card ${flipped ? 'flipped' : ''} h-72 w-full cursor-pointer select-none group`}
      onClick={() => setFlipped((f) => !f)}
    >
      <div className="flip-inner h-full w-full">
        
        {/* Frente (Pregunta) */}
        <div className="flip-face gradient-border-anim rounded-2xl shadow-lg p-8 flex flex-col justify-between transition-colors duration-200">
          <div className="text-center w-full mt-2">
            <span className="bg-amber/10 dark:bg-amber-400/15 text-amber-600 dark:text-amber-400 text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider shadow-sm">
              Pregunta 🤔
            </span>
          </div>
          <div className="text-center flex-1 flex items-center justify-center px-2">
            <p className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 leading-snug">
              {card.front}
            </p>
          </div>
          <div className="text-center w-full mb-1 flex items-center justify-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-semibold">
            <span>Toca para ver la respuesta</span>
            <span className="text-base group-hover:rotate-180 transition-transform duration-500">🔄</span>
          </div>
        </div>

        {/* Reverso (Respuesta) */}
        <div className="flip-face flip-back bg-gradient-to-br from-sky-900 via-indigo-900 to-slate-900 rounded-3xl shadow-xl p-8 text-white flex flex-col justify-between border-2 border-indigo-500/20">
          <div className="text-center w-full mt-2">
            <span className="bg-green-500/20 text-green-400 text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider shadow-sm border border-green-500/30">
              Respuesta ✨
            </span>
          </div>
          <div className="text-center flex-1 flex items-center justify-center px-2">
            <p className="text-lg sm:text-xl font-bold leading-relaxed">
              {card.back}
            </p>
          </div>
          <div className="text-center w-full mb-1 text-white/40 text-xs font-semibold">
            Toca para volver a la pregunta
          </div>
        </div>

      </div>
    </div>
  )
}
