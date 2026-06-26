import { useEffect, useMemo, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { useTopics } from '../hooks/useTopics'
import { useQuestions } from '../hooks/useQuestions'
import { useBadges } from '../hooks/useBadges'
import QuestionCard from '../components/QuestionCard'
import ProgressBar from '../components/ProgressBar'
import BadgePopup from '../components/BadgePopup'

const ROUND_SIZE = 10
const DIFFICULTIES = [
  { key: 'basic',        label: 'Básico',      points: 10, color: '#22c55e' }, // green-500
  { key: 'intermediate', label: 'Intermedio',  points: 20, color: '#8b5cf6' }, // violet-500
  { key: 'advanced',     label: 'Avanzado',    points: 30, color: '#f59e0b' }, // amber-500
]
const STREAK_BONUS = 5
const STREAK_MILESTONES = { 3: '¡Racha de 3! 🔥', 5: '¡En llamas! 🔥🔥', 10: '¡Imparable! ⚡' }

export default function Trivia() {
  const { user } = useAuth()
  const { topics } = useTopics()
  const { fetchRound } = useQuestions()
  const { evaluateAfterRound, fetchUserBadges } = useBadges()

  const [phase, setPhase] = useState('config') // config | playing | results
  const [topicId, setTopicId] = useState('all')
  const [difficulty, setDifficulty] = useState('basic')
  const [unlocked, setUnlocked] = useState({ basic: true, intermediate: false, advanced: false })

  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Estado de la ronda
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [streakMax, setStreakMax] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrong, setWrong] = useState([])
  const [streakMsg, setStreakMsg] = useState(null)
  const [newBadges, setNewBadges] = useState([])
  const [badgeCatalog, setBadgeCatalog] = useState([])

  // Catálogo de badges para mostrar en el popup.
  useEffect(() => {
    supabase.from('badges').select('*').then(({ data }) => setBadgeCatalog(data || []))
  }, [])

  // Calcular desbloqueo de dificultades según historial (≥80% en la anterior).
  const computeUnlocks = useCallback(async (tId) => {
    let q = supabase.from('game_sessions')
      .select('difficulty, correct_answers, total_questions, topic_id')
      .eq('user_id', user.id)
    const { data } = await q
    const rows = (data || []).filter((r) => tId === 'all' ? true : r.topic_id === tId)

    const passed = (diff) => rows.some(
      (r) => r.difficulty === diff && r.total_questions > 0 &&
        (r.correct_answers / r.total_questions) >= 0.8
    )
    setUnlocked({
      basic: true,
      intermediate: passed('basic'),
      advanced: passed('basic') && passed('intermediate'),
    })
  }, [user.id])

  useEffect(() => { computeUnlocks(topicId) }, [topicId, computeUnlocks])

  // Si la dificultad seleccionada queda bloqueada, regresar a básico.
  useEffect(() => {
    if (!unlocked[difficulty]) setDifficulty('basic')
  }, [unlocked, difficulty])

  async function startRound() {
    setError(null); setLoading(true)
    try {
      const qs = await fetchRound({
        topicId: topicId === 'all' ? null : topicId,
        difficulty, limit: ROUND_SIZE,
      })
      if (!qs.length) {
        setError('No hay preguntas para esta combinación. Prueba otro tema o dificultad.')
        setLoading(false); return
      }
      // reset
      setQuestions(qs)
      setIdx(0); setSelected(null); setAnswered(false)
      setScore(0); setStreak(0); setStreakMax(0); setCorrectCount(0); setWrong([])
      setPhase('playing')
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  function answer(letter) {
    if (answered) return
    setSelected(letter)
    setAnswered(true)
    const q = questions[idx]
    const isCorrect = letter === q.correct_option
    if (isCorrect) {
      const diffPts = DIFFICULTIES.find((d) => d.key === difficulty).points
      const newStreak = streak + 1
      const bonus = newStreak >= 2 ? STREAK_BONUS : 0 // bonus desde la 2a en racha
      setScore((s) => s + diffPts + bonus)
      setStreak(newStreak)
      setStreakMax((m) => Math.max(m, newStreak))
      setCorrectCount((c) => c + 1)
      if (STREAK_MILESTONES[newStreak]) {
        setStreakMsg(STREAK_MILESTONES[newStreak])
        setTimeout(() => setStreakMsg(null), 1600)
      }
    } else {
      setStreak(0)
      setWrong((w) => [...w, q])
    }
  }

  async function next() {
    if (idx + 1 < questions.length) {
      setIdx((i) => i + 1)
      setSelected(null); setAnswered(false)
    } else {
      await finishRound()
    }
  }

  async function finishRound() {
    const round = {
      user_id: user.id,
      topic_id: topicId === 'all' ? null : topicId,
      difficulty,
      score,
      total_questions: questions.length,
      correct_answers: correctCount,
      streak_max: streakMax,
    }
    // Guardar sesión
    const { error: insErr } = await supabase.from('game_sessions').insert(round)
    if (insErr) setError('No se pudo guardar la sesión: ' + insErr.message)

    // Evaluar insignias
    try {
      const studiedAll = studiedAllTopics(topics)
      const keys = await evaluateAfterRound({ userId: user.id, lastRound: round, studiedAllTopics: studiedAll })
      const popups = keys.map((k) => badgeCatalog.find((b) => b.key === k)).filter(Boolean)
      setNewBadges(popups)
    } catch (e) { console.error('Badges:', e.message) }

    setPhase('results')
  }

  /* ---------------- RENDER ---------------- */

  if (phase === 'config') {
    return (
      <ConfigScreen
        topics={topics} topicId={topicId} setTopicId={setTopicId}
        difficulty={difficulty} setDifficulty={setDifficulty}
        unlocked={unlocked} onStart={startRound} loading={loading} error={error}
      />
    )
  }

  if (phase === 'playing') {
    const q = questions[idx]
    const diffColor = DIFFICULTIES.find((d) => d.key === difficulty).color
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10 space-y-6">
        {/* Top HUD */}
        <div className="flex items-center justify-between gap-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 px-5 py-3.5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
            <span>Pregunta</span>
            <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg text-slate-700 dark:text-slate-200">
              {idx + 1} de {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Racha */}
            <div className={`flex items-center gap-1.5 font-black text-amber-500 dark:text-amber-400 text-sm sm:text-base transition-all duration-300 ${streak > 0 ? 'scale-110 animate-pulse' : 'opacity-65'}`}>
              <span className="text-lg">🔥</span>
              <span>Racha {streak}</span>
            </div>

            {/* Score */}
            <div className="flex items-center gap-1.5 font-black text-sky-500 dark:text-sky-400 text-sm sm:text-base">
              <span className="text-lg">🪙</span>
              <span>{score} pts</span>
            </div>
          </div>
        </div>

        <ProgressBar value={idx + (answered ? 1 : 0)} max={questions.length} color={diffColor} />

        <div className="mt-4">
          <QuestionCard
            question={q} selected={selected} answered={answered}
            onSelect={answer} onContinue={next}
          />
        </div>

        {streakMsg && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-amber-500/20 border border-amber-400 animate-pop-in text-center flex items-center gap-2">
            <span>🔥</span>
            <span>{streakMsg}</span>
          </div>
        )}
      </div>
    )
  }

  // results
  return (
    <>
      <ResultsScreen
        score={score} total={questions.length} correct={correctCount}
        streakMax={streakMax} wrong={wrong}
        onReplay={() => setPhase('config')}
      />
      {newBadges.length > 0 && (
        <BadgePopup badges={newBadges} onClose={() => setNewBadges([])} />
      )}
    </>
  )
}

