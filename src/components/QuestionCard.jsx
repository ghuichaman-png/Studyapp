// Tarjeta de pregunta de trivia. Controla selección, feedback y explicación.
// Props:
//  question, selected, answered, onSelect(letter), onContinue
const LETTERS = ['a', 'b', 'c', 'd']

export default function QuestionCard({ question, selected, answered, onSelect, onContinue }) {
  if (!question) return null
  const correct = question.correct_option

  function optionStyle(letter) {
    if (!answered) {
      return selected === letter
        ? 'border-sky-400 dark:border-sky-500 bg-sky-500/5 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 shadow-[0_4px_0_0_rgba(56,189,248,0.4)] translate-y-0.5'
        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-400 dark:hover:border-sky-500 hover:bg-slate-50 dark:hover:bg-slate-700/40 shadow-[0_4px_0_0_rgba(226,232,240,1)] dark:shadow-[0_4px_0_0_rgba(15,23,42,0.6)] active:translate-y-0.5 active:shadow-[0_0px_0_0_transparent]'
    }
    // Tras responder:
    if (letter === correct) {
      return 'border-green-500 dark:border-green-400 bg-green-500/5 dark:bg-green-500/10 text-green-700 dark:text-green-400 shadow-[0_4px_0_0_rgba(74,222,128,0.3)]'
    }
    if (letter === selected) {
      return 'border-red-500 dark:border-red-400 bg-red-500/5 dark:bg-red-500/10 text-red-700 dark:text-red-400 shadow-[0_4px_0_0_rgba(248,113,113,0.3)]'
    }
    return 'border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-40 cursor-default'
  }

  function letterStyle(letter) {
    if (!answered) {
      return selected === letter
        ? 'bg-sky-500 text-white border-sky-400'
        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-slate-600'
    }
    if (letter === correct) {
      return 'bg-green-500 text-white border-green-400'
    }
    if (letter === selected) {
      return 'bg-red-500 text-white border-red-400'
    }
    return 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-700 border-slate-200 dark:border-slate-800'
  }

  const isCorrect = answered && selected === correct

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-md border border-slate-100 dark:border-slate-700/50 p-6 sm:p-8 animate-fade-in space-y-6">
      <p className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 leading-snug">
        {question.text}
      </p>

      <div className="grid gap-3.5">
        {LETTERS.map((letter) => (
          <button
            key={letter}
            disabled={answered}
            onClick={() => onSelect(letter)}
            className={`text-left border-2 rounded-2xl px-4 py-3.5 transition-all duration-150 flex items-start gap-4 font-semibold text-sm sm:text-base ${optionStyle(letter)}`}
          >
            <span className={`shrink-0 w-8 h-8 grid place-items-center rounded-xl border-b-2 font-bold text-sm uppercase ${letterStyle(letter)}`}>
              {letter}
            </span>
            <span className="pt-1 flex-1 leading-relaxed">{question[`option_${letter}`]}</span>
            {answered && letter === correct && (
              <span className="ml-auto bg-green-500 text-white rounded-full w-5.5 h-5.5 flex items-center justify-center text-xs font-bold shadow-sm">✓</span>
            )}
            {answered && letter === selected && letter !== correct && (
              <span className="ml-auto bg-red-500 text-white rounded-full w-5.5 h-5.5 flex items-center justify-center text-xs font-bold shadow-sm">✗</span>
            )}
          </button>
        ))}
      </div>

      {/* Panel de feedback */}
      {answered && (
        <div
          className={`rounded-2xl p-5 sm:p-6 animate-slide-up border ${
            isCorrect 
              ? 'bg-green-500/10 dark:bg-green-500/15 border-green-500/20 dark:border-green-500/30 text-green-900 dark:text-green-200' 
              : 'bg-red-500/10 dark:bg-red-500/15 border-red-500/20 dark:border-red-500/30 text-red-900 dark:text-red-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{isCorrect ? '🎉' : '💡'}</span>
            <p className="font-extrabold text-lg sm:text-xl">
              {isCorrect ? '¡Excelente trabajo!' : '¡Respuesta incorrecta!'}
            </p>
          </div>
          
          {!isCorrect && (
            <p className="text-sm font-semibold mt-2.5 text-red-800 dark:text-red-300">
              La correcta era: <span className="bg-red-500/15 px-2 py-0.5 rounded-lg border border-red-500/20 uppercase font-black">{correct})</span> {question[`option_${correct}`]}
            </p>
          )}
          
          <div className="mt-3.5 bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/10 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            <strong className="font-extrabold text-slate-800 dark:text-slate-200">Explicación:</strong> {question.explanation}
          </div>
          
          <div className="flex justify-end mt-5">
            <button
              onClick={onContinue}
              className={`w-full sm:w-auto font-black uppercase text-sm tracking-wider px-8 py-3.5 rounded-2xl transition-all duration-100 active:translate-y-0.5 active:shadow-[0_0px_0_0_transparent] shadow-md ${
                isCorrect 
                  ? 'bg-green-500 dark:bg-green-600 text-white shadow-[0_4px_0_0_#15803d] dark:shadow-[0_4px_0_0_#166534] hover:brightness-105' 
                  : 'bg-red-500 dark:bg-red-600 text-white shadow-[0_4px_0_0_#b91c1c] dark:shadow-[0_4px_0_0_#991b1b] hover:brightness-105'
              }`}
            >
              {isCorrect ? 'Continuar' : 'Entendido'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

