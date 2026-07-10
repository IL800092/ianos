import { useEffect, useRef, useState } from 'react'

// Animated number counter. Respects prefers-reduced-motion.
export function CountUp({ value, duration = 700, className = '' }) {
  const [display, setDisplay] = useState(0)
  const raf = useRef()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value)
      return
    }
    const start = performance.now()
    const from = 0
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(from + (value - from) * eased))
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [value, duration])

  return <span className={className}>{display}</span>
}
