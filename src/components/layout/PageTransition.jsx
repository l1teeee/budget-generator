import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

function prefersReduced() {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function PageTransition({ children }) {
  const ref = useRef(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return

    if (prefersReduced()) {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: 'none', clearProps: 'all' })
      return
    }

    gsap.fromTo(
      el,
      { opacity: 0, y: 12, filter: 'blur(6px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.26,
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
