import { STICKERS } from '../lib/photobooth'
import { emojiImageUrl } from '../lib/emoji'

export default function StickerBar({ active, onPick, onClear }) {
  return (
    <div className="sticker-bar">
      {STICKERS.map((s) => (
        <button
          key={s}
          type="button"
          className={'sticker-btn' + (active === s ? ' active' : '')}
          onClick={() => onPick(s)}
          aria-label={s}
        >
          <img className="sticker-btn-img" src={emojiImageUrl(s)} alt={s} draggable={false} />
        </button>
      ))}
      {active ? (
        <span className="sticker-hint">
          Click the strip to place <img className="sticker-hint-img" src={emojiImageUrl(active)} alt={active} />
        </span>
      ) : (
        <span className="sticker-hint">Pick a sticker, then click the strip</span>
      )}
      <button type="button" className="link-btn" onClick={onClear} disabled={false}>
        Clear stickers
      </button>
    </div>
  )
}