export const FILTERS = [
  // Basic
  { id: 'none', label: 'Original', group: 'Basic', grade: null },
  { id: 'pop', label: 'Pop', group: 'Basic', grade: { contrast: 1.12, sat: 1.35, exposure: 1.02 } },
  { id: 'vivid', label: 'Vivid', group: 'Basic', grade: { contrast: 1.15, sat: 1.45, exposure: 1.05 } },
  { id: 'bright', label: 'Bright', group: 'Basic', grade: { exposure: 1.18, contrast: 0.95, sat: 1.08 } },
  { id: 'fade', label: 'Fade', group: 'Basic', grade: { exposure: 1.1, contrast: 0.84, sat: 0.82, lift: { r: 0.06, g: 0.06, b: 0.06 } } },
  // B&W
  { id: 'bw', label: 'B&W', group: 'B&W', grade: { sat: 0, contrast: 1.06 } },
  { id: 'noir', label: 'Noir', group: 'B&W', grade: { sat: 0, contrast: 1.5, exposure: 0.85, gamma: 1.08, vignette: 0.32, lift: { r: 0.02, g: 0.02, b: 0.02 } } },
  { id: 'silver', label: 'Silver', group: 'B&W', grade: { sat: 0, contrast: 1.18, exposure: 1.06, gain: { r: -0.02, g: 0, b: 0.04 } } },
  { id: 'faded_bw', label: 'Faded B&W', group: 'B&W', grade: { sat: 0, exposure: 1.16, contrast: 0.8, lift: { r: 0.05, g: 0.05, b: 0.05 } } },
  // Film & vintage
  { id: 'sepia', label: 'Sepia', group: 'Film', grade: { sat: 0, contrast: 1.04, gain: { r: 0.16, g: 0.1, b: -0.05 }, lift: { r: 0.05, g: 0.03, b: -0.02 } } },
  { id: 'vintage', label: 'Vintage', group: 'Film', grade: { exposure: 1.06, contrast: 0.9, sat: 0.78, gamma: 1.05, vignette: 0.15, lift: { r: 0.08, g: 0.05, b: -0.03 }, gain: { r: 0.03, g: 0.01, b: -0.02 } } },
  { id: 'retro', label: 'Retro', group: 'Film', grade: { exposure: 1.03, contrast: 1.05, sat: 1.15, vignette: 0.2, lift: { r: 0.09, g: 0.04, b: -0.05 }, gain: { r: 0.02, g: 0, b: -0.03 } } },
  { id: 'seventies', label: '70s', group: 'Film', grade: { exposure: 1.1, contrast: 0.9, sat: 0.7, gamma: 1.1, lift: { r: 0.1, g: 0.06, b: -0.04 }, gain: { r: 0.02, g: 0.01, b: -0.02 } } },
  { id: 'kodak', label: 'Kodak', group: 'Film', grade: { exposure: 1.04, contrast: 1.06, sat: 1.18, gamma: 0.98, lift: { r: 0.05, g: 0.03, b: -0.04 }, gain: { r: 0.04, g: 0.02, b: -0.02 } } },
  { id: 'lomo', label: 'Lomo', group: 'Film', grade: { contrast: 1.18, sat: 1.35, exposure: 1.06, gamma: 0.95, vignette: 0.55, lift: { r: 0.02, g: 0.03, b: 0 }, gain: { r: 0, g: 0.02, b: 0 } } },
  // Color grades
  { id: 'warm', label: 'Warm', group: 'Color', grade: { exposure: 1.02, sat: 1.15, lift: { r: 0.03, g: 0.01, b: -0.02 }, gain: { r: 0.05, g: 0.02, b: -0.04 } } },
  { id: 'cool', label: 'Cool', group: 'Color', grade: { sat: 1.1, lift: { r: -0.02, g: 0, b: 0.02 }, gain: { r: -0.04, g: -0.01, b: 0.05 } } },
  { id: 'icy', label: 'Icy', group: 'Color', grade: { exposure: 1.1, sat: 1.25, contrast: 0.95, lift: { b: 0.05 }, gain: { r: -0.04, g: 0, b: 0.08 } } },
  { id: 'rose', label: 'Rose', group: 'Color', grade: { exposure: 1.04, sat: 1.2, vignette: 0.12, lift: { r: 0.04 }, gain: { r: 0.07, g: -0.01 } } },
  { id: 'pastel', label: 'Pastel', group: 'Color', grade: { exposure: 1.16, contrast: 0.8, sat: 0.7, gamma: 1.12, lift: { r: 0.06, g: 0.06, b: 0.07 } } },
  { id: 'cinematic', label: 'Cinematic', group: 'Color', grade: { contrast: 1.2, sat: 1.12, exposure: 0.95, gamma: 1.05, vignette: 0.3, lift: { r: 0.06, g: 0.03, b: -0.03 }, gain: { r: -0.04, g: 0.01, b: 0.07 } } },
  { id: 'drama', label: 'Drama', group: 'Color', grade: { contrast: 1.35, sat: 1.08, exposure: 0.88, gamma: 1.06, vignette: 0.25, lift: { r: 0.02, g: 0.02, b: 0.03 }, gain: { r: -0.01, g: -0.01, b: -0.02 } } },
  { id: 'hdr', label: 'HDR', group: 'Color', grade: { contrast: 1.4, sat: 1.3, exposure: 1.0, gamma: 1.04 } },
  // Creative
  { id: 'glow', label: 'Glow', group: 'Creative', grade: { exposure: 1.12, contrast: 0.85, sat: 1.18, gamma: 1.08, gain: { r: 0.03, g: 0.03, b: 0.04 } } },
  { id: 'cyber', label: 'Cyber', group: 'Creative', grade: { contrast: 1.25, sat: 1.5, exposure: 0.95, vignette: 0.3, lift: { r: 0.08, g: 0, b: 0.08 }, gain: { r: -0.03, g: 0.05, b: 0.1 } } },
  { id: 'neonpop', label: 'Neon Pop', group: 'Creative', grade: { contrast: 1.3, sat: 1.6, exposure: 1.05, vignette: 0.15, lift: { b: 0.05 }, gain: { r: 0.05, g: 0, b: 0.06 } } },
]

