// Barra de progreso reutilizable. value/max en unidades arbitrarias.
export default function ProgressBar({ value, max, color = '#2ecc71', label }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
          <span>{label}</span>
          <span>{value} / {max}</span>
        </div>
      )}
      <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
