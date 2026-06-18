import { useState } from 'react'
import { useFormStore } from '../../hooks/useFormStore'
import { quoteToJsonString, parseQuoteJson, formatJsonString, downloadJson } from '../../lib/quoteJson'

function PanelButton({ onClick, children, solid = false }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '11px',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        padding: '9px 14px',
        borderRadius: '999px',
        color: solid ? '#ffffff' : '#061b3d',
        background: solid ? '#061b3d' : '#ffffff',
        border: `1px solid ${solid ? 'transparent' : '#d7e1ee'}`,
        boxShadow: solid ? '0 12px 28px -22px rgba(2,8,23,0.72)' : '0 10px 24px -24px rgba(2,8,23,0.34)',
      }}
      onMouseEnter={e => {
        if (solid) e.currentTarget.style.background = '#0b2a5b'
        else {
          e.currentTarget.style.background = '#f7fbff'
          e.currentTarget.style.borderColor = '#aebed2'
        }
      }}
      onMouseLeave={e => {
        if (solid) e.currentTarget.style.background = '#061b3d'
        else {
          e.currentTarget.style.background = '#ffffff'
          e.currentTarget.style.borderColor = '#d7e1ee'
        }
      }}
    >
      {children}
    </button>
  )
}

export default function JsonPanel({ open, onClose }) {
  const { state, replaceQuote } = useFormStore()
  const [text, setText] = useState(() => quoteToJsonString(state))
  const [status, setStatus] = useState(null)

  if (!open) return null

  const flash = (kind, msg) => setStatus({ kind, msg })

  const onFormat = () => {
    const r = formatJsonString(text)
    if (r.ok) { setText(r.formatted); flash('ok', 'formatted') }
    else flash('err', r.error)
  }

  const onImport = () => {
    const r = parseQuoteJson(text)
    if (r.ok) { replaceQuote(r.data); flash('ok', 'imported into editor') }
    else flash('err', r.error)
  }

  const onExport = () => {
    const date = new Date().toISOString().split('T')[0]
    downloadJson(text, `quote-${date}.json`)
    flash('ok', 'downloaded .json')
  }

  const onCopy = async () => {
    try { await navigator.clipboard.writeText(text); flash('ok', 'copied to clipboard') }
    catch { flash('err', 'clipboard blocked') }
  }

  const onFile = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { setText(String(reader.result)); flash('ok', 'file loaded / review then import') }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(2,8,23,0.72)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '640px',
          maxWidth: '100%',
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',
          border: '1px solid #d7e1ee',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 28px 70px -24px rgba(2,8,23,0.68)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #d7e1ee' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#061124' }}>
            {'{ }'} quote.json
          </span>
          <button
            aria-label="Close JSON panel"
            onClick={onClose}
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '18px', color: '#53627a', lineHeight: 1, width: '28px', height: '28px', borderRadius: '999px' }}
          >
            x
          </button>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          spellCheck={false}
          className="scroll-thin"
          style={{
            flex: 1,
            minHeight: '320px',
            resize: 'none',
            margin: '16px',
            padding: '16px 18px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            lineHeight: 1.65,
            color: '#061124',
            background: '#f7fbff',
            border: '1px solid #dce6f4',
            borderRadius: '8px',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 20px 18px', flexWrap: 'wrap' }}>
          <PanelButton onClick={onFormat}>format</PanelButton>
          <PanelButton onClick={onCopy}>copy</PanelButton>
          <label style={{ display: 'inline-flex' }}>
            <span
              style={{
                cursor: 'pointer',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '9px 14px',
                borderRadius: '999px',
                color: '#061b3d',
                background: '#ffffff',
                border: '1px solid #d7e1ee',
                boxShadow: '0 10px 24px -24px rgba(2,8,23,0.34)',
              }}
            >
              load file
            </span>
            <input type="file" accept="application/json,.json" onChange={onFile} style={{ display: 'none' }} />
          </label>
          <PanelButton onClick={onExport}>download</PanelButton>
          <div style={{ flex: 1 }} />
          {status && (
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.05em',
              color: status.kind === 'ok' ? '#061b3d' : '#b4564f',
            }}>
              {status.msg}
            </span>
          )}
          <PanelButton onClick={onImport} solid>import</PanelButton>
        </div>
      </div>
    </div>
  )
}
