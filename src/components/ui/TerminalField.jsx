import { useState } from 'react'

export default function TerminalField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  error = false,
  textarea = false,
  mono = false,
}) {
  const [focused, setFocused] = useState(false)

  const borderColor = error ? '#d98a8a' : focused ? '#16161D' : 'rgba(22,22,29,0.18)'
  const labelColor = error ? '#b4564f' : focused ? '#16161D' : '#565563'

  return (
    <div data-animate style={{ marginBottom: '18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
        <span style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontSize: '9px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: labelColor,
            fontWeight: 800,
            transition: 'color 160ms ease',
        }}>
          {label}{required ? ' *' : ''}
        </span>
        {error && (
          <span style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontSize: '9px',
            letterSpacing: '0.08em',
            color: '#b4564f',
            fontWeight: 800,
          }}>
            required
          </span>
        )}
      </div>

      <div style={{
        display: 'flex',
        alignItems: textarea ? 'flex-start' : 'center',
        gap: '10px',
        background: '#FCFBF8',
        border: `1.5px solid ${borderColor}`,
        borderRadius: textarea ? '14px' : '999px',
        padding: textarea ? '12px 16px' : '11px 16px',
        transition: 'border-color 180ms ease, background-color 180ms ease',
        boxShadow: focused ? '0 0 0 4px rgba(174,194,255,0.32)' : 'none',
      }}>
        {textarea ? (
          <textarea
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            rows={3}
            style={{
              flex: 1,
              resize: 'none',
              fontFamily: 'inherit',
              fontSize: '14px',
              lineHeight: 1.6,
              color: '#16161D',
            }}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            style={{
              flex: 1,
              fontFamily: 'inherit',
              fontSize: '14px',
              fontWeight: mono ? 700 : 500,
              color: '#16161D',
              letterSpacing: '0',
            }}
          />
        )}

        {focused && !textarea && (
          <span style={{
            width: '7px',
            height: '15px',
            borderRadius: '2px',
            background: '#16161D',
            animation: 'caret-blink 1.05s step-end infinite',
            flexShrink: 0,
          }} />
        )}
      </div>
    </div>
  )
}
