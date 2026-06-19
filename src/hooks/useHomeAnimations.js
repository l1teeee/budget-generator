import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollToPlugin)

const HEADER_OFFSET = 96

const STEP_COLORS = {
  paper: '#FCFBF8',
  ink: '#16161D',
  inkSoft: '#1D1D26',
  muted: '#565563',
  blue: '#AEC2FF',
}

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

export function scrollToLandingSection(id) {
  if (typeof window === 'undefined') return

  const target = id === 'top' ? 0 : document.getElementById(id)
  if (target === null) return

  if (prefersReduced()) {
    if (target === 0) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }

    const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
    window.scrollTo({ top, behavior: 'auto' })
    return
  }

  gsap.to(window, {
    duration: 0.68,
    ease: 'power3.out',
    overwrite: 'auto',
    scrollTo: {
      y: target,
      offsetY: target === 0 ? 0 : HEADER_OFFSET,
      autoKill: true,
    },
  })
}

export function useHomeAnimations(scopeRef) {
  useGSAP(() => {
    const root = scopeRef.current
    if (!root) return

    const reduceMotion = prefersReduced()
    const cleanup = []
    const revealSections = gsap.utils.toArray('.js-reveal', root)
    const stepCards = gsap.utils.toArray('.lk-step', root)

    if (reduceMotion) {
      gsap.set(revealSections, { clearProps: 'all' })
      gsap.set(stepCards, { clearProps: 'all' })
      return
    }

    if (typeof IntersectionObserver === 'function') {
      revealSections.forEach((section) => {
        const cards = section.matches('.lk-steps')
          ? gsap.utils.toArray('.lk-step', section)
          : []

        gsap.set(section, {
          autoAlpha: 0,
          y: 26,
          filter: 'blur(8px)',
          willChange: 'transform, opacity, filter',
        })

        if (cards.length) {
          gsap.set(cards, {
            autoAlpha: 0,
            y: 18,
            willChange: 'transform, opacity',
          })
        }
      })

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          const section = entry.target
          const cards = section.matches('.lk-steps')
            ? gsap.utils.toArray('.lk-step', section)
            : []

          const timeline = gsap.timeline({
            defaults: { ease: 'power3.out' },
            onComplete: () => {
              gsap.set(section, { clearProps: 'filter,transform,opacity,visibility,willChange' })
              if (cards.length) {
                gsap.set(cards, { clearProps: 'transform,opacity,visibility,willChange' })
              }
            },
          })

          timeline.to(section, {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.46,
          })

          if (cards.length) {
            timeline.to(cards, {
              autoAlpha: 1,
              y: 0,
              duration: 0.34,
              stagger: 0.055,
            }, '-=0.2')
          }

          observer.unobserve(section)
        })
      }, {
        rootMargin: '0px 0px -14% 0px',
        threshold: 0.16,
      })

      revealSections.forEach((section) => observer.observe(section))
      cleanup.push(() => observer.disconnect())
    }

    if (hasFinePointer()) {
      stepCards.forEach((card) => {
        const number = card.querySelector('.lk-step-n')
        const name = card.querySelector('.lk-step-name')
        const status = card.querySelector('.lk-step-status')
        const primaryText = [number, name].filter(Boolean)
        const allText = [number, name, status].filter(Boolean)

        const enter = () => {
          gsap.to(card, {
            backgroundColor: STEP_COLORS.blue,
            borderColor: STEP_COLORS.ink,
            y: -4,
            duration: 0.24,
            ease: 'power3.out',
            overwrite: true,
          })
          gsap.to(primaryText, {
            color: STEP_COLORS.ink,
            duration: 0.18,
            ease: 'power2.out',
            overwrite: true,
          })
          if (status) {
            gsap.to(status, {
              color: STEP_COLORS.inkSoft,
              duration: 0.18,
              ease: 'power2.out',
              overwrite: true,
            })
          }
        }

        const leave = () => {
          gsap.to(card, {
            backgroundColor: STEP_COLORS.paper,
            borderColor: STEP_COLORS.ink,
            y: 0,
            duration: 0.26,
            ease: 'power3.out',
            overwrite: true,
          })
          gsap.to(primaryText, {
            color: STEP_COLORS.ink,
            duration: 0.18,
            ease: 'power2.out',
            overwrite: true,
          })
          if (status) {
            gsap.to(status, {
              color: STEP_COLORS.muted,
              duration: 0.18,
              ease: 'power2.out',
              overwrite: true,
            })
          }
        }

        card.addEventListener('pointerenter', enter)
        card.addEventListener('pointerleave', leave)
        cleanup.push(() => {
          card.removeEventListener('pointerenter', enter)
          card.removeEventListener('pointerleave', leave)
          gsap.killTweensOf([card, ...allText])
        })
      })
    }

    return () => {
      cleanup.forEach((dispose) => dispose())
      gsap.killTweensOf([...revealSections, ...stepCards])
    }
  }, { scope: scopeRef })
}
