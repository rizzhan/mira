import { useEffect, useState } from 'react'
import { STICKERS } from '../lib/photobooth'
import { emojiImageUrl } from '../lib/emoji'

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(4)
  const [hiding, setHiding] = useState(false)

  useEffect(() => {
    let p = 4
    let donePreload = false
    let doneTimer = false

    function tryDone() {
      if (donePreload && doneTimer) {
        setProgress(100)
        setHiding(true)
        window.setTimeout(onDone, 480)
      }
    }

    const id = window.setInterval(() => {
      p += Math.random() * 13 + 5
      if (p >= 94) {
        p = 94
        window.clearInterval(id)
        doneTimer = true
        tryDone()
      }
      setProgress(Math.min(p, 94))
    }, 110)

    const loads = STICKERS.map(
      (s) =>
        new Promise((res) => {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.onload = res
          img.onerror = res
          img.src = emojiImageUrl(s)
        }),
    )
    const fontReady = document.fonts ? document.fonts.ready.catch(() => {}) : Promise.resolve()

    Promise.all([...loads, fontReady]).then(() => {
      donePreload = true
      tryDone()
    })

    const safety = window.setTimeout(() => {
      donePreload = true
      doneTimer = true
      tryDone()
    }, 2600)

    return () => {
      window.clearInterval(id)
      window.clearTimeout(safety)
    }
  }, [onDone])

  return (
    <div className={`loading-screen${hiding ? ' hidden' : ''}`} aria-hidden="true">
      <div className="loading-fog" />
      <div className="loading-orb" aria-hidden="true" />
      <div className="loading-center">
        <div className="loading-logo">MIRA</div>
        <div className="loading-sub">pose with a partner</div>
        <div className="loading-bar">
          <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="loading-pct">{Math.round(progress)}%</div>
    </div>
  )
}