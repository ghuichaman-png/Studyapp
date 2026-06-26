import { useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

// Mezcla aleatoria (Fisher-Yates).
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Hook para obtener un set de preguntas según filtros.
export function useQuestions() {
  // topicId = null -> todos los temas. limit = nº de preguntas de la ronda.
  const fetchRound = useCallback(async ({ topicId, difficulty, limit = 10 }) => {
    let query = supabase.from('questions').select('*').eq('difficulty', difficulty)
    if (topicId) query = query.eq('topic_id', topicId)
    const { data, error } = await query
    if (error) throw error
    return shuffle(data ?? []).slice(0, limit)
  }, [])

  return { fetchRound }
}
