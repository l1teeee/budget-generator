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

  const borderColor = error ? '#d98a8a' : focused ? '#061b3d' : '#d7e1ee'
  const labelColor = error ? '#b4564f' : focused ? '#061b3d' : '#53627a'

  return (
    <div data-animate style={{ marginBottom: '18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
        <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: labelColor,
            transition: 'color 160ms ease',
        }}>
          {label}{required ? ' *' : ''}
        </span>
        {error && (
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9px',
            letterSpacing: '0.08em',
            color: '#b4564f',
          }}>
            required
          </span>
        )}
      </div>

      <div style={{
        display: 'flex',
        alignItems: textarea ? 'flex-start' : 'center',
        gap: '10px',
        background: '#ffffff',
        border: `1.5px solid ${borderColor}`,
        borderRadius: textarea ? '14px' : '999px',
        padding: textarea ? '12px 16px' : '11px 16px',
        transition: 'border-color 180ms ease, box-shadow 180ms ease, transform 160ms cubic-bezier(0.23, 1, 0.32, 1)',
        boxShadow: focused ? '0 0 0 4px rgba(6,27,61,0.12), 0 12px 30px -26px rgba(2,8,23,0.45)' : '0 10px 24px -24px rgba(2,8,23,0.32)',
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
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              lineHeight: 1.6,
              color: '#061124',
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
              fontFamily: mono ? "'JetBrains Mono', monospace" : "'Inter', sans-serif",
              fontSize: '14px',
              color: '#061124',
              letterSpacing: mono ? '0.02em' : '0',
            }}
          />
        )}

        {focused && !textarea && (
          <span style={{
            width: '7px',
            height: '15px',
            borderRadius: '2px',
            background: '#061b3d',
            animation: 'caret-blink 1.05s step-end infinite',
            flexShrink: 0,
          }} />
        )}
      </div>
    </div>
  )
}
