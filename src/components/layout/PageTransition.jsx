import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

function prefersReduced() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function PageTransition({ children }) {
  const ref = useRef(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return

    if (prefersReduced()) {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: 'none', clearProps: 'all' })
      return
    }

    gsap.fromTo(
      el,
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.38,
        ease: 'power3.out',
        clearProps: 'all',
      }
    )
  }, { scope: ref })

  return (
    <div className="page-tr" ref={ref}>
      {children}
    </div>
  )
}
