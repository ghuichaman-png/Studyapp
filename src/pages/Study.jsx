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
  const { user, profile } = useAuth()
  const { topics, loading } = useTopics()
  const [params, setParams] = useSearchParams()
  const topicId = params.get('topic')
  const reviewed = getReviewed()

  // Estadísticas del usuario para gamificación (Duolingo style)
  const [stats, setStats] = useState({ score: 0, badges: 0, accuracy: 0 })

  // Estado para la categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState('Acreditación HPM')

  // Obtener categorías únicas de los temas
  const categories = useMemo(() => {
    const cats = new Set()
    topics.forEach((t) => {
      if (t.category) cats.add(t.category)
    })
    // Siempre nos aseguramos de tener al menos 'Acreditación HPM'
    if (cats.size === 0) {
      cats.add('Acreditación HPM')
    }
    return Array.from(cats)
  }, [topics])

  // Filtrar temas según la categoría seleccionada
  const filteredTopics = useMemo(() => {
    if (selectedCategory === 'Todos') return topics
    return topics.filter((t) => (t.category || 'Acreditación HPM') === selectedCategory)
  }, [topics, selectedCategory])

  useEffect(() => {
    if (!user) return
    let active = true
    ;(async () => {
      try {
        // 1) Puntos y precisión desde game_sessions
        const { data: sessions } = await supabase
          .from('game_sessions')
          .select('score, total_questions, correct_answers')
          .eq('user_id', user.id)
        
        if (!active) return

        const totalPoints = (sessions || []).reduce((sum, s) => sum + s.score, 0)
        const totalQuestions = (sessions || []).reduce((sum, s) => sum + s.total_questions, 0)
        const totalCorrect = (sessions || []).reduce((sum, s) => sum + s.correct_answers, 0)
        const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0

        // 2) Insignias desde user_badges
        const { data: badges } = await supabase
          .from('user_badges')
          .select('badge_key')
          .eq('user_id', user.id)

        if (!active) return

        setStats({
          score: totalPoints,
          badges: badges ? badges.length : 0,
          accuracy: accuracy
        })
      } catch (err) {
        console.error('Error fetching stats:', err)
      }
    })()
    return () => { active = false }
  }, [user])

  if (loading) return <CenterMsg>Cargando temas…</CenterMsg>

  if (!topicId) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-slide-up">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-100 via-white to-slate-100 dark:from-slate-900/60 dark:via-slate-800/40 dark:to-slate-900/60 border border-slate-200/50 dark:border-slate-800 p-8 sm:p-10 rounded-[32px] text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 transition-all shadow-sm">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none text-slate-800 dark:text-slate-100">
              ¡Hola,{' '}
              <span className="bg-gradient-to-r from-sky-500 to-violet-500 dark:from-sky-400 dark:to-violet-400 bg-clip-text text-transparent">
                {profile?.username || 'Jugador'}
              </span>! 👋
            </h1>
            
            {categories.length > 1 ? (
              <div className="relative inline-block text-left mt-1.5">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white/80 dark:bg-slate-805/85 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold rounded-xl pl-3 pr-8 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/60 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all cursor-pointer appearance-none shadow-sm font-sans"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 0.6rem center',
                    backgroundSize: '1rem',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  <option value="Todos">📚 Todos los temas</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>📁 {cat}</option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 font-bold tracking-wide text-sm sm:text-base mt-1.5 flex items-center gap-1.5 justify-center sm:justify-start">
                <span className="text-sky-500">📁</span> Acreditación HPM
              </p>
            )}
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0 sm:w-auto w-full max-w-md mx-auto sm:mx-0">
            {/* Puntos */}
            <div className="bg-white dark:bg-slate-800/80 border border-amber-400/20 dark:border-amber-400/10 p-3 sm:p-4 rounded-2xl text-center shadow-sm hover:border-amber-400/50 dark:hover:border-amber-400/30 hover:-translate-y-0.5 transition-all duration-200">
              <span className="text-2xl" title="Puntos acumulados">🪙</span>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Puntos</p>
              <p className="text-lg sm:text-xl font-black text-amber-500 dark:text-amber-400">{stats.score}</p>
            </div>
            {/* Precisión */}
            <div className="bg-white dark:bg-slate-800/80 border border-sky-400/20 dark:border-sky-400/10 p-3 sm:p-4 rounded-2xl text-center shadow-sm hover:border-sky-400/50 dark:hover:border-sky-400/30 hover:-translate-y-0.5 transition-all duration-200">
              <span className="text-2xl" title="Precisión general">🎯</span>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Precisión</p>
              <p className="text-lg sm:text-xl font-black text-sky-500 dark:text-sky-400">{stats.accuracy}%</p>
            </div>
            {/* Insignias */}
            <div className="bg-white dark:bg-slate-800/80 border border-green-400/20 dark:border-green-400/10 p-3 sm:p-4 rounded-2xl text-center shadow-sm hover:border-green-400/50 dark:hover:border-green-400/30 hover:-translate-y-0.5 transition-all duration-200">
              <span className="text-2xl" title="Insignias ganadas">🏅</span>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Logros</p>
              <p className="text-lg sm:text-xl font-black text-green-500 dark:text-green-400">{stats.badges}</p>
            </div>
          </div>
        </div>

        {/* Topics List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Sección educativa</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Elige un tema para estudiar su contenido.</p>
            </div>
          </div>
          
          {filteredTopics.length === 0 ? (
            <EmptyState text="Aún no hay temas de estudio disponibles para esta categoría." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopics.map((t) => (
                <TopicCard
                  key={t.id} topic={t} reviewed={!!reviewed[t.id]}
                  onClick={() => setParams({ topic: t.id })}
                />
              ))}
            </div>
          )}
        </div>

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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-slide-up">
      
      {/* Back button */}
      <button 
        onClick={onBack} 
        className="text-sm font-semibold text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1.5 transition-colors"
      >
        <span>←</span> Volver a temas
      </button>

      {/* Header Topic Detail */}
      <div className="flex items-center gap-3.5">
        <span className="h-10 w-2.5 rounded-full shrink-0" style={{ backgroundColor: topic.color }} />
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight">{topic.name}</h1>
          {topic.description && <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1.5">{topic.description}</p>}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800/80 overflow-x-auto pb-px">
        {TABS.map((t) => (
          <button
            key={t.key} onClick={() => selectTab(t.key)}
            className={`px-4 py-3 text-sm font-bold border-b-2 -mb-px transition-all duration-150 flex items-center gap-2 whitespace-nowrap ${
              tab === t.key 
                ? 'border-sky-500 text-sky-600 dark:border-sky-400 dark:text-sky-400' 
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
            {visited.has(t.key) && (
              <span className="text-[10px] bg-green-500/10 dark:bg-green-400/20 text-green-600 dark:text-green-400 font-bold px-1.5 py-0.5 rounded-full shadow-sm">✓</span>
            )}
          </button>
        ))}
      </div>

      {/* Content wrapper */}
      <div className="mt-4 min-h-[300px]">
        {loading ? (
          <CenterMsg>Cargando contenido del tema…</CenterMsg>
        ) : error ? (
          <ErrorMsg text={error} />
        ) : (
          <div className="animate-fade-in">
            {tab === 'summary' && <SummaryTab text={data.summary} />}
            {tab === 'cards'   && <CardsTab cards={data.cards} />}
            {tab === 'images'  && <ImagesTab images={data.images} />}
            {tab === 'pdfs'    && <PdfsTab pdfs={data.pdfs} />}
          </div>
        )}
      </div>

      {/* Completed topic confirmation banner */}
      {visited.size === TABS.length && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 rounded-2xl px-5 py-4 flex items-center gap-3 text-sm font-bold animate-fade-in shadow-sm">
          <span className="text-xl">🏆</span>
          <span>¡Tema completado! Has estudiado todas las secciones educativas de este tema.</span>
        </div>
      )}

    </div>
  )
}

/* ---- Ayudantes de Formateo de Markdown ---- */

function parseInlineStyles(text) {
  if (!text) return '';
  // Separamos por negritas
  const boldParts = text.split('**');
  return boldParts.flatMap((boldPart, bIdx) => {
    const isBold = bIdx % 2 === 1;
    // Separamos por cursivas
    const italicParts = boldPart.split('*');
    const elements = italicParts.map((italicPart, iIdx) => {
      const isItalic = iIdx % 2 === 1;
      if (isItalic) {
        return <em key={`${bIdx}-${iIdx}`} className="italic font-semibold">{italicPart}</em>;
      }
      return italicPart;
    });

    if (isBold) {
      return (
        <strong key={bIdx} className="font-extrabold text-slate-800 dark:text-white">
          {elements}
        </strong>
      );
    }
    return elements;
  });
}

function parseMarkdownToBlocks(text) {
  if (!text) return [];
  const lines = text.split('\n');
  const blocks = [];
  let currentBlock = null;

  for (let line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      continue;
    }

    const indentMatch = line.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1].length : 0;

    // Detectar viñeta desordenada (* o -)
    const ulMatch = line.match(/^(\s*)([\*\-])\s+(.*)/);
    if (ulMatch) {
      const content = ulMatch[3];
      if (currentBlock && currentBlock.type === 'ul') {
        currentBlock.items.push({ indent, content });
      } else {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = { type: 'ul', items: [{ indent, content }] };
      }
      continue;
    }

    // Detectar lista numerada (e.g. 1.)
    const olMatch = line.match(/^(\s*)(\d+)\.\s+(.*)/);
    if (olMatch) {
      const content = olMatch[3];
      if (currentBlock && currentBlock.type === 'ol') {
        currentBlock.items.push({ indent, content });
      } else {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = { type: 'ol', items: [{ indent, content }] };
      }
      continue;
    }

    // Línea de párrafo normal
    if (currentBlock && currentBlock.type === 'p') {
      currentBlock.lines.push(trimmedLine);
    } else {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = { type: 'p', indent, lines: [trimmedLine] };
    }
  }

  if (currentBlock) {
    blocks.push(currentBlock);
  }

  return blocks;
}

function MarkdownContent({ text }) {
  const blocks = useMemo(() => parseMarkdownToBlocks(text), [text]);

  return (
    <div className="space-y-3">
      {blocks.map((block, bIdx) => {
        if (block.type === 'p') {
          return (
            <p
              key={bIdx}
              className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium text-sm sm:text-base"
              style={{ marginLeft: block.indent ? `${block.indent * 6}px` : undefined }}
            >
              {parseInlineStyles(block.lines.join(' '))}
            </p>
          );
        }

        if (block.type === 'ul') {
          return (
            <ul key={bIdx} className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-350 text-sm sm:text-base">
              {block.items.map((item, iIdx) => (
                <li
                  key={iIdx}
                  className="font-medium leading-relaxed"
                  style={{ marginLeft: item.indent ? `${item.indent * 6}px` : undefined }}
                >
                  {parseInlineStyles(item.content)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'ol') {
          return (
            <ol key={bIdx} className="list-decimal pl-5 space-y-2 text-slate-600 dark:text-slate-350 text-sm sm:text-base">
              {block.items.map((item, iIdx) => (
                <li
                  key={iIdx}
                  className="font-medium leading-relaxed"
                  style={{ marginLeft: item.indent ? `${item.indent * 6}px` : undefined }}
                >
                  {parseInlineStyles(item.content)}
                </li>
              ))}
            </ol>
          );
        }

        return null;
      })}
    </div>
  );
}

/* ---- Pestañas ---- */

// Resumen con acordeón por secciones marcadas con "### " o "## ".
function SummaryTab({ text }) {
  const sections = useMemo(() => parseSections(text), [text])
  const [open, setOpen] = useState(() => sections.map((_, i) => i === 0))

  if (!text) return <EmptyState text="Aún no se ha cargado un resumen para este tema." />
  if (sections.length <= 1) {
    return (
      <article className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl text-slate-700 dark:text-slate-300 leading-relaxed font-medium text-sm sm:text-base transition-colors duration-200">
        <MarkdownContent text={text} />
      </article>
    )
  }
  
  return (
    <div className="space-y-3.5">
      {sections.map((sec, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden transition-all shadow-sm">
          <button
            onClick={() => setOpen((o) => o.map((v, j) => (j === i ? !v : v)))}
            className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/40 text-left font-bold text-slate-800 dark:text-slate-200 transition-colors"
          >
            <span className="text-base font-bold">{sec.title}</span>
            <span className={`transition-transform duration-200 text-lg ${open[i] ? 'rotate-180 text-sky-500' : 'text-slate-400'}`}>▾</span>
          </button>
          {open[i] && (
            <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700/40 text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium animate-fade-in">
              <MarkdownContent text={sec.body} />
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
  if (!cards.length) return <EmptyState text="Aún no hay flashcards disponibles para este tema." />
  
  return (
    <div className="max-w-md mx-auto space-y-6">
      <FlashCard card={cards[i]} />
      
      {/* Navegación de Flashcards */}
      <div className="flex items-center justify-between gap-4">
        <button
          disabled={i === 0} 
          onClick={() => setI((n) => Math.max(0, n - 1))}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors shadow-sm"
        >
          ← Anterior
        </button>
        
        <span className="bg-sky-500/10 dark:bg-sky-400/15 text-sky-600 dark:text-sky-400 text-sm font-extrabold px-3 py-1.5 rounded-full shadow-sm">
          {i + 1} / {cards.length}
        </span>
        
        <button
          disabled={i === cards.length - 1} 
          onClick={() => setI((n) => Math.min(cards.length - 1, n + 1))}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors shadow-sm"
        >
          Siguiente →
        </button>
      </div>
    </div>
  )
}

function ImagesTab({ images }) {
  const [lightbox, setLightbox] = useState(null)
  if (!images.length) return <EmptyState text="Aún no hay imágenes en la galería para este tema." />
  
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
        {images.map((img) => (
          <button 
            key={img.id} 
            onClick={() => setLightbox(img)} 
            className="group focus:outline-none flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="overflow-hidden w-full h-40 bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
              <img
                src={resolveImageUrl(img.url)} alt={img.title || ''} loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            {img.title && (
              <div className="p-3 w-full border-t border-slate-100 dark:border-slate-700/40 shrink-0">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate text-left">{img.title}</p>
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Lightbox con backdrop blur */}
      {lightbox && (
        <div 
          onClick={() => setLightbox(null)} 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md grid place-items-center p-4 animate-fade-in cursor-zoom-out"
        >
          <figure className="max-w-3xl flex flex-col items-center">
            <img src={resolveImageUrl(lightbox.url)} alt={lightbox.title || ''} className="max-h-[75vh] max-w-full rounded-2xl border border-white/10 shadow-2xl animate-pop-in" />
            {lightbox.title && <figcaption className="text-center text-slate-200 font-bold text-base mt-4 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-xl">{lightbox.title}</figcaption>}
          </figure>
        </div>
      )}
    </>
  )
}

function PdfsTab({ pdfs }) {
  if (!pdfs.length) return <EmptyState text="Aún no hay archivos PDF de descarga para este tema." />
  
  return (
    <ul className="space-y-3.5 max-w-2xl mx-auto">
      {pdfs.map((p) => (
        <li 
          key={p.id} 
          className="flex items-center gap-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800/80 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <span className="text-3xl shrink-0">📄</span>
          <span className="flex-1 font-bold text-slate-700 dark:text-slate-200 truncate">{p.filename}</span>
          <a
            href={p.url} target="_blank" rel="noopener noreferrer"
            className="bg-sky-500 hover:bg-sky-600 dark:bg-sky-400 dark:hover:bg-sky-300 text-white dark:text-slate-950 text-xs sm:text-sm font-extrabold px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm active:scale-[0.98] shrink-0"
          >
            Descargar
          </a>
        </li>
      ))}
    </ul>
  )
}

/* ---- Auxiliares de UI ---- */
function CenterMsg({ children }) {
  return (
    <div className="text-center py-20 flex flex-col items-center justify-center gap-3">
      <div className="animate-spin text-3xl text-sky-500 font-bold">⏳</div>
      <p className="text-slate-400 dark:text-slate-500 font-bold text-base">{children}</p>
    </div>
  )
}
function EmptyState({ text }) {
  return (
    <div className="text-center text-slate-400 dark:text-slate-500 py-16 px-6 border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 rounded-3xl flex flex-col items-center justify-center gap-2 max-w-md mx-auto shadow-sm">
      <span className="text-3xl">📭</span>
      <p className="text-sm font-semibold">{text}</p>
    </div>
  )
}
function ErrorMsg({ text }) {
  return (
    <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30 rounded-2xl px-5 py-4 text-sm font-bold shadow-sm animate-shake">
      ⚠️ {text}
    </div>
  )
}

function resolveImageUrl(url) {
  if (!url) return '';
  // Convertir enlaces de visualización de Google Drive a URLs de descarga directa (imagen cruda)
  const driveRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/(?:file\/d\/|open\?id=))([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return url;
}
