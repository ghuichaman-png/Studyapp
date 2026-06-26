// Utilidades compartidas por los paneles de administración.
import { useState } from 'react'

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-1.5">{label}</span>
      {children}
    </label>
  )
}

export const inputCls =
  'w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 dark:focus:border-violet-400 transition-all font-semibold'

export function Btn({ children, variant = 'primary', ...props }) {
  const styles = {
    primary: 'bg-gradient-to-r from-violet-500 to-violet-600 dark:from-violet-400 dark:to-violet-500 text-white shadow-[0_4px_0_0_#7c3aed] dark:shadow-[0_4px_0_0_#5b21b6] hover:brightness-105 active:translate-y-0.5 active:shadow-[0_0px_0_0_transparent] border-b border-transparent',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-[0_4px_0_0_#16a34a] hover:brightness-105 active:translate-y-0.5 active:shadow-[0_0px_0_0_transparent] border-b border-transparent',
    danger:  'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-[0_4px_0_0_#dc2626] hover:brightness-105 active:translate-y-0.5 active:shadow-[0_0px_0_0_transparent] border-b border-transparent',
    ghost:   'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-[0_4px_0_0_#cbd5e1] dark:shadow-[0_4px_0_0_#475569] hover:brightness-105 active:translate-y-0.5 active:shadow-[0_0px_0_0_transparent] border-b border-transparent',
  }
  return (
    <button
      {...props}
      className={`px-4 py-2.5 rounded-xl text-sm font-extrabold uppercase tracking-wide transition-all disabled:opacity-50 ${styles[variant]} ${props.className || ''}`}
    >
      {children}
    </button>
  )
}

export function Card({ children, className = '' }) {
  return <div className={`bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50 p-6 ${className}`}>{children}</div>
}

export function Notice({ error, success }) {
  if (error) return <div className="text-sm bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20 rounded-xl px-4 py-3 flex gap-2 items-center font-semibold"><span>⚠️</span><span>{error}</span></div>
  if (success) return <div className="text-sm bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 rounded-xl px-4 py-3 flex gap-2 items-center font-semibold"><span>✓</span><span>{success}</span></div>
  return null
}

// Hook para mensajes efímeros de éxito.
export function useFlash() {
  const [msg, setMsg] = useState(null)
  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(null), 2500) }
  return [msg, flash]
}

