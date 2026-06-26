import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { useTopics } from '../hooks/useTopics'
import TopicCard from '../components/TopicCard'
import FlashCard from '../components/FlashCard'

const REVIEWED_KEY = 'reviewedTopics'

function getReviewed() {
  try { return JSON.parse(localStorage.getItem(REVIEWED_KEY) || '{}') } catch { return {} }
}
function markReviewed(topicId) {
  const r = getReviewed(); r[topicId] = true
  localStorage.setItem(REVIEWED_KEY, JSON.stringify(r))
}

const TABS = [
  { key: 'summary', label: 'Resumen', icon: '📝' },
  { key: 'cards',   label: 'Flashcards', icon: '🃏' },
  { key: 'images',  label: 'Imágenes', icon: '🖼️' },
  { key: 'pdfs',    label: 'PDFs', icon: '📄' },
]

export default function Study() {
  const { topics, loading } = useTopics()
  const [params, setParams] = useSearchParams()
  const topicId = params.get('topic')
  const reviewed = getReviewed()

  if (loading) return <CenterMsg>Cargando temas…</CenterMsg>

  if (!topicId) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-institutional">Sección educativa</h1>
        <p className="text-slate-500 mt-1">Elige un tema para estudiar su contenido.</p>
        {topics.length === 0 ? (
          <EmptyState text="Aún no hay temas. Pide al administrador que agregue contenido." />
        ) : (
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topics.map((t) => (
              <TopicCard
                key={t.id} topic={t} reviewed={!!reviewed[t.id]}
                onClick={() => setParams({ topic: t.id })}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  const topic = topics.find((t) => t.id === topicId)
  return <TopicDetail topic={topic} onBack={() => setParams({})} />
}

function TopicDetail({ topic, onBack }) {
  const [tab, setTab] = useState('summary')
  const [visited, setVisited] = useState(new Set(['summary']))
  const [data, setData] = useState({ summary: null, cards: [], images: [], pdfs: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!topic) return
    let active = true
    ;(async () => {
      setLoading(true); setError(null)
      try {
        const [s, c, im, pd] = await Promise.all([
          supabase.from('content_summaries').select('body_text').eq('topic_id', topic.id),
          supabase.from('flashcards').select('*').eq('topic_id', topic.id).order('order_index'),
          supabase.from('topic_images').select('*').eq('topic_id', topic.id).order('order_index'),
          supabase.from('topic_pdfs').select('*').eq('topic_id', topic.id).order('order_index'),
        ])
        if (!active) return
        const firstErr = s.error || c.error || im.error || pd.error
        if (firstErr) setError(firstErr.message)
        setData({
          summary: s.data?.[0]?.body_text || '',
          cards: c.data || [], images: im.data || [], pdfs: pd.data || [],
        })
      } finally { if (active) setLoading(false) }
    })()
    return () => { active = false }
  }, [topic])

  // Marca como revisado al visitar las 4 pestañas.
  useEffect(() => {
    if (visited.size === TABS.length && topic) markReviewed(topic.id)
  }, [visited, topic])

  function selectTab(key) {
    setTab(key)
    setVisited((v) => new Set(v).add(key))
  }

  if (!topic) return <CenterMsg>Tema no encontrado.</CenterMsg>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={onBack} className="text-sm text-slate-500 hover:text-institutional mb-4">← Volver a temas</button>
      <div className="flex items-center gap-3">
        <span className="h-8 w-2 rounded-full" style={{ backgroundColor: topic.color }} />
        <h1 className="text-2xl font-bold text-institutional">{topic.name}</h1>
      </div>
      {topic.description && <p className="text-slate-500 mt-1">{topic.description}</p>}

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b border-slate-200 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key} onClick={() => selectTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors flex items-center gap-1.5 ${
              tab === t.key ? 'border-institutional text-institutional' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <span>{t.icon}</span>{t.label}
            {visited.has(t.key) && <span className="text-success text-xs">●</span>}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? <CenterMsg>Cargando contenido…</CenterMsg> : error ? (
          <ErrorMsg text={error} />
        ) : (
          <>
            {tab === 'summary' && <SummaryTab text={data.summary} />}
            {tab === 'cards'   && <CardsTab cards={data.cards} />}
            {tab === 'images'  && <ImagesTab images={data.images} />}
            {tab === 'pdfs'    && <PdfsTab pdfs={data.pdfs} />}
          </>
        )}
      </div>

      {visited.size === TABS.length && (
        <div className="mt-8 bg-success/10 border border-success/30 text-green-700 rounded-xl px-4 py-3 text-sm font-medium animate-fade-in">
          ✓ Tema revisado por completo.
        </div>
      )}
    </div>
  )
}

/* ---- Pestañas ---- */

// Resumen con acordeón por secciones marcadas con "### " o "## ".
function SummaryTab({ text }) {
  const sections = useMemo(() => parseSections(text), [text])
  const [open, setOpen] = useState(() => sections.map((_, i) => i === 0))

  if (!text) return <EmptyState text="Sin resumen para este tema." />
  if (sections.length <= 1) {
    return <article className="prose-sm whitespace-pre-wrap text-slate-700 leading-relaxed">{text}</article>
  }
  return (
    <div className="space-y-3">
      {sections.map((sec, i) => (
        <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen((o) => o.map((v, j) => (j === i ? !v : v)))}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 text-left font-semibold text-institutional"
          >
            {sec.title}
            <span className={`transition-transform ${open[i] ? 'rotate-180' : ''}`}>▾</span>
          </button>
          {open[i] && (
            <div className="px-4 py-3 whitespace-pre-wrap text-slate-700 text-sm leading-relaxed animate-fade-in">
              {sec.body}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function parseSections(text) {
  if (!text) return []
  const lines = text.split('\n')
  const sections = []
  let current = null
  for (const line of lines) {
    const m = line.match(/^#{2,3}\s+(.*)/)
    if (m) {
      if (current) sections.push(current)
      current = { title: m[1].trim(), body: '' }
    } else if (current) {
      current.body += (current.body ? '\n' : '') + line
    } else if (line.trim()) {
      current = { title: 'Introducción', body: line }
    }
  }
  if (current) sections.push(current)
  return sections.map((s) => ({ ...s, body: s.body.trim() }))
}

function CardsTab({ cards }) {
  const [i, setI] = useState(0)
  useEffect(() => { setI(0) }, [cards])
  if (!cards.length) return <EmptyState text="Sin flashcards para este tema." />
  return (
    <div className="max-w-md mx-auto">
      <FlashCard card={cards[i]} />
      <div className="mt-5 flex items-center justify-between">
        <button
          disabled={i === 0} onClick={() => setI((n) => Math.max(0, n - 1))}
          className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-40 hover:bg-slate-50"
        >← Anterior</button>
        <span className="text-sm font-semibold text-slate-500">{i + 1} / {cards.length}</span>
        <button
          disabled={i === cards.length - 1} onClick={() => setI((n) => Math.min(cards.length - 1, n + 1))}
          className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-40 hover:bg-slate-50"
        >Siguiente →</button>
      </div>
    </div>
  )
}

function ImagesTab({ images }) {
  const [lightbox, setLightbox] = useState(null)
  if (!images.length) return <EmptyState text="Sin imágenes para este tema." />
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((img) => (
          <button key={img.id} onClick={() => setLightbox(img)} className="group">
            <img
              src={img.url} alt={img.title || ''} loading="lazy"
              className="w-full h-40 object-cover rounded-xl border border-slate-200 group-hover:opacity-90 transition"
            />
            {img.title && <p className="mt-1 text-xs text-slate-500 truncate">{img.title}</p>}
          </button>
        ))}
      </div>
      {lightbox && (
        <div onClick={() => setLightbox(null)} className="fixed inset-0 z-50 bg-black/80 grid place-items-center p-4 animate-fade-in cursor-zoom-out">
          <figure className="max-w-3xl">
            <img src={lightbox.url} alt={lightbox.title || ''} className="max-h-[80vh] w-auto rounded-lg" />
            {lightbox.title && <figcaption className="text-center text-white/80 mt-3">{lightbox.title}</figcaption>}
          </figure>
        </div>
      )}
    </>
  )
}

function PdfsTab({ pdfs }) {
  if (!pdfs.length) return <EmptyState text="Sin documentos PDF para este tema." />
  return (
    <ul className="space-y-3">
      {pdfs.map((p) => (
        <li key={p.id} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
          <span className="text-2xl">📄</span>
          <span className="flex-1 font-medium text-slate-700 truncate">{p.filename}</span>
          <a
            href={p.url} target="_blank" rel="noopener noreferrer"
            className="bg-institutional text-white text-sm px-4 py-2 rounded-lg hover:bg-institutional-light transition"
          >Descargar</a>
        </li>
      ))}
    </ul>
  )
}

/* ---- Auxiliares de UI ---- */
function CenterMsg({ children }) {
  return <div className="text-center text-slate-400 py-16">{children}</div>
}
function EmptyState({ text }) {
  return <div className="text-center text-slate-400 py-16 border-2 border-dashed border-slate-200 rounded-2xl">{text}</div>
}
function ErrorMsg({ text }) {
  return <div className="bg-danger/10 text-red-700 border border-danger/30 rounded-xl px-4 py-3 text-sm">{text}</div>
}
