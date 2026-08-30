import { useRef } from 'react'
import { FRAMES } from '../lib/photobooth'
import { emojiImageUrl } from '../lib/emoji'

export default function StripPane({
  photos,
  stripSize,
  frameId,
  stickers,
  grain,
  stripRef,
  selectedId,
  placing,
  onLayerClick,
  onSelect,
  onUpdate,
  onDelete,
  onRetake,
  onClear,
  onDownload,
}) {
  const frame = FRAMES.find((f) => f.id === frameId) || FRAMES[0]
  const count = photos.length
  const cells = Array.from({ length: stripSize }, (_, i) => photos[i] || null)
  const dragRef = useRef(null)

  function onPointerMove(e) {
    const d = dragRef.current
    if (!d) return
    if (d.mode === 'move') {
      const dx = (e.clientX - d.startX) / d.rect.width
      const dy = (e.clientY - d.startY) / d.rect.height
      const nx = Math.min(0.95, Math.max(0.05, d.startSticker.x + dx))
      const ny = Math.min(0.95, Math.max(0.05, d.startSticker.y + dy))
      onUpdate(d.id, { x: nx, y: ny })
    } else if (d.mode === 'resize') {
      const curDist = Math.hypot(e.clientX - d.centerX, e.clientY - d.centerY)
      const ratio = curDist / (d.startDist || 1)
      const ns = Math.min(0.45, Math.max(0.06, d.startSticker.size * ratio))
      onUpdate(d.id, { size: ns })
    } else if (d.mode === 'rotate') {
      const curAngle = Math.atan2(e.clientY - d.centerY, e.clientX - d.centerX) * 180 / Math.PI
      const delta = curAngle - d.startAngle
      onUpdate(d.id, { rotation: (d.startSticker.rotation || 0) + delta })
    }
  }

  function onPointerUp() {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    dragRef.current = null
  }

  function handleStickerDown(e, s) {
    e.stopPropagation()
    e.preventDefault()
    onSelect(s.id)
    const rect = stripRef.current.getBoundingClientRect()
    const cx = rect.left + s.x * rect.width
    const cy = rect.top + s.y * rect.height
    dragRef.current = {
      mode: 'move',
      id: s.id,
      startX: e.clientX,
      startY: e.clientY,
      startSticker: { ...s },
      rect,
      centerX: cx,
      centerY: cy,
    }
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  function handleResizeDown(e, s) {
    e.stopPropagation()
    e.preventDefault()
    onSelect(s.id)
    const rect = stripRef.current.getBoundingClientRect()
    const cx = rect.left + s.x * rect.width
    const cy = rect.top + s.y * rect.height
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy)
    dragRef.current = {
      mode: 'resize',
      id: s.id,
      startX: e.clientX,
      startY: e.clientY,
      startSticker: { ...s },
      centerX: cx,
      centerY: cy,
      startDist: dist,
      rect,
    }
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  function handleRotateDown(e, s) {
    e.stopPropagation()
    e.preventDefault()
    onSelect(s.id)
    const rect = stripRef.current.getBoundingClientRect()
    const cx = rect.left + s.x * rect.width
    const cy = rect.top + s.y * rect.height
    const ang = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI
    dragRef.current = {
      mode: 'rotate',
      id: s.id,
      startX: e.clientX,
      startY: e.clientY,
      startSticker: { ...s },
      centerX: cx,
      centerY: cy,
      startAngle: ang,
      rect,
    }
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  let badgeText = 'Pick a sticker to add one — or click a sticker to edit • click empty strip to preview'
  if (placing) badgeText = 'Click the strip to place your sticker'
  else if (selectedId) badgeText = 'Drag to move • handles to resize / rotate • × to remove'

  return (
    <div className="card strip-card">
      <div className="strip-head">
        <h2>Your strip</h2>
        <span className="status">
          {count === 0
            ? 'Ready to shoot'
            : count < stripSize
              ? `${count} of ${stripSize} shot`
              : 'Complete!'}
        </span>
      </div>

      <div ref={stripRef} className={'strip-shell frame-' + frame.id} onPointerDown={onLayerClick}>
        <div className="strip-stack">
          {cells.map((p, i) =>
            p ? (
              <div className="cell" key={i}>
                <img src={p.src} alt="" />
                {grain > 0 && <div className="cell-grain" style={{ opacity: grain }} />}
              </div>
            ) : (
              <div className="cell empty" key={i}>
                <span>{count === 0 && i === 0 ? 'PRESS SPACE' : '+'}</span>
              </div>
            ),
          )}
        </div>
        <div className="sticker-layer">
          {stickers.map((s) => (
            <div
              key={s.id}
              className={'sticker-wrap' + (selectedId === s.id ? ' selected' : '')}
              style={{
                left: `${s.x * 100}%`,
                top: `${s.y * 100}%`,
                width: `${s.size * 100}cqi`,
                height: `${s.size * 100}cqi`,
                transform: `translate(-50%, -50%) rotate(${s.rotation || 0}deg)`,
              }}
              onPointerDown={(e) => handleStickerDown(e, s)}
            >
              <img className="sticker-img" src={emojiImageUrl(s.emoji)} alt={s.emoji} draggable={false} />
              {selectedId === s.id && (
                <>
                  <div className="handle handle-resize" onPointerDown={(e) => handleResizeDown(e, s)} title="Drag to resize" />
                  <div className="handle handle-rotate" onPointerDown={(e) => handleRotateDown(e, s)} title="Drag to rotate" />
                  <button
                    type="button"
                    className="handle handle-delete"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(s.id)
                    }}
                    title="Remove sticker"
                  >
                    ×
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={'badge' + (placing || selectedId ? ' badge-on' : '')}>{badgeText}</div>

      <div className="strip-actions">
        <button type="button" className="btn secondary" onClick={onRetake} disabled={count === 0}>
          ↩ Retake last
        </button>
        <button type="button" className="btn secondary" onClick={onClear}>
          Clear all
        </button>
        <button
          type="button"
          className="btn big"
          onClick={onDownload}
          disabled={count === 0}
        >
          ⬇ Download
        </button>
      </div>
    </div>
  )
}