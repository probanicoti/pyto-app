import { toneStyle, TONE_IDS } from './tones.js'

// Instagram portrait feed post ratio (4:5), which also works fine as a
// square crop if you post it elsewhere.
const WIDTH = 1080
const HEIGHT = 1350
const MARGIN = 84
const HANDLE = '@probanicoti'

// A few preset glow positions and diagonal directions. Which one a given
// card gets is derived from the article's id, so the same headline always
// renders the same way, but different headlines fan out across all of them
// — a diverse-looking grid without anything looking random or clashing.
const CORNERS = [
  { x: 0.88, y: 0.08 },
  { x: 0.12, y: 0.08 },
  { x: 0.88, y: 0.9 },
  { x: 0.12, y: 0.9 },
  { x: 0.5, y: 0.06 }
]
const DIAGONALS = [
  [0, 0, WIDTH, HEIGHT],
  [WIDTH, 0, 0, HEIGHT],
  [0, HEIGHT, WIDTH, 0],
  [WIDTH, HEIGHT, 0, 0]
]

function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let current = ''
  for (const word of words) {
    const test = current ? `${current} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

async function ensureFontsLoaded() {
  const specs = [
    '700 84px "Space Grotesk"',
    '600 30px "Inter"',
    '400 34px "Inter"'
  ]
  await Promise.all(specs.map((spec) => document.fonts.load(spec)))
  await document.fonts.ready
}

function drawGrain(ctx, w, h) {
  const tile = document.createElement('canvas')
  tile.width = 160
  tile.height = 160
  const tctx = tile.getContext('2d')
  const imageData = tctx.createImageData(160, 160)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const v = Math.random() * 255
    imageData.data[i] = v
    imageData.data[i + 1] = v
    imageData.data[i + 2] = v
    imageData.data[i + 3] = Math.random() * 12
  }
  tctx.putImageData(imageData, 0, 0)
  ctx.save()
  ctx.globalCompositeOperation = 'overlay'
  ctx.fillStyle = ctx.createPattern(tile, 'repeat')
  ctx.fillRect(0, 0, w, h)
  ctx.restore()
}

function drawBackground(ctx, article, tone) {
  const hash = hashString(article.id || article.title || 'card')

  ctx.fillStyle = '#0E0F14'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  // A faint two-tone diagonal wash for variety, using this card's tone plus
  // a second tone picked deterministically from the palette.
  const otherTones = TONE_IDS.filter((id) => id !== article.tone)
  const secondary = toneStyle(otherTones[hash % otherTones.length])
  const [x0, y0, x1, y1] = DIAGONALS[Math.floor(hash / 7) % DIAGONALS.length]
  const wash = ctx.createLinearGradient(x0, y0, x1, y1)
  wash.addColorStop(0, `${tone.color}1f`)
  wash.addColorStop(1, `${secondary.color}14`)
  ctx.fillStyle = wash
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  // The main glow, anchored at one of a few preset corners per card.
  const corner = CORNERS[Math.floor(hash / 13) % CORNERS.length]
  const glow = ctx.createRadialGradient(
    WIDTH * corner.x, HEIGHT * corner.y, 0,
    WIDTH * corner.x, HEIGHT * corner.y, WIDTH * 0.75
  )
  glow.addColorStop(0, `${tone.color}33`)
  glow.addColorStop(1, 'transparent')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  drawGrain(ctx, WIDTH, HEIGHT)
}

export async function exportCardAsPng(article) {
  await ensureFontsLoaded()

  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx = canvas.getContext('2d')
  const tone = toneStyle(article.tone)

  drawBackground(ctx, article, tone)

  // Wordmark
  ctx.fillStyle = '#7D8194'
  ctx.font = '600 30px "Inter"'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('doomscroll, but funnier', MARGIN, 100)

  // Tone chip, top right
  ctx.font = '600 28px "Inter"'
  const chipLabel = tone.label
  const chipWidth = ctx.measureText(chipLabel).width + 56
  const chipX = WIDTH - MARGIN - chipWidth
  ctx.fillStyle = `${tone.color}26`
  roundRect(ctx, chipX, 62, chipWidth, 54, 27)
  ctx.fill()
  ctx.fillStyle = tone.color
  ctx.beginPath()
  ctx.arc(chipX + 26, 89, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillText(chipLabel, chipX + 44, 98)

  // Caption — the hero of the image
  ctx.fillStyle = '#F3EFE6'
  ctx.font = '700 84px "Space Grotesk"'
  const captionLines = wrapText(ctx, article.caption || 'The AI had no comment.', WIDTH - MARGIN * 2)
  const lineHeight = 96
  const blockHeight = captionLines.length * lineHeight
  let y = HEIGHT / 2 - blockHeight / 2 + 30
  for (const line of captionLines) {
    ctx.fillText(line, MARGIN, y)
    y += lineHeight
  }

  // Divider
  ctx.strokeStyle = '#23262F'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(MARGIN, HEIGHT - 258)
  ctx.lineTo(WIDTH - MARGIN, HEIGHT - 258)
  ctx.stroke()

  // Original headline, quiet context
  ctx.fillStyle = '#8A8DA0'
  ctx.font = '400 34px "Inter"'
  const headlineLines = wrapText(ctx, article.title, WIDTH - MARGIN * 2).slice(0, 3)
  let hy = HEIGHT - 200
  for (const line of headlineLines) {
    ctx.fillText(line, MARGIN, hy)
    hy += 44
  }

  // Bottom row: source on the left, the brand handle on the right
  ctx.textAlign = 'left'
  ctx.fillStyle = '#4B4E5C'
  ctx.font = '600 26px "Inter"'
  ctx.fillText(article.source || '', MARGIN, HEIGHT - 56)

  ctx.textAlign = 'right'
  ctx.fillStyle = tone.color
  ctx.font = '600 26px "Inter"'
  ctx.fillText(HANDLE, WIDTH - MARGIN, HEIGHT - 56)
  ctx.textAlign = 'left'

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function slugify(text, max = 60) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, max) || 'card'
}
