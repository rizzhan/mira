import { useEffect, useRef } from 'react'
import { FILTERS, applyGrade } from '../lib/photobooth'
import FilterPicker from './FilterPicker'

const PREV_W = 480
const PREV_H = 360

const STATUS_TEXT = {
  off: 'Camera off — start it to begin.',
  loading: 'Starting camera…',
  error: 'Camera unavailable.',
  ready: '',
}

export default function CameraPane({
  videoRef,
  status,
  error,
  filterId,
  counting,
  count,
  flash,
  canCapture,
  onCapture,
  onFilter,
  onPower,
  onSample,
}) {
  const canvasRef = useRef(null)
  const statusText = STATUS_TEXT[status]

  useEffect(() => {
    if (status !== 'ready') return
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext('2d', { willReadFrequently: true })
    cvs.width = PREV_W
    cvs.height = PREV_H
    const grade = (FILTERS.find((f) => f.id === filterId) || FILTERS[0]).grade || null
    let raf = 0

    function step() {
      const v = videoRef.current
      if (v && v.videoWidth > 0) {
        ctx.clearRect(0, 0, PREV_W, PREV_H)
        ctx.save()
        ctx.translate(PREV_W, 0)
        ctx.scale(-1, 1)
        const s = Math.max(PREV_W / v.videoWidth, PREV_H / v.videoHeight)
        const dw = v.videoWidth * s
        const dh = v.videoHeight * s
        ctx.drawImage(v, (PREV_W - dw) / 2, (PREV_H - dh) / 2, dw, dh)
        ctx.restore()
        if (grade) {
          const img = ctx.getImageData(0, 0, PREV_W, PREV_H)
          applyGrade(img, grade)
          ctx.putImageData(img, 0, 0)
        }
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [status, filterId, videoRef])

  return (
    <div className="card camera-card">
      <div className="cam-viewport">
        <canvas ref={canvasRef} className="cam-preview" />
        <video ref={videoRef} className="cam-video-src" autoPlay playsInline muted />
        {status !== 'ready' && (
          <div className="cam-overlay">
            <div className="cam-overlay-text">{statusText || error}</div>
            {status === 'error' && (
              <button type="button" className="btn" onClick={onSample}>
                Use a sample image
              </button>
            )}
          </div>
        )}
        {counting && (
          <div className="countdown">
            <div key={count} className="countdown-circle">
              <span className="countdown-num">{count}</span>
            </div>
          </div>
        )}
        {flash && <div className="flash" />}
        {!counting && !flash && status === 'ready' && (
          <div className="corner-hint">press SPACE</div>
        )}
      </div>

      <FilterPicker value={filterId} onChange={onFilter} />

      <div className="cam-actions">
        <button
          type="button"
          className="btn big"
          onClick={onCapture}
          disabled={!canCapture || counting || status !== 'ready'}
        >
          <span className="btn-icon" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="12" cy="12" r="3.2" fill="currentColor" />
            </svg>
          </span>
          Capture
        </button>
        <button type="button" className="btn secondary" onClick={onPower}>
          {status === 'off' || status === 'error' ? '▶ Start camera' : '■ Stop camera'}
        </button>
        <button type="button" className="btn secondary" onClick={onSample}>
          Sample
        </button>
      </div>
    </div>
  )
}