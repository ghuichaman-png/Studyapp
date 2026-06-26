// Utilidades compartidas por los paneles de administración.
import { useState } from 'react'

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-600 mb-1">{label}</span>
      {children}
    </label>
  )
}

export const inputCls =
  'w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-institutional/40'

export function Btn({ children, variant = 'primary', ...props }) {
  const styles = {
    primary: 'bg-institutional text-white hover:bg-institutional-light',
    success: 'bg-success text-white hover:brightness-95',
    danger:  'bg-danger text-white hover:brightness-95',
    ghost:   'bg-slate-100 text-slate-600 hover:bg-slate-200',
  }
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 ${styles[variant]} ${props.className || ''}`}
    >
      {children}
    </button>
  )
}

export function Card({ children, className = '' }) {
  return <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-5 ${className}`}>{children}</div>
}

export function Notice({ error, success }) {
  if (error) return <div className="text-sm bg-danger/10 text-red-700 border border-danger/30 rounded-lg px-3 py-2">{error}</div>
  if (success) return <div className="text-sm bg-success/10 text-green-700 border border-success/30 rounded-lg px-3 py-2">{success}</div>
  return null
}

// Hook para mensajes efímeros de éxito.
export function useFlash() {
  const [msg, setMsg] = useState(null)
  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(null), 2500) }
  return [msg, flash]
}
