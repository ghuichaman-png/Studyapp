import { useState, useEffect } from 'react'

// Flashcard con flip CSS puro. Se reinicia al frente cuando cambia la carta.
export default function FlashCard({ card }) {
  const [flipped, setFlipped] = useState(false)

  useEffect(() => { setFlipped(false) }, [card?.id])

  if (!card) return null

  return (
    <div
      className={`flip-card ${flipped ? 'flipped' : ''} h-72 w-full cursor-pointer select-none`}
      onClick={() => setFlipped((f) => !f)}
    >
      <div className="flip-inner">
        {/* Frente */}
        <div className="flip-face bg-white rounded-2xl shadow-md border border-slate-100 p-8">
          <div className="text-center">
            <span className="text-xs uppercase tracking-widest text-amber font-semibold">Pregunta</span>
            <p className="mt-4 text-xl font-semibold text-institutional">{card.front}</p>
            <p className="mt-6 text-xs text-slate-400">Toca para ver la respuesta</p>
          </div>
        </div>
        {/* Reverso */}
        <div className="flip-face flip-back bg-institutional rounded-2xl shadow-md p-8 text-white">
          <div className="text-center">
            <span className="text-xs uppercase tracking-widest text-success font-semibold">Respuesta</span>
            <p className="mt-4 text-lg">{card.back}</p>
            <p className="mt-6 text-xs text-white/50">Toca para volver</p>
          </div>
        </div>
      </div>
    </div>
  )
}
