import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

// Devuelve la lista de temas ordenada. Maneja loading y error.
export function useTopics() {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTopics = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .order('order_index', { ascending: true })
    if (error) setError(error.message)
    else setTopics(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchTopics() }, [fetchTopics])

  return { topics, loading, error, refetch: fetchTopics }
}