export const FRAMES = [
  { id: 'none', label: 'None', accent: '#8b93a7' },
  { id: 'classic', label: 'Classic', accent: '#ffffff' },
  { id: 'film', label: 'Film strip', accent: '#eab308' },
  { id: 'polaroid', label: 'Polaroid', accent: '#ffffff' },
  { id: 'neon', label: '#ff2bd6' },
]

import { emojiImageUrl } from './emoji.js'

export const STICKERS = ['🎉', '🥳', '🙌', '✨', '❤️', '🔥', '💥', '😎', '🌈', '⭐', '👑', '🦄']

export const STRIP_SIZES = [1, 2, 3, 4]

const CELL_W = 900
const CELL_H = 675
const GAP = 16

function loadImage(src, crossOrigin = false) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    if (crossOrigin) img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function buildLut(grade) {
  const exposure = grade.exposure ?? 1
  const contrast = grade.contrast ?? 1
  const pivot = grade.pivot ?? 0.45
  const gamma = grade.gamma ?? 1
  const invGamma = 1 / gamma
  const lut = new Uint8ClampedArray(256)
  for (let i = 0; i < 256; i++) {
    let v = (i / 255) * exposure
    if (v > 0) v = Math.pow(v, invGamma)
    v = (v - pivot) * contrast + pivot
    lut[i] = v * 255
  }
  return lut
}

function buildVignette(w, h, strength) {
  const map = new Float32Array(w * h)
  const cx = (w - 1) / 2
  const cy = (h - 1) / 2
  const invMax = 1 / Math.hypot(cx, cy)
  let i = 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++, i++) {
      const dx = (x - cx) * invMax
      const dy = (y - cy) * invMax
      const d = Math.sqrt(dx * dx + dy * dy)
      const t = Math.max(0, d - 0.3)
      map[i] = 1 - strength * Math.min(1, t * t * 2.5)
    }
  }
  return map
}

const EMPTY = { r: 0, g: 0, b: 0 }

/**
 * Applies a film-style color grade to ImageData in place.
 * Timings: exposure -> gamma -> contrast (via 256-entry LUT),
 * per-channel saturation, then lift (shadows) / gain (highlights) casts and vignette.
 */
export function applyGrade(imageData, grade) {
  if (!grade) return
  const data = imageData.data
  const w = imageData.width
  const h = imageData.height
  const sat = grade.sat ?? 1
  const vig = grade.vignette ?? 0
  const lr = (grade.lift ?? EMPTY).r ?? 0
  const lg = (grade.lift ?? EMPTY).g ?? 0
  const lb = (grade.lift ?? EMPTY).b ?? 0
  const gr = (grade.gain ?? EMPTY).r ?? 0
  const gg = (grade.gain ?? EMPTY).g ?? 0
  const gb = (grade.gain ?? EMPTY).b ?? 0
  const lut = buildLut(grade)
  const vigMap = vig > 0 ? buildVignette(w, h, vig) : null

  for (let p = 0, i = 0; p < data.length; p += 4, i++) {
    let r = lut[data[p]]
    let g = lut[data[p + 1]]
    let b = lut[data[p + 2]]

    if (sat !== 1) {
      const l = 0.2126 * r + 0.7152 * g + 0.0722 * b
      r = l + (r - l) * sat
      g = l + (g - l) * sat
      b = l + (b - l) * sat
    }

    if (lr || lg || lb || gr || gg || gb) {
      const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) * (1 / 255)
      const sh = 1 - lum
      r += (lr * sh + gr * lum) * 255
      g += (lg * sh + gg * lum) * 255
      b += (lb * sh + gb * lum) * 255
    }

    if (vigMap) {
      const v = vigMap[i]
      data[p] = r * v
      data[p + 1] = g * v
      data[p + 2] = b * v
    } else {
      data[p] = r
      data[p + 1] = g
      data[p + 2] = b
    }
  }
}

