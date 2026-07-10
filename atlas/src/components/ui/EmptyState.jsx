export function EmptyState({ icon: Icon, title, hint }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      {Icon && <Icon size={28} className="text-dim/50" strokeWidth={1.5} />}
      <p className="text-sm text-dim">{title}</p>
      {hint && <p className="text-xs text-dim/60">{hint}</p>}
    </div>
  )
}
