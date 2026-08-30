import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf = 0
    let x = -400
    let y = -400

    function onMove(e) {
      x = e.clientX
      y = e.clientY
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.left = `${x}px`
        el.style.top = `${y}px`
        el.style.opacity = '1'
        // drive per-card fog highlight
        for (const card of document.querySelectorAll('.card')) {
          const r = card.getBoundingClientRect()
          card.style.setProperty('--mx', `${e.clientX - r.left}px`)
          card.style.setProperty('--my', `${e.clientY - r.top}px`)
        }
      })
    }

    function onLeave() {
      el.style.opacity = '0'
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={ref} className="cursor-glow" aria-hidden="true" />
}