# MIRA — Foggy Glass Photobooth

> Pose with a partner. Snap a strip. Download it — all in your browser.

A true-black, frosted-glass photobooth that runs **entirely client-side**. No backend, no upload, no tracking. Open it, allow camera, capture a 1–4 photo strip, grade it, frame it, and download a print-ready PNG.

**Live:** `https://mira.vercel.app` *(replace with your Vercel URL)*  
**Repo:** `github.com/rizzhan/mira`

![MIRA Preview](public/preview.png)

---

### ✨ Features

**Capture**
- Mirrored live preview (480×360 canvas, graded in real-time)
- 3–2–1 foggy-glass countdown + flash — **Spacebar always captures** (even when a button is focused)
- 1–4 photos per strip (glass custom dropdown, not native white)
- Retake last (works even when strip is full) / Clear all
- Sample fallback when camera is denied

**Look — 25 film-grade filters**
Real grading engine: **256-entry LUT** (exposure→gamma→contrast) + per-channel **saturation** + **lift/gain split-toning** + **vignette**. Same engine for preview and export.

| Group | Filters |
|-------|---------|
| **Basic** | Original, Pop, Vivid, Bright, Fade |
| **B&W** | B&W, Noir, Silver, Faded B&W |
| **Film** | Sepia, Vintage, Retro, 70s, Kodak, Lomo |
| **Color** | Warm, Cool, Icy, Rose, Pastel, Cinematic, Drama, HDR |
| **Creative** | Glow, Cyber, Neon Pop |

Thumbnails are 56×42 foggy-glass mini-scenes run through the same grade.

**Frame it — 5 prints**
`None` / `Classic` (3px outer + 1px inner black guideline) / `Film` (black) / `Polaroid` (· mira ·) / `Neon` (cyan/magenta glow). CSS preview + canvas export match.

**Play — 12 true iPhone stickers**
🎉 🥳 🙌 ✨ ❤️ 🔥 💥 😎 🌈 ⭐ 👑 🦄 via `emoji-datasource-apple` (Apple dataset, `twemoji` code mapping). Tap to arm → click strip to place → **drag to move, handles to resize (0.06–0.45) / rotate, × to delete**.

**Texture**
- Film grain slider `0–100%` — applied **per photo cell only** (not border/frame/stickers) in both preview (`cell` overlay) and export (`getImageData` per cell).

**Finish**
- Click the strip for an **exact preview modal** (backdrop blur, Esc/X/backdrop to close) — `composeStrip()` so download = preview.
- Download as **900×675 per-photo PNG** (frame + stickers + grain baked).

---

### 🪟 Design System

True black `#000` + fog gradients + every card `rgba(16,16,18,0.58)` / `blur(24px)` / `1px rgba(255,255,255,0.07)` + inner highlight. Glass dropdown, glass filter chips with custom foggy tooltips (no native `title`), foggy timer, 820px cursor glow + per-card spotlight that follows the mouse, full-screen editorial loading screen (`pose with a partner`).

Text selection disabled on drag for a clean photobooth feel.

---

### 🛠 Stack

- **Vite 6 + React 19**
- **Canvas 2D** grading / grain / compose
- `emoji-datasource-apple@16` + `twemoji@14` (iPhone emoji)
- `eslint` (flat config) — `npm audit: 0 vulns`

---

### 🚀 Quick Start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serve dist
npm run lint
```

---

### 📁 Structure

```
src/
  App.jsx                 # strip + camera + grain + preview state
  index.css               # true-black + fog + user-select none
  App.css                 # glass system + timer + strip + modal
  lib/photobooth.js       # FILTERS, FRAMES, applyGrade, composeStrip, addGrain
  lib/emoji.js            # iPhone CDN helper
  components/
    CameraPane.jsx        # graded canvas preview (RAF)
    FilterPicker.jsx      # grouped swatches + foggy thumbnails
    StripPane.jsx         # draggable stickers
    GlassSelect.jsx       # foggy dropdown
    CursorGlow.jsx        # 820px fog orb + card spotlight
    PreviewModal.jsx
    LoadingScreen.jsx     # preloads iPhone emoji + fonts
```

---

### 🌗 Deployment

Static — no server.

**Vercel (recommended):**
```bash
vercel --prod
# or: vercel.com → Import rizzhan/mira → Build: npm run build → Output: dist
```

**GitHub Pages:**
```bash
# vite.config.js → base: '/mira/'
npm i -D gh-pages
npm run build && npx gh-pages -d dist
```

---

### 🔗 Links

- GitHub: `github.com/rizzhan`
- LinkedIn: `linkedin.com/in/rishan-paul-0a2b36343`
- Instagram: `@r.1zzhan`

---

### 📄 License

MIT — do what you want, keep the strip.
