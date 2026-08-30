import { useEffect, useRef, useState } from 'react'
import CameraPane from './components/CameraPane'
import StripPane from './components/StripPane'
import StickerBar from './components/StickerBar'
import Frames from './components/Frames'
import PreviewModal from './components/PreviewModal'
import GlassSelect from './components/GlassSelect'
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
    <div className="app">
      <header className="hero">
        <h1>Photo Booth</h1>
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

      {previewOpen && (
        <PreviewModal url={previewUrl} busy={previewBusy} onClose={() => setPreviewOpen(false)} />
      )}
    </div>
  )
}