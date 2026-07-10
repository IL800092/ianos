const TONES = {
  green: 'text-ok border-ok/30 bg-ok/10',
  amber: 'text-warn border-warn/30 bg-warn/10',
  red: 'text-danger border-danger/30 bg-danger/10',
  cyan: 'text-accent border-accent/30 bg-accent/10',
  dim: 'text-dim border-edge bg-raised',
  violet: 'text-violet border-violet/30 bg-violet/10',
}

export function Badge({ tone = 'dim', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-mono uppercase tracking-wide ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
