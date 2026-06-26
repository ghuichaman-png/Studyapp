import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useTopics } from '../hooks/useTopics'
import { Field, inputCls, Btn, Card, Notice, useFlash } from './ui'

// Panel de contenido educativo: resumen + CRUD de flashcards, imágenes y PDFs.
export default function ContentAdmin() {
  const { topics, loading } = useTopics()
  const [topicId, setTopicId] = useState('')

  useEffect(() => {
    if (!topicId && topics.length) setTopicId(topics[0].id)
  }, [topics, topicId])

  if (loading) return <p className="text-slate-400 dark:text-slate-500 font-semibold">Cargando…</p>
  if (!topics.length) return <p className="text-slate-405 dark:text-slate-500 font-semibold">Crea un tema primero en la pestaña «Temas».</p>

  return (
    <div className="space-y-6">
      <Card className="!p-4">
        <Field label="Tema a editar">
          <select className={inputCls} value={topicId} onChange={(e) => setTopicId(e.target.value)}>
            {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </Field>
      </Card>

      {topicId && (
        <>
          <SummaryEditor topicId={topicId} />
          <FlashcardsEditor topicId={topicId} />
          <SimpleListEditor
            topicId={topicId} table="topic_images" title="Imágenes" icon="🖼️"
            fields={[{ k: 'url', label: 'URL de la imagen' }, { k: 'title', label: 'Título' }]}
            display={(r) => r.title || r.url}
          />
          <SimpleListEditor
            topicId={topicId} table="topic_pdfs" title="PDFs" icon="📄"
            fields={[{ k: 'url', label: 'URL del PDF' }, { k: 'filename', label: 'Nombre de archivo' }]}
            display={(r) => r.filename || r.url}
          />
        </>
      )}
    </div>
  )
}

/* ---- Resumen ---- */
function SummaryEditor({ topicId }) {
  const [text, setText] = useState('')
  const [rowId, setRowId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [flash, doFlash] = useFlash()

  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true)
      const { data } = await supabase.from('content_summaries')
        .select('id, body_text').eq('topic_id', topicId).maybeSingle()
      if (!active) return
      setRowId(data?.id || null); setText(data?.body_text || ''); setLoading(false)
    })()
    return () => { active = false }
  }, [topicId])

  async function save() {
    setError(null)
    const payload = { topic_id: topicId, body_text: text, updated_at: new Date().toISOString() }
    let res
    if (rowId) res = await supabase.from('content_summaries').update(payload).eq('id', rowId)
    else res = await supabase.from('content_summaries').insert(payload).select('id').single()
    if (res.error) { setError(res.error.message); return }
    if (res.data?.id) setRowId(res.data.id)
    doFlash('Resumen guardado.')
  }

  return (
    <Card>
      <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-3">📝 Resumen</h2>
      {loading ? <p className="text-slate-400 dark:text-slate-500 font-semibold">Cargando resumen…</p> : (
        <>
          <textarea
            className={inputCls + ' font-mono text-sm'} rows={8} value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Usa ## o ### para crear secciones de acordeón."
          />
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 font-medium">Tip: encabezados con <code>##</code> o <code>###</code> se muestran como acordeón.</p>
          <div className="mt-4 flex items-center gap-3">
            <Btn onClick={save}>Guardar resumen</Btn>
            <Notice error={error} success={flash} />
          </div>
        </>
      )}
    </Card>
  )
}

/* ---- Flashcards ---- */
function FlashcardsEditor({ topicId }) {
  const [cards, setCards] = useState([])
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [error, setError] = useState(null)
  const [flash, doFlash] = useFlash()

  async function load() {
    const { data } = await supabase.from('flashcards').select('*').eq('topic_id', topicId).order('order_index')
    setCards(data || [])
  }
  useEffect(() => { load() }, [topicId])

  async function add(e) {
    e.preventDefault(); setError(null)
    const { error } = await supabase.from('flashcards').insert({
      topic_id: topicId, front: front.trim(), back: back.trim(), order_index: cards.length + 1,
    })
    if (error) { setError(error.message); return }
    setFront(''); setBack(''); doFlash('Flashcard agregada.'); load()
  }
  async function remove(id) {
    if (!confirm('¿Eliminar esta flashcard?')) return
    await supabase.from('flashcards').delete().eq('id', id); load()
  }

  return (
    <Card>
      <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-3">🃏 Flashcards <span className="text-sm font-bold text-slate-400 dark:text-slate-500">({cards.length})</span></h2>
      <form onSubmit={add} className="grid sm:grid-cols-2 gap-3">
        <Field label="Frente (pregunta)">
          <input className={inputCls} required value={front} onChange={(e) => setFront(e.target.value)} />
        </Field>
        <Field label="Reverso (respuesta)">
          <input className={inputCls} required value={back} onChange={(e) => setBack(e.target.value)} />
        </Field>
        <div className="sm:col-span-2 flex items-center gap-3 pt-2">
          <Btn type="submit" variant="success">Agregar flashcard</Btn>
          <Notice error={error} success={flash} />
        </div>
      </form>
      {cards.length > 0 && (
        <ul className="mt-4 space-y-2 max-h-64 overflow-y-auto">
          {cards.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/10 rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300">
              <span className="flex-1 truncate"><strong>{c.front}</strong> → {c.back}</span>
              <button type="button" className="text-red-500 dark:text-red-400 hover:text-red-650 font-bold px-2 py-1 transition-colors" onClick={() => remove(c.id)}>✕</button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

/* ---- Lista genérica (imágenes / PDFs) ---- */
function SimpleListEditor({ topicId, table, title, icon, fields, display }) {
  const [rows, setRows] = useState([])
  const [form, setForm] = useState({})
  const [error, setError] = useState(null)
  const [flash, doFlash] = useFlash()

  async function load() {
    const { data } = await supabase.from(table).select('*').eq('topic_id', topicId).order('order_index')
    setRows(data || [])
  }
  useEffect(() => { load(); setForm({}) }, [topicId])

  async function add(e) {
    e.preventDefault(); setError(null)
    const payload = { topic_id: topicId, order_index: rows.length + 1 }
    for (const f of fields) payload[f.k] = (form[f.k] || '').trim()
    const { error } = await supabase.from(table).insert(payload)
    if (error) { setError(error.message); return }
    setForm({}); doFlash('Agregado.'); load()
  }
  async function remove(id) {
    if (!confirm('¿Eliminar este elemento?')) return
    await supabase.from(table).delete().eq('id', id); load()
  }

  return (
    <Card>
      <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-3">{icon} {title} <span className="text-sm font-bold text-slate-400 dark:text-slate-500">({rows.length})</span></h2>
      <form onSubmit={add} className="grid sm:grid-cols-2 gap-3">
        {fields.map((f) => (
          <Field key={f.k} label={f.label}>
            <input className={inputCls} required={f.k === 'url'} value={form[f.k] || ''}
              onChange={(e) => setForm((s) => ({ ...s, [f.k]: e.target.value }))} />
          </Field>
        ))}
        <div className="sm:col-span-2 flex items-center gap-3 pt-2">
          <Btn type="submit" variant="success">Agregar</Btn>
          <Notice error={error} success={flash} />
        </div>
      </form>
      {rows.length > 0 && (
        <ul className="mt-4 space-y-2">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/10 rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-slate-350">
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex-1 truncate text-violet-600 dark:text-violet-400 hover:underline font-semibold">{display(r)}</a>
              <button type="button" className="text-red-500 dark:text-red-400 hover:text-red-650 font-bold px-2 py-1 transition-colors" onClick={() => remove(r.id)}>✕</button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

