import { useEffect, useRef, useState } from 'react'

export default function GlassSelect({ value, options, onChange, label }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div className="size-row" ref={ref}>
      <span className="size-label">{label}</span>
      <button
        type="button"
        className="glass-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{value}</span>
        <span className={`glass-select-chevron${open ? ' open' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="glass-select-panel" role="listbox">
          {options.map((n) => (
            <button
              key={n}
              type="button"
              role="option"
              aria-selected={value === n}
              className={`glass-select-option${value === n ? ' selected' : ''}`}
              onClick={() => {
                onChange(n)
                setOpen(false)
              }}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}