import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

function prefersReduced() {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useStepEntrance(scopeRef) {
  useGSAP(() => {
    if (prefersReduced()) return
    gsap.from('[data-animate]', {
      y: 8,
      opacity: 0,
      duration: 0.26,
      ease: 'power3.out',
      stagger: 0.04,
    })
  }, { scope: scopeRef })
}

export function useCountUp(ref, value, format) {
  const prev = useRef(0)
  useGSAP(() => {
    if (!ref.current) return
    if (prefersReduced()) {
      ref.current.textContent = format(value)
      prev.current = value
      return
    }
    const proxy = { v: prev.current }
    gsap.to(proxy, {
      v: value,
      duration: 0.42,
      ease: 'power2.out',
      onUpdate: () => {
        if (ref.current) ref.current.textContent = format(proxy.v)
      },
      onComplete: () => { prev.current = value },
    })
  }, { dependencies: [value], scope: ref })
}

export function useProgressFill(ref, ratio) {
  useGSAP(() => {
    gsap.to(ref.current, {
      scaleY: ratio,
      duration: prefersReduced() ? 0 : 0.28,
      ease: 'power3.inOut',
      transformOrigin: 'top',
    })
  }, { dependencies: [ratio], scope: ref })
}

export function usePreviewSwap(scopeRef, dep) {
  useGSAP(() => {
    if (prefersReduced()) {
      gsap.set(scopeRef.current, { opacity: 1, y: 0 })
      return
    }
    gsap.fromTo(scopeRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.24, ease: 'power3.out' }
    )
  }, { dependencies: [dep], scope: scopeRef })
}

export function usePDFButtonHover(btnRef, fillRef, labelRef) {
  useGSAP((context, contextSafe) => {
    if (!btnRef.current) return
    gsap.set(fillRef.current, { scaleX: 0, transformOrigin: 'left' })

    const enter = contextSafe(() => {
      gsap.to(fillRef.current, { scaleX: 1, duration: 0.2, ease: 'power3.inOut' })
      gsap.to(labelRef.current, { color: '#061b3d', duration: 0.16, delay: 0.04 })
    })
    const leave = contextSafe(() => {
      gsap.to(fillRef.current, { scaleX: 0, duration: 0.16, ease: 'power3.inOut' })
      gsap.to(labelRef.current, { color: '#ffffff', duration: 0.14 })
    })

    const el = btnRef.current
    el.addEventListener('mouseenter', enter)
    el.addEventListener('mouseleave', leave)
    return () => {
      el.removeEventListener('mouseenter', enter)
      el.removeEventListener('mouseleave', leave)
    }
  }, { scope: btnRef })
}
