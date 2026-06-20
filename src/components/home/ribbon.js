function cubic(p0, p1, p2, p3, t) {
  const mt = 1 - t
  const a = mt * mt * mt
  const b = 3 * mt * mt * t
  const c = 3 * mt * t * t
  const d = t * t * t
  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  }
}

function cubicD(p0, p1, p2, p3, t) {
  const mt = 1 - t
  const a = 3 * mt * mt
  const b = 6 * mt * t
  const c = 3 * t * t
  return {
    x: a * (p1.x - p0.x) + b * (p2.x - p1.x) + c * (p3.x - p2.x),
    y: a * (p1.y - p0.y) + b * (p2.y - p1.y) + c * (p3.y - p2.y),
  }
}

function getControls(s, e, opts = {}) {
  const dx = e.x - s.x
  const dy = e.y - s.y
  const waveAmp = opts.waveAmp || 26
  const asymmetry = opts.asymmetry || 0.14
  const c1 = {
    x: s.x + dx * (0.28 + asymmetry * 0.2),
    y: s.y + dy * 0.12 - waveAmp,
  }
  const c2 = {
    x: s.x + dx * (0.72 - asymmetry * 0.2),
    y: e.y - dy * 0.12 + waveAmp * 0.74,
  }

  return { c1, c2 }
}

function halfWidthAt(t, opts = {}) {
  const maxHalf = opts.maxHalf || 24
  const minHalf = opts.minHalf || Math.max(6, maxHalf * 0.18)
  const belly = Math.pow(Math.sin(Math.PI * t), 0.64)
  const irregular = 1 + Math.sin(t * Math.PI * 3.1 + 0.45) * 0.09
  const taper = minHalf + (maxHalf - minHalf) * belly * irregular

  return Math.max(minHalf, taper)
}

export function buildRibbon(s, e, opts) {
  const n = (opts && opts.samples) || 40
  const { c1, c2 } = getControls(s, e, opts)
  const top = []
  const bot = []

  for (let i = 0; i <= n; i++) {
    const t = i / n
    const p = cubic(s, c1, c2, e, t)
    const d = cubicD(s, c1, c2, e, t)
    const len = Math.hypot(d.x, d.y) || 1
    const nx = -d.y / len
    const ny = d.x / len
    const hw = halfWidthAt(t, opts)

    top.push({ x: p.x + nx * hw, y: p.y + ny * hw })
    bot.push({ x: p.x - nx * hw, y: p.y - ny * hw })
  }

  let d = 'M ' + top[0].x.toFixed(1) + ' ' + top[0].y.toFixed(1)
  for (let i = 1; i < top.length; i++) d += ' L ' + top[i].x.toFixed(1) + ' ' + top[i].y.toFixed(1)
  for (let i = bot.length - 1; i >= 0; i--) d += ' L ' + bot[i].x.toFixed(1) + ' ' + bot[i].y.toFixed(1)
  d += ' Z'
  return d
}

export function buildRibbonSpine(s, e, opts) {
  const { c1, c2 } = getControls(s, e, opts)

  return 'M ' + s.x.toFixed(1) + ' ' + s.y.toFixed(1)
    + ' C ' + c1.x.toFixed(1) + ' ' + c1.y.toFixed(1)
    + ', ' + c2.x.toFixed(1) + ' ' + c2.y.toFixed(1)
    + ', ' + e.x.toFixed(1) + ' ' + e.y.toFixed(1)
}
