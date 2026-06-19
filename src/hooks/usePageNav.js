import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'

function prefersReduced() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function usePageNav() {
  const navigate = useNavigate()

  function goTo(path) {
    const el = document.querySelector('.page-tr')
    if (!el || prefersReduced()) {
      navigate(path)
      return
    }
    gsap.to(el, {
      opacity: 0,
      y: -10,
      duration: 0.18,
      ease: 'power2.in',
      overwrite: true,
      onComplete: () => navigate(path),
    })
  }

  return { goTo }
}
