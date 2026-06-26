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
  { key: 'basic',        label: 'Básico',      points: 10, color: '#2ecc71' },
  { key: 'intermediate', label: 'Intermedio',  points: 20, color: '#f39c12' },
  { key: 'advanced',     label: 'Avanzado',    points: 30, color: '#e74c3c' },
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
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-3 text-sm">
          <span className="font-semibold text-slate-500">Pregunta {idx + 1} de {questions.length}</span>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-amber flex items-center gap-1">🔥 Racha {streak}</span>
            <span className="font-bold text-institutional">{score} pts</span>
          </div>
        </div>
        <ProgressBar value={idx + (answered ? 1 : 0)} max={questions.length} color={diffColor} />

        <div className="mt-6">
          <QuestionCard
            question={q} selected={selected} answered={answered}
            onSelect={answer} onContinue={next}
          />
        </div>

        {streakMsg && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 bg-amber text-white px-6 py-3 rounded-full font-bold shadow-lg animate-pop-in">
            {streakMsg}
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
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-institutional">Trivia de acreditación</h1>
      <p className="text-slate-500 mt-1">Configura tu ronda de {ROUND_SIZE} preguntas.</p>

      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-2">Tema</label>
          <select
            value={topicId} onChange={(e) => setTopicId(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-institutional/40"
          >
            <option value="all">Todos los temas</option>
            {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-2">Dificultad</label>
          <div className="grid grid-cols-3 gap-3">
            {DIFFICULTIES.map((d) => {
              const isUnlocked = unlocked[d.key]
              const active = difficulty === d.key
              return (
                <button
                  key={d.key} disabled={!isUnlocked}
                  onClick={() => setDifficulty(d.key)}
                  className={`rounded-xl border-2 px-3 py-4 text-center transition ${
                    active ? 'border-institutional bg-institutional/5'
                    : isUnlocked ? 'border-slate-200 hover:border-institutional/40'
                    : 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="font-semibold text-sm" style={{ color: isUnlocked ? d.color : '#94a3b8' }}>
                    {isUnlocked ? d.label : `🔒 ${d.label}`}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{d.points} pts c/u</div>
                </button>
              )
            })}
          </div>
          {(!unlocked.intermediate || !unlocked.advanced) && (
            <p className="text-xs text-slate-400 mt-2">
              🔒 Desbloquea logrando ≥80% de aciertos en la dificultad anterior.
            </p>
          )}
        </div>

        {error && <div className="text-sm bg-danger/10 text-red-700 border border-danger/30 rounded-lg px-3 py-2">{error}</div>}

        <button
          onClick={onStart} disabled={loading}
          className="w-full bg-institutional text-white py-3.5 rounded-xl font-bold text-lg hover:bg-institutional-light transition disabled:opacity-60"
        >
          {loading ? 'Preparando…' : '▶ Comenzar ronda'}
        </button>
      </div>
    </div>
  )
}

/* ---- Pantalla de resultados ---- */
function ResultsScreen({ score, total, correct, streakMax, wrong, onReplay }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0
  const perfect = correct === total && total > 0
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center animate-slide-up">
        <div className="text-6xl mb-2">{perfect ? '🏆' : pct >= 80 ? '🌟' : pct >= 50 ? '👍' : '📚'}</div>
        <h1 className="text-2xl font-bold text-institutional">
          {perfect ? '¡Ronda perfecta!' : '¡Ronda completada!'}
        </h1>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <Stat label="Puntaje" value={score} color="#1e3a5f" />
          <Stat label="Aciertos" value={`${pct}%`} color="#2ecc71" />
          <Stat label="Racha máx." value={streakMax} color="#f39c12" />
        </div>
        <p className="mt-4 text-sm text-slate-500">{correct} de {total} preguntas correctas</p>

        <button
          onClick={onReplay}
          className="mt-8 bg-success text-white px-8 py-3 rounded-xl font-bold hover:brightness-95 transition"
        >🔁 Jugar de nuevo</button>
      </div>

      {wrong.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="font-bold text-institutional mb-3">Preguntas para repasar</h2>
          <ul className="space-y-4">
            {wrong.map((q) => (
              <li key={q.id} className="border-l-4 border-danger pl-3">
                <p className="font-medium text-slate-700">{q.text}</p>
                <p className="text-sm text-green-700 mt-1">
                  ✓ Correcta: <strong className="uppercase">{q.correct_option})</strong> {q[`option_${q.correct_option}`]}
                </p>
                <p className="text-sm text-slate-500 mt-0.5">{q.explanation}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div className="rounded-xl bg-slate-50 py-4">
      <div className="text-3xl font-bold" style={{ color }}>{value}</div>
      <div className="text-xs text-slate-400 mt-1 uppercase tracking-wide">{label}</div>
    </div>
  )
}