export function capturePhoto(video, grade) {
  const canvas = document.createElement('canvas')
  canvas.width = CELL_W
  canvas.height = CELL_H
  const ctx = canvas.getContext('2d')
  const vw = video.videoWidth
  const vh = video.videoHeight
  const scale = Math.max(CELL_W / vw, CELL_H / vh)
  const dw = vw * scale
  const dh = vh * scale
  // Mirror the image so the shot matches what the user saw in the preview.
  ctx.translate(CELL_W, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(video, (CELL_W - dw) / 2, (CELL_H - dh) / 2, dw, dh)
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  if (grade) {
    const img = ctx.getImageData(0, 0, CELL_W, CELL_H)
    applyGrade(img, grade)
    ctx.putImageData(img, 0, 0)
  }
  return canvas.toDataURL('image/jpeg', 0.92)
}

export function createSamplePhoto(filterId) {
  const filter = FILTERS.find((f) => f.id === filterId) || FILTERS[0]
  const canvas = document.createElement('canvas')
  canvas.width = CELL_W
  canvas.height = CELL_H
  const ctx = canvas.getContext('2d')
  const grad = ctx.createLinearGradient(0, 0, CELL_W, CELL_H)
  grad.addColorStop(0, '#3b82f6')
  grad.addColorStop(1, '#ff2bd6')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, CELL_W, CELL_H)
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.font = 'bold 64px "Segoe UI", system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('SAMPLE', CELL_W / 2, CELL_H / 2 - 40)
  ctx.font = '34px "Segoe UI", system-ui, sans-serif'
  ctx.fillText('(no camera signal)', CELL_W / 2, CELL_H / 2 + 50)
  if (filter.grade) {
    const img = ctx.getImageData(0, 0, CELL_W, CELL_H)
    applyGrade(img, filter.grade)
    ctx.putImageData(img, 0, 0)
  }
  return canvas.toDataURL('image/jpeg', 0.92)
}

