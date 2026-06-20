import { useCallback, useEffect, useState } from 'react'

function prefersReduced() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isTypingTarget(target) {
  if (!target) {
    return false
  }

  return (
    target.tagName === 'INPUT'
    || target.tagName === 'TEXTAREA'
    || target.isContentEditable
  )
}

export function useWorldNav() {
  const [active, setActive] = useState('center')
  const [reduced, setReduced] = useState(prefersReduced)

  const navigate = useCallback((target = 'center') => {
    setActive(target)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return undefined
    }

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')

    function updateReduced() {
      setReduced(media.matches)
    }

    updateReduced()
    media.addEventListener('change', updateReduced)

    return () => media.removeEventListener('change', updateReduced)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined
    }

    document.body.classList.toggle('lk-locked', active !== 'center')

    return () => document.body.classList.remove('lk-locked')
  }, [active])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    function handleKeyDown(event) {
      if (isTypingTarget(event.target)) {
        return
      }

      let handled = false

      if (active === 'center') {
        if (event.key === 'ArrowLeft') {
          navigate('left')
          handled = true
        } else if (event.key === 'ArrowRight') {
          navigate('right')
          handled = true
        }
      } else if (
        event.key === 'Escape'
        || event.key === 'ArrowUp'
        || (active === 'left' && event.key === 'ArrowRight')
        || (active === 'right' && event.key === 'ArrowLeft')
      ) {
        navigate()
        handled = true
      }

      if (handled) {
        event.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [active, navigate])

  return { active, navigate, reduced }
}
