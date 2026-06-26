import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'

// Ranking del equipo. Agrega puntaje total, % aciertos global e insignias.
export default function Ranking() {
  const { user } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true); setError(null)
      try {
        // Perfiles de jugadores
        const { data: profiles, error: pErr } = await supabase
          .from('profiles').select('user_id, username, role')
        if (pErr) throw pErr

        // Sesiones (RLS: admin ve todas; jugador ve solo las suyas).
        const { data: sessions, error: sErr } = await supabase
          .from('game_sessions').select('user_id, score, correct_answers, total_questions')
        if (sErr) throw sErr

        const { data: badges, error: bErr } = await supabase
          .from('user_badges').select('user_id, badge_key')
        if (bErr) throw bErr
        const { data: catalog } = await supabase.from('badges').select('key, icon_emoji')
        const emojiByKey = Object.fromEntries((catalog || []).map((b) => [b.key, b.icon_emoji]))

        // Agregar por usuario
        const agg = {}
        for (const p of profiles.filter((p) => p.role === 'player')) {
          agg[p.user_id] = {
            user_id: p.user_id, username: p.username,
            points: 0, correct: 0, total: 0, badges: [],
          }
        }
        for (const s of sessions) {
          const a = agg[s.user_id]; if (!a) continue
          a.points += s.score || 0
          a.correct += s.correct_answers || 0
          a.total += s.total_questions || 0
        }
        for (const b of badges) {
          const a = agg[b.user_id]; if (!a) continue
          if (emojiByKey[b.badge_key]) a.badges.push(emojiByKey[b.badge_key])
        }

        const list = Object.values(agg)
          .map((a) => ({ ...a, pct: a.total > 0 ? Math.round((a.correct / a.total) * 100) : 0 }))
          .sort((x, y) => y.points - x.points)

        if (active) setRows(list)
      } catch (err) {
        if (active) setError(err.message)
      } finally { if (active) setLoading(false) }
    })()
    return () => { active = false }
  }, [])

  const medal = (i) => (i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-institutional">Ranking del equipo</h1>
      <p className="text-slate-500 mt-1">Clasificación por puntaje total acumulado.</p>

      {loading ? (
        <div className="text-center text-slate-400 py-16">Cargando ranking…</div>
      ) : error ? (
        <div className="mt-6 bg-danger/10 text-red-700 border border-danger/30 rounded-xl px-4 py-3 text-sm">{error}</div>
      ) : rows.length === 0 ? (
        <div className="mt-6 text-center text-slate-400 py-16 border-2 border-dashed border-slate-200 rounded-2xl">
          Aún no hay puntajes registrados.
        </div>
      ) : (
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="hidden sm:grid grid-cols-12 gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 border-b border-slate-100">
            <span className="col-span-1">#</span>
            <span className="col-span-4">Jugador</span>
            <span className="col-span-2 text-right">Puntaje</span>
            <span className="col-span-2 text-right">Aciertos</span>
            <span className="col-span-3">Insignias</span>
          </div>
          {rows.map((r, i) => {
            const me = r.user_id === user.id
            return (
              <div
                key={r.user_id}
                className={`grid grid-cols-12 gap-2 px-5 py-3 items-center border-b border-slate-50 last:border-0 ${
                  me ? 'bg-institutional/5' : ''
                }`}
              >
                <span className="col-span-2 sm:col-span-1 text-lg font-bold">{medal(i)}</span>
                <span className="col-span-6 sm:col-span-4 font-semibold text-slate-700 truncate">
                  {r.username} {me && <span className="text-xs text-institutional">(tú)</span>}
                </span>
                <span className="col-span-4 sm:col-span-2 text-right font-bold text-institutional">{r.points}</span>
                <span className="hidden sm:block col-span-2 text-right text-slate-500">{r.pct}%</span>
                <span className="col-span-12 sm:col-span-3 text-lg leading-none mt-1 sm:mt-0 truncate">
                  {r.badges.join(' ') || <span className="text-xs text-slate-300">—</span>}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
