/* Smooth multi-wave connector curve, uniform width.
   centerPoints builds a wavy centerline (several gentle waves anchored at both
   ends); smoothPath threads a Catmull-Rom spline through them so the result is a
   continuous smooth curve with many turns. It is stroked at a constant width
   (round caps) so the line stays uniform, just wider and curvier. */

function centerPoints(s, e, opts = {}) {
  const n = opts.samples || 52
  const waves = opts.waves || 2.6
  const waveAmp = opts.waveAmp || 48
  const phase = opts.phase || 0
  const asym = opts.asymmetry || 0
  const dx = e.x - s.x
  const dy = e.y - s.y
  const len = Math.hypot(dx, dy) || 1
  // unit perpendicular to the overall direction (waves push along this axis)
  const px = -dy / len
  const py = dx / len
  const pts = []

  for (let i = 0; i <= n; i++) {
    const t = i / n
    // envelope pins both ends to s and e so the line exits the edges cleanly
    const env = Math.pow(Math.sin(Math.PI * t), 0.85)
    // three blended harmonics -> more, non-identical turns (creative squiggle)
    const wave =
      Math.sin(t * Math.PI * waves + phase) +
      0.42 * Math.sin(t * Math.PI * waves * 1.7 + phase * 1.5) +
      0.22 * Math.sin(t * Math.PI * waves * 2.6 + phase * 0.7)
    const off = waveAmp * env * (wave / 1.64) + asym * waveAmp * env * 0.5

    pts.push({
      x: s.x + dx * t + px * off,
      y: s.y + dy * t + py * off,
    })
  }

  return pts
}

function smoothPath(pts) {
  if (pts.length < 2) return ''

  let d = 'M ' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1)

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6

    d += ' C ' + c1x.toFixed(1) + ' ' + c1y.toFixed(1)
      + ', ' + c2x.toFixed(1) + ' ' + c2y.toFixed(1)
      + ', ' + p2.x.toFixed(1) + ' ' + p2.y.toFixed(1)
  }

  return d
}

export function buildConnectorCurve(s, e, opts) {
  return smoothPath(centerPoints(s, e, opts))
}
