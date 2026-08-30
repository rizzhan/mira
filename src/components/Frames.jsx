import { FRAMES } from '../lib/photobooth'

export default function Frames({ value, onChange }) {
  return (
    <div className="frame-row">
      {FRAMES.map((f) => (
        <button
          key={f.id}
          type="button"
          className={'frame-btn' + (value === f.id ? ' active' : '')}
          onClick={() => onChange(f.id)}
        >
          <span className="frame-chip" style={{ borderColor: f.accent }} />
          <span>{f.label}</span>
        </button>
      ))}
    </div>
  )
}