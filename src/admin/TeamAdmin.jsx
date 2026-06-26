import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Btn, Card } from './ui'

// Panel de equipo: tabla de jugadores con métricas, desglose por tema y reset.
export default function TeamAdmin() {
  const [players, setPlayers] = useState([])
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expanded, setExpanded] = useState(null)

  async function load() {
    setLoading(true); setError(null)
    try {
      const [{ data: profiles, error: pErr }, { data: sessions, error: sErr },
             { data: badges }, { data: catalog }, { data: tps }] = await Promise.all([
        supabase.from('profiles').select('user_id, username, role, last_login'),
        supabase.from('game_sessions').select('*'),
        supabase.from('user_badges').select('user_id, badge_key'),
        supabase.from('badges').select('key, icon_emoji'),
        supabase.from('topics').select('id, name').order('order_index'),
      ])
      if (pErr) throw pErr
      if (sErr) throw sErr
      setTopics(tps || [])
      const emoji = Object.fromEntries((catalog || []).map((b) => [b.key, b.icon_emoji]))

      const map = {}
      for (const p of (profiles || []).filter((p) => p.role === 'player')) {
        map[p.user_id] = {
          ...p, points: 0, correct: 0, total: 0, badges: [], byTopic: {},
        }
      }
      for (const s of sessions || []) {
        const a = map[s.user_id]; if (!a) continue
        a.points += s.score || 0
        a.correct += s.correct_answers || 0
        a.total += s.total_questions || 0
        const key = s.topic_id || 'all'
        const bt = a.byTopic[key] || { correct: 0, total: 0 }
        bt.correct += s.correct_answers || 0
        bt.total += s.total_questions || 0
        a.byTopic[key] = bt
      }
      for (const b of badges || []) {
        const a = map[b.user_id]; if (a && emoji[b.badge_key]) a.badges.push(emoji[b.badge_key])
      }
      setPlayers(Object.values(map).sort((x, y) => y.points - x.points))
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  async function resetProgress(p) {
    if (!confirm(`¿Resetear TODO el progreso de "${p.username}"? Se borrarán sus sesiones e insignias.`)) return
    const [s, b] = await Promise.all([
      supabase.from('game_sessions').delete().eq('user_id', p.user_id),
      supabase.from('user_badges').delete().eq('user_id', p.user_id),
    ])
    if (s.error || b.error) { setError((s.error || b.error).message); return }
    load()
  }

  const pct = (c, t) => (t > 0 ? Math.round((c / t) * 100) : 0)
  const topicName = (id) => (id === 'all' ? 'Todos los temas' : topics.find((t) => t.id === id)?.name || '—')

  if (loading) return <p className="text-slate-400 dark:text-slate-500 font-semibold">Cargando equipo…</p>
  if (error) return <div className="bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20 rounded-xl px-4 py-3 text-sm">{error}</div>
  if (!players.length) return <p className="text-slate-405 dark:text-slate-500 font-semibold">Aún no hay jugadores registrados.</p>

  return (
    <Card className="!p-0 overflow-hidden border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800">
      <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700/50">
        <span className="col-span-3">Jugador</span>
        <span className="col-span-2 text-right">Puntaje</span>
        <span className="col-span-2 text-right">Aciertos</span>
        <span className="col-span-2">Insignias</span>
        <span className="col-span-2">Último acceso</span>
        <span className="col-span-1"></span>
      </div>
      {players.map((p) => {
        const open = expanded === p.user_id
        return (
          <div key={p.user_id} className="border-b border-slate-50 dark:border-slate-700/30 last:border-0 hover:bg-slate-50/40 dark:hover:bg-slate-750/10 transition-colors">
            <div className="grid grid-cols-2 md:grid-cols-12 gap-2 px-5 py-3.5 items-center">
              <button onClick={() => setExpanded(open ? null : p.user_id)}
                className="md:col-span-3 font-extrabold text-violet-650 dark:text-violet-400 text-left flex items-center gap-1.5 hover:underline">
                <span className={`transition-transform text-xs ${open ? 'rotate-90' : ''}`}>▸</span>
                {p.username}
              </button>
              <span className="md:col-span-2 text-right font-black text-sky-500 dark:text-sky-400">{p.points}</span>
              <span className="md:col-span-2 text-right text-slate-600 dark:text-slate-300 font-bold">{pct(p.correct, p.total)}%</span>
              <span className="md:col-span-2 text-lg truncate">{p.badges.join(' ') || <span className="text-xs text-slate-300 dark:text-slate-600">—</span>}</span>
              <span className="md:col-span-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                {p.last_login ? new Date(p.last_login).toLocaleDateString() : '—'}
              </span>
              <span className="md:col-span-1 text-right">
                <Btn variant="danger" onClick={() => resetProgress(p)} title="Resetear progreso" className="!py-1 !px-2 text-xs">Reset</Btn>
              </span>
            </div>
            {open && (
              <div className="px-5 pb-4 animate-fade-in space-y-2">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Desglose por tema</p>
                {Object.keys(p.byTopic).length === 0 ? (
                  <p className="text-xs text-slate-405 dark:text-slate-500 font-semibold">Sin sesiones registradas.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {Object.entries(p.byTopic).map(([tid, bt]) => (
                      <div key={tid} className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200/10 rounded-xl px-3 py-2 text-sm flex justify-between">
                        <span className="text-slate-700 dark:text-slate-300 truncate font-semibold">{topicName(tid)}</span>
                        <span className="font-extrabold text-violet-650 dark:text-violet-400">{pct(bt.correct, bt.total)}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </Card>
  )

}
