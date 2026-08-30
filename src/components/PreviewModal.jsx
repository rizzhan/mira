import { useEffect } from 'react'

export default function PreviewModal({ url, busy, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close preview">
          ✕
        </button>
        {busy ? (
          <div className="modal-busy">Rendering preview…</div>
        ) : (
          <img className="modal-img" src={url} alt="Final strip preview" />
        )}
        <p className="modal-note">This is exactly what your download will contain.</p>
      </div>
    </div>
  )
}