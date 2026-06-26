import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useTopics } from '../hooks/useTopics'
import { Field, inputCls, Btn, Card, Notice, useFlash } from './ui'

const DIFFS = [
  { v: 'basic', l: 'Básico' },
  { v: 'intermediate', l: 'Intermedio' },
  { v: 'advanced', l: 'Avanzado' },
]
const OPTS = ['a', 'b', 'c', 'd']
const EMPTY = {
  topic_id: '', text: '', option_a: '', option_b: '', option_c: '', option_d: '',
  correct_option: 'a', difficulty: 'basic', explanation: '',
}

export default function QuestionsAdmin() {
  const { topics } = useTopics()
  const [questions, setQuestions] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState(null)
  const [flash, doFlash] = useFlash()
  const [filterTopic, setFilterTopic] = useState('all')
  const fileRef = useRef(null)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const topicName = (id) => topics.find((t) => t.id === id)?.name || '—'

  async function load() {
    const { data, error } = await supabase.from('questions').select('*').order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setQuestions(data || [])
  }
  useEffect(() => { load() }, [])
  useEffect(() => { if (!form.topic_id && topics.length) setForm((f) => ({ ...f, topic_id: topics[0].id })) }, [topics])

  function reset() { setEditingId(null); setForm((f) => ({ ...EMPTY, topic_id: topics[0]?.id || '' })) }
  function startEdit(q) {
    setEditingId(q.id); setForm({ ...q })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function save(e) {
    e.preventDefault(); setError(null)
    if (!form.explanation.trim()) { setError('La explicación es obligatoria.'); return }
    const payload = {
      topic_id: form.topic_id, text: form.text.trim(),
      option_a: form.option_a.trim(), option_b: form.option_b.trim(),
      option_c: form.option_c.trim(), option_d: form.option_d.trim(),
      correct_option: form.correct_option, difficulty: form.difficulty,
      explanation: form.explanation.trim(),
    }
    const res = editingId
      ? await supabase.from('questions').update(payload).eq('id', editingId)
      : await supabase.from('questions').insert(payload)
    if (res.error) { setError(res.error.message); return }
    doFlash(editingId ? 'Pregunta actualizada.' : 'Pregunta creada.')
    reset(); load()
  }

  async function remove(id) {
    if (!confirm('¿Eliminar esta pregunta?')) return
    await supabase.from('questions').delete().eq('id', id); load()
  }

  // --- Exportar / Importar JSON ---
  function exportJson() {
    const exportData = questions.map(({ id, created_at, ...rest }) => rest)
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `preguntas_${new Date().toISOString().slice(0, 10)}.json`
    a.click(); URL.revokeObjectURL(url)
  }

  async function importJson(e) {
    const file = e.target.files?.[0]; if (!file) return
    setError(null)
    try {
      const parsed = JSON.parse(await file.text())
      if (!Array.isArray(parsed)) throw new Error('El JSON debe ser un arreglo de preguntas.')
      const rows = parsed.map((q) => ({
        topic_id: q.topic_id, text: q.text,
        option_a: q.option_a, option_b: q.option_b, option_c: q.option_c, option_d: q.option_d,
        correct_option: q.correct_option, difficulty: q.difficulty || 'basic',
        explanation: q.explanation || '',
      }))
      const { error } = await supabase.from('questions').insert(rows)
      if (error) throw error
      doFlash(`${rows.length} preguntas importadas.`); load()
    } catch (err) {
      setError('Error al importar: ' + err.message)
    } finally {
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const filtered = filterTopic === 'all' ? questions : questions.filter((q) => q.topic_id === filterTopic)

  return (
    <div className="space-y-6">
      {/* Formulario */}
      <Card>
        <h2 className="font-bold text-institutional mb-4">{editingId ? 'Editar pregunta' : 'Nueva pregunta'}</h2>
        <form onSubmit={save} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Tema">
              <select className={inputCls} value={form.topic_id} onChange={set('topic_id')} required>
                <option value="" disabled>Selecciona…</option>
                {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </Field>
            <Field label="Dificultad">
              <select className={inputCls} value={form.difficulty} onChange={set('difficulty')}>
                {DIFFS.map((d) => <option key={d.v} value={d.v}>{d.l}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Texto de la pregunta">
            <textarea className={inputCls} rows={2} required value={form.text} onChange={set('text')} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-3">
            {OPTS.map((o) => (
              <Field key={o} label={`Opción ${o.toUpperCase()}`}>
                <div className="flex items-center gap-2">
                  <input type="radio" name="correct" checked={form.correct_option === o}
                    onChange={() => setForm((f) => ({ ...f, correct_option: o }))}
                    title="Marcar como correcta" className="accent-success w-4 h-4" />
                  <input className={inputCls} required value={form[`option_${o}`]} onChange={set(`option_${o}`)} />
                </div>
              </Field>
            ))}
          </div>
          <p className="text-xs text-slate-400">El radio marcado indica la respuesta correcta (actual: <strong className="uppercase">{form.correct_option}</strong>).</p>
          <Field label="Explicación (obligatoria)">
            <textarea className={inputCls} rows={2} required value={form.explanation} onChange={set('explanation')} />
          </Field>
          <Notice error={error} success={flash} />
          <div className="flex gap-2">
            <Btn type="submit">{editingId ? 'Guardar cambios' : 'Crear pregunta'}</Btn>
            {editingId && <Btn type="button" variant="ghost" onClick={reset}>Cancelar</Btn>}
          </div>
        </form>
      </Card>

      {/* Import/Export */}
      <Card className="flex flex-wrap items-center gap-3 !py-4">
        <span className="font-semibold text-slate-600 text-sm mr-auto">Banco: {questions.length} preguntas</span>
        <Btn variant="ghost" onClick={exportJson}>⬇ Exportar JSON</Btn>
        <input ref={fileRef} type="file" accept="application/json" onChange={importJson} className="hidden" id="importInput" />
        <Btn variant="success" onClick={() => fileRef.current?.click()}>⬆ Importar JSON</Btn>
      </Card>

      {/* Listado */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-institutional">Listado</h2>
          <select className={inputCls + ' !w-auto'} value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)}>
            <option value="all">Todos los temas</option>
            {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          {filtered.length === 0 ? <p className="text-slate-400 text-sm">Sin preguntas.</p> :
            filtered.map((q) => (
              <div key={q.id} className="flex items-start gap-3 bg-slate-50 rounded-lg px-3 py-2 text-sm">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-700">{q.text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {topicName(q.topic_id)} · {DIFFS.find((d) => d.v === q.difficulty)?.l} · Correcta: <strong className="uppercase">{q.correct_option}</strong>
                  </p>
                </div>
                <Btn variant="ghost" onClick={() => startEdit(q)}>Editar</Btn>
                <Btn variant="danger" onClick={() => remove(q.id)}>✕</Btn>
              </div>
            ))
          }
        </div>
      </Card>
    </div>
  )
}
