export function Card({ title, right, children, className = '' }) {
  return (
    <section className={`glass p-4 sm:p-5 ${className}`}>
      {(title || right) && (
        <header className="flex items-center justify-between mb-3">
          {title && (
            <h2 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-dim">
              {title}
            </h2>
          )}
          {right}
        </header>
      )}
      {children}
    </section>
  )
}