/* ---- localStorage: temas estudiados (compartido con Study) ---- */
function studiedAllTopics(topics) {
  if (!topics.length) return false
  let reviewed = {}
  try { reviewed = JSON.parse(localStorage.getItem('reviewedTopics') || '{}') } catch {}
  return topics.every((t) => reviewed[t.id])
}

/* ---- Pantalla de configuración ---- */
function ConfigScreen({ topics, topicId, setTopicId, difficulty, setDifficulty, unlocked, onStart, loading, error }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12 animate-slide-up">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-800 dark:text-slate-100">
          Trivia de <span className="bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-transparent">Acreditación</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-semibold tracking-wide text-sm">
          Elige tus preferencias y desafía tus conocimientos de acreditación.
        </p>
      </div>

      <div className="mt-8 bg-white dark:bg-slate-800 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-700/50 p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">Tema de Estudio</label>
          <select
            value={topicId} onChange={(e) => setTopicId(e.target.value)}
            className="w-full border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 dark:focus:border-sky-400 transition"
          >
            <option value="all">📚 Todos los temas</option>
            {topics.map((t) => <option key={t.id} value={t.id}>📁 {t.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-3">Nivel de Dificultad</label>
          <div className="grid grid-cols-3 gap-3">
            {DIFFICULTIES.map((d) => {
              const isUnlocked = unlocked[d.key]
              const active = difficulty === d.key
              
              const diffStyles = {
                basic: {
                  active: 'border-green-500 bg-green-500/5 text-green-700 dark:text-green-400 ring-2 ring-green-500/20 shadow-[0_4px_0_0_rgba(34,197,94,0.4)]',
                  unlocked: 'border-slate-200 dark:border-slate-700 hover:border-green-500/60 dark:hover:border-green-500/40 text-slate-700 dark:text-slate-300 shadow-[0_4px_0_0_rgba(226,232,240,1)] dark:shadow-[0_4px_0_0_rgba(15,23,42,0.6)]',
                  icon: '🌱'
                },
                intermediate: {
                  active: 'border-violet-500 bg-violet-500/5 text-violet-700 dark:text-violet-400 ring-2 ring-violet-500/20 shadow-[0_4px_0_0_rgba(139,92,246,0.4)]',
                  unlocked: 'border-slate-200 dark:border-slate-700 hover:border-violet-500/60 dark:hover:border-violet-500/40 text-slate-700 dark:text-slate-300 shadow-[0_4px_0_0_rgba(226,232,240,1)] dark:shadow-[0_4px_0_0_rgba(15,23,42,0.6)]',
                  icon: '⚡'
                },
                advanced: {
                  active: 'border-amber-500 bg-amber-500/5 text-amber-700 dark:text-amber-400 ring-2 ring-amber-500/20 shadow-[0_4px_0_0_rgba(245,158,11,0.4)]',
                  unlocked: 'border-slate-200 dark:border-slate-700 hover:border-amber-500/60 dark:hover:border-amber-500/40 text-slate-700 dark:text-slate-300 shadow-[0_4px_0_0_rgba(226,232,240,1)] dark:shadow-[0_4px_0_0_rgba(15,23,42,0.6)]',
                  icon: '🔥'
                }
              }
              const style = diffStyles[d.key]

              return (
                <button
                  key={d.key} disabled={!isUnlocked}
                  onClick={() => setDifficulty(d.key)}
                  className={`group relative rounded-2xl border-2 px-3 py-4 text-center transition-all duration-150 flex flex-col items-center justify-center select-none active:translate-y-0.5 active:shadow-[0_1px_0_0_transparent] ${
                    active ? style.active
                    : isUnlocked ? style.unlocked
                    : 'border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 opacity-40 cursor-not-allowed text-slate-400 dark:text-slate-600'
                  }`}
                >
                  <span className="text-2xl mb-1.5">{isUnlocked ? style.icon : '🔒'}</span>
                  <div className="font-extrabold text-sm uppercase tracking-wider">
                    {d.label}
                  </div>
                  <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-1">{d.points} pts</div>
                </button>
              )
            })}
          </div>
          {(!unlocked.intermediate || !unlocked.advanced) && (
            <div className="mt-3 bg-slate-50 dark:bg-slate-900/30 border border-slate-200/10 rounded-xl p-3 flex gap-2 items-center text-xs text-slate-500 dark:text-slate-400">
              <span className="text-sm">💡</span>
              <span>Desbloquea dificultades superiores logrando <strong>≥80% de aciertos</strong> en la dificultad previa.</span>
            </div>
          )}
        </div>

        {error && (
          <div className="text-sm bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20 rounded-xl px-4 py-3 flex gap-2 items-center">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={onStart} disabled={loading}
          className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 dark:from-sky-400 dark:to-sky-500 dark:hover:from-sky-300 dark:hover:to-sky-400 text-white py-4 rounded-2xl font-black text-lg shadow-[0_4px_0_0_#0284c7] active:translate-y-0.5 active:shadow-[0_0px_0_0_transparent] hover:brightness-105 transition-all duration-100 disabled:opacity-60 disabled:pointer-events-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Cargando preguntas...
            </span>
          ) : '🚀 ¡Comenzar Trivia!'}
        </button>
      </div>
    </div>
  )
}

/* ---- Pantalla de resultados ---- */
function ResultsScreen({ score, total, correct, streakMax, wrong, onReplay }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0
  const perfect = correct === total && total > 0

  // Parametros para el círculo SVG
  const radius = 50
  const strokeWidth = 8
  const normalizedRadius = radius - strokeWidth
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (pct / 100) * circumference

  let circleColor = 'stroke-red-500 dark:stroke-red-400'
  let emoji = '🩹'
  let message = '¡Sigue intentándolo!'
  let detailMessage = 'Revisa tus respuestas para seguir aprendiendo.'

  if (perfect) {
    circleColor = 'stroke-green-500 dark:stroke-green-400'
    emoji = '🏆'
    message = '¡Ronda perfecta!'
    detailMessage = '¡Excelente, has acertado todas las preguntas!'
  } else if (pct >= 80) {
    circleColor = 'stroke-sky-500 dark:stroke-sky-400'
    emoji = '🌟'
    message = '¡Trabajo fantástico!'
    detailMessage = '¡Estás muy cerca de la perfección!'
  } else if (pct >= 60) {
    circleColor = 'stroke-violet-500 dark:stroke-violet-400'
    emoji = '👍'
    message = '¡Bien hecho!'
    detailMessage = 'Has superado la mitad de los aciertos.'
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-700/50 p-8 text-center animate-slide-up flex flex-col items-center">
        
        {/* SVG Circular Progress Meter */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-4">
          <svg className="w-full h-full transform -rotate-90">
            {/* Fondo del círculo */}
            <circle
              className="text-slate-100 dark:text-slate-700 stroke-current"
              strokeWidth={strokeWidth}
              fill="transparent"
              r={normalizedRadius}
              cx={radius + strokeWidth}
              cy={radius + strokeWidth}
            />
            {/* Progreso del círculo */}
            <circle
              className={`${circleColor} stroke-current transition-all duration-1000 ease-out`}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              fill="transparent"
              r={normalizedRadius}
              cx={radius + strokeWidth}
              cy={radius + strokeWidth}
            />
          </svg>
          {/* Emojis flotante en el centro */}
          <div className="absolute text-5xl animate-bounce">{emoji}</div>
        </div>

        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 leading-tight">
          {message}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">
          {detailMessage}
        </p>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-3 gap-3.5 w-full">
          <Stat label="Puntaje" value={`+${score}`} color="text-sky-500 dark:text-sky-400" icon="🪙" />
          <Stat label="Aciertos" value={`${pct}%`} color="text-green-500 dark:text-green-400" icon="🎯" />
          <Stat label="Racha Máx." value={streakMax} color="text-amber-500 dark:text-amber-400" icon="🔥" />
        </div>
        
        <p className="mt-5 text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
          Respondiste correctamente {correct} de {total} preguntas
        </p>

        <button
          onClick={onReplay}
          className="mt-8 w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-black uppercase text-sm tracking-wider px-10 py-4 rounded-2xl shadow-[0_4px_0_0_#16a34a] active:translate-y-0.5 active:shadow-[0_0px_0_0_transparent] transition-all duration-100"
        >
          🔁 Jugar otra ronda
        </button>
      </div>

      {wrong.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-700/50 p-6 sm:p-8 animate-slide-up">
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span>📝</span> Preguntas para repasar
          </h2>
          <ul className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {wrong.map((q) => (
              <li key={q.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-relaxed">
                  {q.text}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5 text-xs sm:text-sm font-semibold">
                  <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                    <span>✓ Correcta:</span>
                    <span className="bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 uppercase font-black">{q.correct_option})</span>
                  </span>
                  <span className="text-slate-600 dark:text-slate-300">
                    {q[`option_${q.correct_option}`]}
                  </span>
                </div>
                {q.explanation && (
                  <p className="text-xs bg-slate-50 dark:bg-slate-900/50 border border-slate-200/10 p-3 rounded-xl text-slate-500 dark:text-slate-400 leading-relaxed">
                    <strong>Explicación:</strong> {q.explanation}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, color, icon }) {
  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/30 py-3.5 px-2 flex flex-col items-center justify-center hover:-translate-y-0.5 transition-transform duration-200">
      <span className="text-xl sm:text-2xl mb-1">{icon}</span>
      <div className={`text-2xl sm:text-3xl font-black tracking-tight ${color}`}>{value}</div>
      <div className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider text-center">{label}</div>
    </div>
  )
}

