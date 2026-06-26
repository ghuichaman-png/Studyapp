import { useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

/**
 * Lógica de insignias. Tras cada ronda se evalúan las condiciones y se
 * insertan en user_badges las que correspondan (idempotente por unique).
 *
 * Insignias:
 *  first_round   -> completar 1 ronda
 *  streak_5      -> racha máxima >= 5 en alguna ronda
 *  streak_10     -> racha máxima >= 10
 *  perfect_round -> 10/10 en una ronda
 *  all_topics    -> el usuario estudió todos los temas (localStorage)
 *  topic_master  -> >=80% en dificultad 'advanced'
 *  fifty_q       -> >=50 preguntas respondidas en total
 *  points_1000   -> puntaje acumulado >= 1000
 */
export function useBadges() {
  const fetchUserBadges = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('user_badges')
      .select('badge_key, unlocked_at')
      .eq('user_id', userId)
    if (error) throw error
    return data ?? []
  }, [])

  // Evalúa y desbloquea. Devuelve array de badge_keys recién desbloqueadas.
  const evaluateAfterRound = useCallback(async ({ userId, lastRound, studiedAllTopics }) => {
    // 1) Estado agregado del usuario.
    const { data: sessions, error: sErr } = await supabase
      .from('game_sessions')
      .select('score, total_questions, correct_answers, streak_max, difficulty')
      .eq('user_id', userId)
    if (sErr) throw sErr

    const totalQuestions = sessions.reduce((s, r) => s + (r.total_questions || 0), 0)
    const totalPoints = sessions.reduce((s, r) => s + (r.score || 0), 0)
    const bestStreak = sessions.reduce((m, r) => Math.max(m, r.streak_max || 0), 0)

    // Mejor % en avanzado.
    const advanced = sessions.filter((r) => r.difficulty === 'advanced' && r.total_questions > 0)
    const bestAdvancedPct = advanced.reduce(
      (m, r) => Math.max(m, (r.correct_answers / r.total_questions) * 100), 0)

    // 2) Insignias ya obtenidas (para no reinsertar).
    const existing = new Set((await fetchUserBadges(userId)).map((b) => b.badge_key))

    // 3) Condiciones.
    const toUnlock = []
    const consider = (key, condition) => {
      if (condition && !existing.has(key)) toUnlock.push(key)
    }

    consider('first_round',   sessions.length >= 1)
    consider('streak_5',      bestStreak >= 5)
    consider('streak_10',     bestStreak >= 10)
    consider('perfect_round', lastRound && lastRound.correct_answers === lastRound.total_questions && lastRound.total_questions > 0)
    consider('all_topics',    !!studiedAllTopics)
    consider('topic_master',  bestAdvancedPct >= 80)
    consider('fifty_q',       totalQuestions >= 50)
    consider('points_1000',   totalPoints >= 1000)

    if (toUnlock.length === 0) return []

    const rows = toUnlock.map((badge_key) => ({ user_id: userId, badge_key }))
    const { error: iErr } = await supabase
      .from('user_badges')
      .upsert(rows, { onConflict: 'user_id,badge_key', ignoreDuplicates: true })
    if (iErr) throw iErr

    return toUnlock
  }, [fetchUserBadges])

  return { fetchUserBadges, evaluateAfterRound }
}
