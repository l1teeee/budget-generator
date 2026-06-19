import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

function prefersReduced() {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function hasFinePointer() {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

export function useStepEntrance(scopeRef) {
  useGSAP(() => {
    gsap.set('[data-animate]', { clearProps: 'filter,opacity,transform' })
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
      duration: 0.22,
      ease: 'power2.out',
      overwrite: true,
      onUpdate: () => {
        if (ref.current) ref.current.textContent = format(proxy.v)
      },
      onComplete: () => { prev.current = value },
    })
  }, { dependencies: [value], scope: ref })
}

export function useProgressFill(ref, ratio) {
  useGSAP(() => {
    if (!ref.current) return
    gsap.to(ref.current, {
      scaleX: ratio,
      duration: prefersReduced() ? 0 : 0.2,
      ease: 'power2.out',
      transformOrigin: 'left',
      overwrite: true,
    })
  }, { dependencies: [ratio], scope: ref })
}

export function usePreviewSwap(scopeRef, dep) {
  useGSAP(() => {
    if (!scopeRef.current) return
    if (prefersReduced()) {
      gsap.set(scopeRef.current, { opacity: 1, clearProps: 'filter,transform' })
      return
    }
    gsap.fromTo(scopeRef.current,
      { opacity: 0.96 },
      {
        opacity: 1,
        duration: 0.16,
        ease: 'power2.out',
        overwrite: true,
        clearProps: 'opacity',
      }
    )
  }, { dependencies: [dep], scope: scopeRef })
}

export function usePDFButtonHover(btnRef, fillRef, labelRef) {
  useGSAP(() => {
    const btn = btnRef.current
    const fill = fillRef.current
    const label = labelRef.current
    if (!btn || !fill || !label) return

    gsap.set(fill, { scaleX: 0, transformOrigin: 'left' })
    if (prefersReduced() || !hasFinePointer()) return

    const enter = () => {
      if (btn.disabled) return
      gsap.to(btn, { y: -1, duration: 0.12, ease: 'power2.out', overwrite: true })
    }
    const leave = () => {
      gsap.to(btn, { y: 0, duration: 0.12, ease: 'power2.out', overwrite: true })
      gsap.set(label, { color: '#F1EFE9' })
    }

    btn.addEventListener('pointerenter', enter)
    btn.addEventListener('pointerleave', leave)
    return () => {
      btn.removeEventListener('pointerenter', enter)
      btn.removeEventListener('pointerleave', leave)
      gsap.killTweensOf([btn, fill, label])
    }
  }, { scope: btnRef })
}
