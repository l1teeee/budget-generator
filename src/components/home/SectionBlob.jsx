/* Organic paint-splash / aura behind a section's content.
   Soft radial-gradient blob inside an oversized viewBox so the CSS blur
   never clips. Sits behind content (z-index 0) and ignores pointer events.
   Variants only change color + a small offset so sections don't look identical. */

const BLOBS = {
  center: { inner: '#FFFFFF', outer: '#C8D4FF' },
  left: { inner: '#E4EFD9', outer: '#CBDDBD' },
  right: { inner: '#FBE7D8', outer: '#F0CDB4' },
}

const BLOB_PATH =
  'M150 44 C198 36 256 70 262 126 C268 182 232 232 172 240 ' +
  'C112 248 52 222 42 162 C32 104 102 52 150 44 Z'

export default function SectionBlob({ variant = 'center', parallax = false, depth = 0.16 }) {
  const { inner, outer } = BLOBS[variant] || BLOBS.center
  const gid = 'lk-blob-grad-' + variant
  const className = 'lk-blob lk-blob--' + variant + (parallax ? ' lk-parallax' : '')

  return (
    <svg
      className={className}
      data-depth={parallax ? depth : undefined}
      viewBox="0 0 300 280"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gid} cx="48%" cy="42%" r="62%">
          <stop offset="0%" stopColor={inner} stopOpacity="0.55" />
          <stop offset="52%" stopColor={outer} stopOpacity="0.34" />
          <stop offset="100%" stopColor={outer} stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={BLOB_PATH} fill={'url(#' + gid + ')'} />
    </svg>
  )
}