export function filterThumb(filter) {
  const w = 56
  const h = 42
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  // Foggy glass minimal base — matches the black theme
  ctx.fillStyle = '#0c0c0e'
  ctx.fillRect(0, 0, w, h)
  // soft diffused skin blob
  ctx.filter = 'blur(7px)'
  ctx.fillStyle = '#c9a87c'
  ctx.beginPath()
  ctx.ellipse(w * 0.5, h * 0.50, w * 0.22, h * 0.30, 0, 0, Math.PI * 2)
  ctx.fill()
  // subtle cool fog accent
  ctx.fillStyle = '#6b9ec6'
  ctx.globalAlpha = 0.42
  ctx.beginPath()
  ctx.ellipse(w * 0.32, h * 0.30, w * 0.14, h * 0.16, 0, 0, Math.PI * 2)
  ctx.fill()
  // subtle warm fog accent
  ctx.fillStyle = '#c99a6a'
  ctx.globalAlpha = 0.38
  ctx.beginPath()
  ctx.ellipse(w * 0.70, h * 0.74, w * 0.12, h * 0.12, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 1
  ctx.filter = 'none'
  // tiny muted chips so saturation shifts still read
  ctx.fillStyle = '#b55a5a'
  ctx.fillRect(w * 0.10, h * 0.80, 5, 4)
  ctx.fillStyle = '#5a7eb5'
  ctx.fillRect(w * 0.78, h * 0.80, 5, 4)
  if (filter.grade) {
    const img = ctx.getImageData(0, 0, w, h)
    applyGrade(img, filter.grade)
    ctx.putImageData(img, 0, 0)
  }
  return canvas.toDataURL('image/png')
}

// eslint-disable-next-line no-unused-vars
function drawRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export async function composeStrip(photos, frameId, stickers, grain = 0) {
  const frame = FRAMES.find((f) => f.id === frameId) || FRAMES[0]
  const count = photos.length
  const gap = frame.id === 'none' ? 8 : GAP

  let W = CELL_W
  let H = count * CELL_H + (count - 1) * gap
  let x0 = 0
  let y0 = 0
  let cellGap = gap
  let bg = '#000000'

  if (frame.id === 'film') {
    const sx = 116
    const band = 108
    bg = '#0a0a0a'
    x0 = sx
    y0 = band
    cellGap = band
    W = CELL_W + sx * 2
    H = band * 2 + count * CELL_H + (count - 1) * band
  } else if (frame.id === 'polaroid') {
    bg = '#ffffff'
    x0 = 26
    y0 = 26
    W = CELL_W + x0 * 2
    H = y0 + count * CELL_H + (count - 1) * gap + 96
  } else if (frame.id === 'classic') {
    bg = '#ffffff'
    x0 = 26
    y0 = 26
    W = CELL_W + x0 * 2
    H = y0 * 2 + count * CELL_H + (count - 1) * gap
  } else if (frame.id === 'neon') {
    bg = '#101014'
    x0 = 26
    y0 = 26
    W = CELL_W + x0 * 2
    H = y0 * 2 + count * CELL_H + (count - 1) * gap
  }

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)



  const images = await Promise.all(photos.map((p) => loadImage(p.src)))

  images.forEach((img, i) => {
    const y = y0 + i * (CELL_H + cellGap)
    const cw = CELL_W
    const ch = CELL_H
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
    const dw = img.naturalWidth * scale
    const dh = img.naturalHeight * scale
    ctx.fillStyle = '#000000'
    ctx.fillRect(x0, y, cw, ch)
    ctx.drawImage(img, x0 + (cw - dw) / 2, y + (ch - dh) / 2, dw, dh)

    if (frame.id === 'polaroid') {
      ctx.fillStyle = '#ffffff'
      ctx.font = 'italic 26px Georgia, serif'
      ctx.textAlign = 'center'
      ctx.fillText('· mira ·', W / 2, y + CELL_H + 58)
    }
  })

  // Grain: photos only — not the frame/border.
  if (grain > 0) {
    for (let i = 0; i < count; i++) {
      const y = y0 + i * (CELL_H + cellGap)
      const img = ctx.getImageData(x0, y, CELL_W, CELL_H)
      addGrain(img, grain)
      ctx.putImageData(img, x0, y)
    }
  }

  if (frame.id === 'film') {
    ctx.strokeStyle = '#2b2b2b'
    ctx.lineWidth = 3
    ctx.strokeRect(0.5, 0.5, W - 1, H - 1)
  }

  if (frame.id === 'neon') {
    ctx.strokeStyle = '#00e5ff'
    ctx.lineWidth = 10
    ctx.shadowColor = '#00e5ff'
    ctx.shadowBlur = 26
    ctx.strokeRect(14, 14, W - 28, H - 28)
    ctx.strokeStyle = '#ff2bd6'
    ctx.shadowColor = '#ff2bd6'
    ctx.strokeRect(28, 28, W - 56, H - 56)
    ctx.shadowBlur = 0
  }

  if (frame.id === 'classic' || frame.id === 'polaroid') {
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 3
    ctx.strokeRect(1.5, 1.5, W - 3, H - 3)
    ctx.lineWidth = 1
    ctx.strokeRect(8.5, 8.5, W - 17, H - 17)
  }

  // iPhone-style stickers — drawn after grain so they stay crisp
  if (stickers.length) {
    const loaded = await Promise.all(
      stickers.map(async (s) => {
        try {
          const img = await loadImage(emojiImageUrl(s.emoji), true)
          return { s, img }
        } catch {
          return { s, img: null }
        }
      }),
    )
    for (const { s, img } of loaded) {
      const px = s.size * W
      const cx = s.x * W
      const cy = s.y * H
      const rot = ((s.rotation || 0) * Math.PI) / 180
      if (img) {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(rot)
        ctx.drawImage(img, -px / 2, -px / 2, px, px)
        ctx.restore()
      } else {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(rot)
        ctx.font = `${Math.round(px)}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(s.emoji, 0, 0)
        ctx.restore()
      }
    }
  }

  return canvas.toDataURL('image/png')
}

/**
 * Applies monochrome film-style grain to ImageData in place.
 * strength is 0..1; noise lands on top of everything (photos, frames, stickers).
 */
export function addGrain(imageData, strength) {
  if (!strength || strength <= 0) return
  const data = imageData.data
  const amount = strength * 110
  for (let p = 0; p < data.length; p += 4) {
    const d = (Math.random() * 2 - 1) * amount
    data[p] += d
    data[p + 1] += d
    data[p + 2] += d
  }
}