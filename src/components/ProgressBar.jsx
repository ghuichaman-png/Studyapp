// Barra de progreso reutilizable. value/max en unidades arbitrarias.
export default function ProgressBar({ value, max, color = '#22c55e', label }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
          <span>{label}</span>
          <span>{value} / {max}</span>
        </div>
      )}
      <div className="h-4 w-full bg-slate-200 dark:bg-slate-700/80 rounded-full overflow-hidden p-0.5 shadow-inner">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out relative"
          style={{ width: `${pct}%`, backgroundColor: color }}
        >
          {/* Shimmer/gloss reflection inside progress bar */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent rounded-full" />
        </div>
      </div>
    </div>
  )
}

