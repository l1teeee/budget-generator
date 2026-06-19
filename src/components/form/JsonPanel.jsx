import { useMemo, useState } from 'react'
import { useFormStore } from '../../hooks/useFormStore'
import { quoteToJsonString, parseQuoteJson, formatJsonString, downloadJson } from '../../lib/quoteJson'
import { getQuoteCompleteness } from '../../lib/quoteCompleteness'

function PanelButton({ onClick, children, solid = false }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'Hanken Grotesk', sans-serif",
        fontWeight: 800,
        fontSize: '11px',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        padding: '9px 14px',
        borderRadius: '999px',
        color: solid ? '#F1EFE9' : '#16161D',
        background: solid ? '#16161D' : '#FCFBF8',
        border: `1.5px solid ${solid ? '#16161D' : 'rgba(22,22,29,0.22)'}`,
      }}
      onMouseEnter={e => {
        if (solid) {
          e.currentTarget.style.background = '#AEC2FF'
          e.currentTarget.style.color = '#16161D'
        }
        else {
          e.currentTarget.style.background = '#F6F4EE'
          e.currentTarget.style.borderColor = '#16161D'
        }
      }}
      onMouseLeave={e => {
        if (solid) {
          e.currentTarget.style.background = '#16161D'
          e.currentTarget.style.color = '#F1EFE9'
        }
        else {
          e.currentTarget.style.background = '#FCFBF8'
          e.currentTarget.style.borderColor = 'rgba(22,22,29,0.22)'
        }
      }}
    >
      {children}
    </button>
  )
}

export default function JsonPanel({ open, onClose }) {
  const { state, replaceQuote, setStep } = useFormStore()
  const [text, setText] = useState(() => quoteToJsonString(state))
  const [status, setStatus] = useState(null)
  const preview = useMemo(() => {
    const parsed = parseQuoteJson(text)
    if (!parsed.ok) return { ok: false, message: parsed.error }
    const completeness = getQuoteCompleteness(parsed.data)
    return {
      ok: true,
      message: completeness.complete
        ? 'Ready to export after import'
        : `${completeness.missingFields.length} required field${completeness.missingFields.length === 1 ? '' : 's'} still missing`,
      completeness,
    }
  }, [text])

  if (!open) return null

  const flash = (kind, msg) => setStatus({ kind, msg })

  const onFormat = () => {
    const r = formatJsonString(text)
    if (r.ok) { setText(r.formatted); flash('ok', 'formatted') }
    else flash('err', r.error)
  }

  const onImport = () => {
    const r = parseQuoteJson(text)
    if (r.ok) {
      const completeness = getQuoteCompleteness(r.data)
      replaceQuote(r.data)
      setStep(completeness.firstIncompleteStep?.number || 4)
      flash('ok', 'imported into editor')
    }
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
        background: 'rgba(22,22,29,0.46)',
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
          background: '#FCFBF8',
          border: '1.5px solid #16161D',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(22,22,29,0.16)' }}>
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#16161D' }}>
            {'{ }'} quote.json
          </span>
          <button
            aria-label="Close JSON panel"
            onClick={onClose}
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '18px', color: '#565563', lineHeight: 1, width: '28px', height: '28px', borderRadius: '999px' }}
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
            color: '#16161D',
            background: '#F6F4EE',
            border: '1.5px solid rgba(22,22,29,0.18)',
            borderRadius: '12px',
          }}
        />

        <div style={{
          margin: '0 20px 14px',
          padding: '12px 14px',
          background: preview.ok ? '#EAEEFB' : '#fff1f3',
          border: `1.5px solid ${preview.ok ? 'rgba(22,22,29,0.14)' : '#f1c9d0'}`,
          borderRadius: '14px',
          color: preview.ok ? '#16161D' : '#b4564f',
          fontSize: '13px',
          fontWeight: 700,
        }}>
          {preview.message}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 20px 18px', flexWrap: 'wrap' }}>
          <PanelButton onClick={onFormat}>format</PanelButton>
          <PanelButton onClick={onCopy}>copy</PanelButton>
          <label style={{ display: 'inline-flex' }}>
            <span
              onMouseEnter={e => {
                e.currentTarget.style.background = '#F6F4EE'
                e.currentTarget.style.borderColor = '#16161D'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#FCFBF8'
                e.currentTarget.style.borderColor = 'rgba(22,22,29,0.22)'
              }}
              style={{
                cursor: 'pointer',
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: '11px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '9px 14px',
                borderRadius: '999px',
                color: '#16161D',
                background: '#FCFBF8',
                border: '1.5px solid rgba(22,22,29,0.22)',
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
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: '10px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: status.kind === 'ok' ? '#16161D' : '#b4564f',
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
