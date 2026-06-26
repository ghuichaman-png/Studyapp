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
        ? 'border-institutional bg-institutional/5'
        : 'border-slate-200 hover:border-institutional/50 hover:bg-slate-50'
    }
    // Tras responder:
    if (letter === correct) return 'border-success bg-success/10 text-green-800'
    if (letter === selected) return 'border-danger bg-danger/10 text-red-800'
    return 'border-slate-200 opacity-60'
  }

  const isCorrect = answered && selected === correct

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-fade-in">
      <p className="text-lg font-semibold text-institutional leading-snug">{question.text}</p>

      <div className="mt-5 grid gap-3">
        {LETTERS.map((letter) => (
          <button
            key={letter}
            disabled={answered}
            onClick={() => onSelect(letter)}
            className={`text-left border-2 rounded-xl px-4 py-3 transition-all flex items-start gap-3 ${optionStyle(letter)}`}
          >
            <span className="shrink-0 w-7 h-7 grid place-items-center rounded-full bg-slate-100 font-bold text-sm uppercase">
              {letter}
            </span>
            <span className="pt-0.5">{question[`option_${letter}`]}</span>
            {answered && letter === correct && <span className="ml-auto text-success">✓</span>}
            {answered && letter === selected && letter !== correct && <span className="ml-auto text-danger">✗</span>}
          </button>
        ))}
      </div>

      {/* Panel de feedback */}
      {answered && (
        <div
          className={`mt-5 rounded-xl p-4 animate-slide-up ${
            isCorrect ? 'bg-success/10 border border-success/30' : 'bg-danger/10 border border-danger/30'
          }`}
        >
          <p className={`font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect ? '✅ ¡Correcto!' : '❌ Incorrecto'}
          </p>
          {!isCorrect && (
            <p className="text-sm mt-1 text-red-700">
              Respuesta correcta: <strong className="uppercase">{correct})</strong> {question[`option_${correct}`]}
            </p>
          )}
          <p className="text-sm mt-2 text-slate-600">
            <strong>Explicación:</strong> {question.explanation}
          </p>
          <button
            onClick={onContinue}
            className="mt-4 bg-institutional text-white px-5 py-2 rounded-lg font-medium hover:bg-institutional-light transition-colors"
          >
            {isCorrect ? 'Continuar' : 'Entendido'}
          </button>
        </div>
      )}
    </div>
  )
}
