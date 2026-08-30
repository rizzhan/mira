import { useEffect, useRef, useState } from 'react'
import CameraPane from './components/CameraPane'
import StripPane from './components/StripPane'
import StickerBar from './components/StickerBar'
import Frames from './components/Frames'
import PreviewModal from './components/PreviewModal'
import GlassSelect from './components/GlassSelect'
import CursorGlow from './components/CursorGlow'
import LoadingScreen from './components/LoadingScreen'
import { capturePhoto, composeStrip, createSamplePhoto, FILTERS, STRIP_SIZES } from './lib/photobooth'
import './App.css'

const VIDEO_CONSTRAINTS = {
  video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
  audio: false,
}

export default function App() {
  const [camStatus, setCamStatus] = useState('loading')
  const [camError, setCamError] = useState('')
  const [filterId, setFilterId] = useState('none')
  const [frameId, setFrameId] = useState('classic')
  const [stripSize, setStripSize] = useState(3)
  const [photos, setPhotos] = useState([])
  const [stickers, setStickers] = useState([])
  const [activeSticker, setActiveSticker] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [counting, setCounting] = useState(false)
  const [count, setCount] = useState(3)
  const [flash, setFlash] = useState(false)
  const [grain, setGrain] = useState(0)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [previewBusy, setPreviewBusy] = useState(false)
  const [loading, setLoading] = useState(true)

  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const stripRef = useRef(null)
  const timerRef = useRef(null)

  const countingRef = useRef(false)
  const photosRef = useRef([])
  const stripSizeRef = useRef(stripSize)

  useEffect(() => {
    countingRef.current = counting
  }, [counting])
  useEffect(() => {
    photosRef.current = photos
  }, [photos])
  useEffect(() => {
    stripSizeRef.current = stripSize
  }, [stripSize])

  useEffect(() => {
    let stream = null
    let cancelled = false
    async function init() {
      setCamStatus('loading')
      try {
        stream = await navigator.mediaDevices.getUserMedia(VIDEO_CONSTRAINTS)
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch(() => {})
        }
        setCamStatus('ready')
      } catch {
        if (!cancelled) {
          setCamStatus('error')
          setCamError('Camera not available. Allow camera access or use the sample image.')
        }
      }
    }
    init()
    return () => {
      cancelled = true
      if (stream) stream.getTracks().forEach((t) => t.stop())
    }
  }, [])

  function startCamera() {
    setCamStatus('loading')
    navigator.mediaDevices
      .getUserMedia(VIDEO_CONSTRAINTS)
      .then((stream) => {
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch(() => {})
        }
        setCamStatus('ready')
      })
      .catch(() => {
        setCamStatus('error')
        setCamError('Camera not available. Check permissions or use the sample image.')
      })
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) videoRef.current.srcObject = null
    setCamStatus('off')
  }

  function appendPhoto(src) {
    setPhotos((prev) => (prev.length >= stripSizeRef.current ? prev : [...prev, { src, filterId }]))
  }

  function fireShot() {
    const filter = FILTERS.find((f) => f.id === filterId) || FILTERS[0]
    const video = videoRef.current
    const src =
      camStatus === 'ready' && video && video.videoWidth > 0
        ? capturePhoto(video, filter.grade)
        : createSamplePhoto(filterId)
    appendPhoto(src)
    setFlash(true)
    window.setTimeout(() => setFlash(false), 180)
  }

  function handleCapture() {
    if (countingRef.current || photosRef.current.length >= stripSizeRef.current) return
    setCounting(true)
    let n = 3
    setCount(n)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = window.setInterval(() => {
      n -= 1
      if (n <= 0) {
        clearInterval(timerRef.current)
        timerRef.current = null
        fireShot()
        setCounting(false)
      } else {
        setCount(n)
      }
    }, 800)
  }

  function pickSticker(emoji) {
    setActiveSticker((cur) => (cur === emoji ? null : emoji))
    setSelectedId(null)
  }

  function updateSticker(id, patch) {
    setStickers((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  function deleteSticker(id) {
    setStickers((prev) => prev.filter((s) => s.id !== id))
    setSelectedId((cur) => (cur === id ? null : cur))
  }

  function placeSticker(e) {
    if (!activeSticker || !stripRef.current) return
    const rect = stripRef.current.getBoundingClientRect()
    const x = Math.min(0.95, Math.max(0.05, (e.clientX - rect.left) / rect.width))
    const y = Math.min(0.95, Math.max(0.05, (e.clientY - rect.top) / rect.height))
    const id = `${Date.now()}-${Math.random()}`
    setStickers((prev) => [...prev, { id, emoji: activeSticker, x, y, size: 0.16, rotation: 0 }])
    setSelectedId(id)
  }

  async function openPreview() {
    if (photos.length === 0) return
    setPreviewBusy(true)
    setPreviewOpen(true)
    try {
      const url = await composeStrip(photos, frameId, stickers, grain)
      setPreviewUrl(url)
    } finally {
      setPreviewBusy(false)
    }
  }

  function handleStripClick(e) {
    if (activeSticker) {
      placeSticker(e)
      return
    }
    if (selectedId) {
      setSelectedId(null)
      return
    }
    openPreview()
  }

  function retake() {
    setPhotos((prev) => prev.slice(0, -1))
    if (photos.length <= 1) setActiveSticker(null)
  }

  function clearAll() {
    setPhotos([])
    setStickers([])
    setActiveSticker(null)
    setSelectedId(null)
  }

  function changeStripSize(n) {
    setStripSize(n)
    setPhotos((prev) => prev.slice(0, n))
  }

  async function downloadStrip() {
    if (photos.length === 0) return
    const url = await composeStrip(photos, frameId, stickers, grain)
    const a = document.createElement('a')
    a.href = url
    a.download = `photobooth-${Date.now()}.png`
    a.click()
  }

  function handleGlobalKey(e) {
    if (e.code !== 'Space') return
    const el = document.activeElement
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return
    e.preventDefault()
    if (countingRef.current || photosRef.current.length >= stripSizeRef.current) return
    handleCapture()
  }

  const handleCaptureRef = useRef(null)
  useEffect(() => {
    handleCaptureRef.current = handleGlobalKey
  })

  useEffect(() => {
    function onKey(e) {
      handleCaptureRef.current?.(e)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current)
    },
    [],
  )

  return (
    <>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      <CursorGlow />
      <div className="app">
      <header className="hero">
        <h1>MIRA</h1>
        <p className="subtitle">Snap a strip, decorate it, download it — all in your browser.</p>
        <GlassSelect label="Photos per strip" value={stripSize} options={STRIP_SIZES} onChange={changeStripSize} />
      </header>

      <main className="layout">
        <CameraPane
          videoRef={videoRef}
          status={camStatus}
          error={camError}
          filterId={filterId}
          counting={counting}
          count={count}
          flash={flash}
          canCapture={photos.length < stripSize}
          onCapture={handleCapture}
          onFilter={setFilterId}
          onPower={camStatus === 'ready' ? stopCamera : startCamera}
          onSample={() => fireShot()}
        />

        <aside className="side">
          <StripPane
            photos={photos}
            stripSize={stripSize}
            frameId={frameId}
            stickers={stickers}
            grain={grain}
            stripRef={stripRef}
            selectedId={selectedId}
            placing={activeSticker !== null}
            onLayerClick={handleStripClick}
            onSelect={setSelectedId}
            onUpdate={updateSticker}
            onDelete={deleteSticker}
            onRetake={retake}
            onClear={clearAll}
            onDownload={downloadStrip}
          />

          <div className="card tool-card">
            <h2>Stickers</h2>
            <StickerBar active={activeSticker} onPick={pickSticker} onClear={() => setStickers([])} />
          </div>

          <div className="card tool-card">
            <h2>Frame</h2>
            <Frames value={frameId} onChange={setFrameId} />
          </div>

          <div className="card tool-card">
            <h2>Film grain</h2>
            <div className="grain-row">
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(grain * 100)}
                onChange={(e) => setGrain(Number(e.target.value) / 100)}
              />
              <span className="grain-value">{Math.round(grain * 100)}%</span>
            </div>
            <p className="grain-note">Grain is baked into the exported image too.</p>
          </div>
        </aside>
      </main>

      <footer className="site-footer">
        <div className="footer-glass">
          <a
            className="footer-link"
            href="https://github.com/rizzhan"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.5.09.68-.22.68-.48v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.02 1.53 1.02.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.3 9.3 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.33 4.7-4.55 4.95.36.31.68.92.68 1.85v2.74c0 .26.18.57.68.48A9.5 9.5 0 0 0 12 2.5Z"
              />
            </svg>
          </a>
          <a
            className="footer-link"
            href="https://www.linkedin.com/in/rishan-paul-0a2b36343/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M5.2 8.6h3v8.9h-3zM6.7 6.2a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5ZM10.6 8.6h3v1.22c.42-.82 1.45-1.68 2.99-1.68 3.2 0 3.78 2.1 3.78 4.84v5.52h-3v-4.88c0-1.16-.02-2.66-1.62-2.66-1.62 0-1.87 1.26-1.87 2.57v4.97h-3z"
              />
            </svg>
          </a>
          <a
            className="footer-link"
            href="https://instagram.com/r.1zzhan"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Zm0 7.8a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM17.8 7.1a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0ZM12 2.5c-2.6 0-2.93.01-3.96.06a5.4 5.4 0 0 0-1.8.34 3.4 3.4 0 0 0-1.23.8 3.4 3.4 0 0 0-.8 1.23 5.4 5.4 0 0 0-.34 1.8C3.82 9.07 3.81 9.4 3.81 12s.01 2.93.06 3.96c.02.65.13 1.23.34 1.8.16.42.43.8.8 1.23.37.37.81.64 1.23.8.57.21 1.15.32 1.8.34 1.03.05 1.36.06 3.96.06s2.93-.01 3.96-.06a5.4 5.4 0 0 0 1.8-.34 3.4 3.4 0 0 0 1.23-.8c.37-.37.64-.81.8-1.23.21-.57.32-1.15.34-1.8.05-1.03.06-1.36.06-3.96s-.01-2.93-.06-3.96a5.4 5.4 0 0 0-.34-1.8 3.4 3.4 0 0 0-.8-1.23 3.4 3.4 0 0 0-1.23-.8 5.4 5.4 0 0 0-1.8-.34C14.93 2.51 14.6 2.5 12 2.5Zm0 1.8c2.56 0 2.86.01 3.87.06.47.02.73.1.9.16.22.09.38.19.55.36.17.17.27.33.36.55.06.17.14.43.16.9.05 1.01.06 1.31.06 3.87s-.01 2.86-.06 3.87c-.02.47-.1.73-.16.9a2.2 2.2 0 0 1-.36.55c-.17.17-.33.27-.55.36-.17.06-.43.14-.9.16-1.01.05-1.31.06-3.87.06s-2.86-.01-3.87-.06c-.47-.02-.73-.1-.9-.16a2.2 2.2 0 0 1-.55-.36 2.2 2.2 0 0 1-.36-.55c-.06-.17-.14-.43-.16-.9-.05-1.01-.06-1.31-.06-3.87s.01-2.86.06-3.87c.02-.47.1-.73.16-.9.09-.22.19-.38.36-.55.17-.17.33-.27.55-.36.17-.06.43-.14.9-.16 1.01-.05 1.31-.06 3.87-.06Z"
              />
            </svg>
          </a>

        </div>
      </footer>

      {previewOpen && (
        <PreviewModal url={previewUrl} busy={previewBusy} onClose={() => setPreviewOpen(false)} />
      )}
      </div>
    </>
  )
}