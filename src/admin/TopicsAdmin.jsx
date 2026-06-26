import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { useTopics } from '../hooks/useTopics'
import { Field, inputCls, Btn, Card, Notice, useFlash } from './ui'

const EMPTY = { name: '', description: '', color: '#1e3a5f', order_index: 0 }

export default function TopicsAdmin() {
  const { user } = useAuth()
  const { topics, loading, refetch } = useTopics()
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState(null)
  const [flash, doFlash] = useFlash()
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  function startEdit(t) {
    setEditingId(t.id)
    setForm({ name: t.name, description: t.description || '', color: t.color || '#1e3a5f', order_index: t.order_index })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function reset() { setEditingId(null); setForm(EMPTY) }

  async function save(e) {
    e.preventDefault()
    setError(null); setBusy(true)
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      color: form.color,
      order_index: Number(form.order_index) || 0,
    }
    let res
    if (editingId) {
      res = await supabase.from('topics').update(payload).eq('id', editingId)
    } else {
      res = await supabase.from('topics').insert({ ...payload, created_by: user.id })
    }
    setBusy(false)
    if (res.error) { setError(res.error.message); return }
    doFlash(editingId ? 'Tema actualizado.' : 'Tema creado.')
    reset(); refetch()
  }

  async function remove(id) {
    if (!confirm('¿Eliminar este tema y todo su contenido asociado?')) return
    const { error } = await supabase.from('topics').delete().eq('id', id)
    if (error) { setError(error.message); return }
    doFlash('Tema eliminado.'); refetch()
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Formulario */}
      <Card className="lg:col-span-2 h-fit">
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-4">{editingId ? 'Editar Tema' : 'Nuevo Tema'}</h2>
        <form onSubmit={save} className="space-y-4">
          <Field label="Nombre">
            <input className={inputCls} required value={form.name} onChange={set('name')} />
          </Field>
          <Field label="Descripción">
            <textarea className={inputCls} rows={3} value={form.description} onChange={set('description')} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Color de etiqueta">
              <input type="color" className="w-full h-11 border border-slate-200 dark:border-slate-700 rounded-xl px-1.5 py-1 bg-slate-50 dark:bg-slate-900 cursor-pointer" value={form.color} onChange={set('color')} />
            </Field>
            <Field label="Orden">
              <input type="number" className={inputCls} value={form.order_index} onChange={set('order_index')} />
            </Field>
          </div>
          <Notice error={error} success={flash} />
          <div className="flex gap-2 pt-2">
            <Btn type="submit" disabled={busy}>{editingId ? 'Guardar' : 'Crear'}</Btn>
            {editingId && <Btn type="button" variant="ghost" onClick={reset}>Cancelar</Btn>}
          </div>
        </form>
      </Card>

      {/* Listado */}
      <div className="lg:col-span-3 space-y-3">
        {loading ? <p className="text-slate-400 dark:text-slate-500 font-semibold">Cargando temas…</p> :
          topics.length === 0 ? <p className="text-slate-450 dark:text-slate-500 font-semibold">No hay temas todavía.</p> :
          topics.map((t) => (
            <Card key={t.id} className="flex items-center gap-3 !p-4">
              <span className="h-10 w-2.5 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-slate-800 dark:text-slate-100 truncate">{t.name}</p>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-450 truncate">{t.description || 'Sin descripción'}</p>
              </div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500">#{t.order_index}</span>
              <Btn variant="ghost" onClick={() => startEdit(t)}>Editar</Btn>
              <Btn variant="danger" onClick={() => remove(t.id)}>Eliminar</Btn>
            </Card>
          ))
        }
      </div>

    </div>
  )
}
