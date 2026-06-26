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

  const rankBadgeMap = (i) => (i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 animate-slide-up space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-800 dark:text-slate-100">
          Ranking del <span className="bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-transparent">Equipo</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">
          Clasificación general por puntos acumulados en la Studyapp.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 dark:text-slate-500">
          <svg className="animate-spin h-8 w-8 mx-auto mb-4 text-sky-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Cargando clasificación...
        </div>
      ) : error ? (
        <div className="bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20 rounded-2xl px-4 py-3 flex gap-2 items-center text-sm">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          Aún no hay puntuaciones en el tablero. ¡Sé el primero en jugar!
        </div>
      ) : (
        <div className="grid gap-3">
          {rows.map((r, i) => {
            const me = r.user_id === user.id
            const isTop3 = i < 3
            
            // Configuración visual de las tarjetas
            let cardBg = 'bg-white dark:bg-slate-800'
            let borderStyle = 'border-slate-100 dark:border-slate-700/50'
            let badgeEmoji = rankBadgeMap(i)
            let initialsBg = 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'

            if (i === 0) {
              cardBg = 'bg-gradient-to-r from-amber-500/5 via-white to-amber-500/5 dark:from-amber-500/10 dark:via-slate-800 dark:to-amber-500/5'
              borderStyle = 'border-amber-400/50 dark:border-amber-400/30'
              initialsBg = 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
            } else if (i === 1) {
              cardBg = 'bg-gradient-to-r from-slate-300/5 via-white to-slate-300/5 dark:from-slate-600/10 dark:via-slate-800 dark:to-slate-600/5'
              borderStyle = 'border-slate-300/60 dark:border-slate-700'
              initialsBg = 'bg-slate-200 dark:bg-slate-750 text-slate-700 dark:text-slate-300'
            } else if (i === 2) {
              cardBg = 'bg-gradient-to-r from-orange-400/5 via-white to-orange-400/5 dark:from-orange-500/10 dark:via-slate-800 dark:to-orange-500/5'
              borderStyle = 'border-orange-300/50 dark:border-orange-500/30'
              initialsBg = 'bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300'
            }

            return (
              <div
                key={r.user_id}
                className={`border rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 transition-all duration-200 ${cardBg} ${borderStyle} ${
                  me ? 'ring-2 ring-sky-500/60 dark:ring-sky-400/40' : 'hover:shadow-sm'
                }`}
              >
                {/* Left profile/rank side */}
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Rank Position */}
                  <div className="w-8 shrink-0 text-center font-black text-lg">
                    {isTop3 ? badgeEmoji : `${i + 1}`}
                  </div>
                  
                  {/* Player Avatar */}
                  <div className={`w-10 sm:w-11 h-10 sm:h-11 rounded-full font-black text-sm uppercase flex items-center justify-center shrink-0 border border-black/5 dark:border-white/5 ${initialsBg}`}>
                    {r.username ? r.username.slice(0, 2) : '??'}
                  </div>

                  {/* Username & Sub-stats */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 truncate">
                        {r.username || 'Jugador'}
                      </span>
                      {me && (
                        <span className="bg-sky-500/15 dark:bg-sky-400/15 text-sky-600 dark:text-sky-400 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-sky-500/10 uppercase tracking-wider">
                          Tú
                        </span>
                      )}
                    </div>
                    {/* Badge Emoji Row */}
                    <div className="flex items-center gap-2 mt-1 min-w-0">
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold shrink-0">Insignias:</span>
                      <div className="flex gap-1 overflow-x-auto truncate leading-none py-0.5 max-w-[120px] sm:max-w-[200px]">
                        {r.badges.length > 0 ? (
                          r.badges.map((bEmoji, idx) => (
                            <span key={idx} className="text-sm shrink-0" title="Insignia">{bEmoji}</span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-300 dark:text-slate-600 font-semibold">—</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right stats side */}
                <div className="flex items-center gap-4 sm:gap-6 shrink-0 text-right">
                  <div className="hidden sm:block">
                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Aciertos</div>
                    <div className="text-sm font-extrabold text-slate-700 dark:text-slate-300">{r.pct}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Puntos</div>
                    <div className="text-lg sm:text-xl font-black text-sky-500 dark:text-sky-400">
                      {r.points}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

