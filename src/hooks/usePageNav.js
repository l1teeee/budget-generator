import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'

function prefersReduced() {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function usePageNav() {
  const navigate = useNavigate()
  const navigatingRef = useRef(false)

  function goTo(path) {
    if (navigatingRef.current) return
    if (typeof window !== 'undefined' && window.location.pathname === path) return

    const el = document.querySelector('.page-tr')
    if (!el || prefersReduced()) {
      navigate(path)
      return
    }
    navigatingRef.current = true
    gsap.to(el, {
      opacity: 0,
      y: -8,
      filter: 'blur(5px)',
      duration: 0.2,
      ease: 'power2.in',
      overwrite: true,
      onComplete: () => {
        navigate(path)
        requestAnimationFrame(() => {
          navigatingRef.current = false
        })
      },
    })
  }

  return { goTo }
}
