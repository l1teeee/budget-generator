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
  border: '#7E98F2',
  borderSoft: 'rgba(92,99,122,0.24)',
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
    let heroTimeline
    const navWrap = gsap.utils.toArray('.lk-nav-wrap', root)
    const eyebrow = gsap.utils.toArray('.lk-eyebrow', root)
    const h1 = gsap.utils.toArray('.lk-h1', root)
    const sub = gsap.utils.toArray('.lk-sub', root)
    const ctaRow = gsap.utils.toArray('.lk-hero .lk-cta-row', root)
    const microcopy = gsap.utils.toArray('.lk-microcopy', root)
    const mock = gsap.utils.toArray('.lk-mock', root)
    const [heroPanel] = gsap.utils.toArray('.lk-hero', root)
    const heroTextTargets = [
      ...navWrap,
      ...eyebrow,
      ...h1,
      ...sub,
      ...ctaRow,
      ...microcopy,
    ]
    const heroTargets = [...heroTextTargets, ...mock]
    const revealSections = gsap.utils.toArray('.js-reveal', root)
    const stepCards = gsap.utils.toArray('.lk-step', root)

    if (reduceMotion) {
      gsap.set('.lk-hero', { clearProps: 'all' })
      gsap.set(heroTargets, { clearProps: 'all' })
      gsap.set(revealSections, { clearProps: 'all' })
      gsap.set(stepCards, { clearProps: 'all' })
      return
    }

    if (heroTargets.length) {
      gsap.set(heroTargets, {
        autoAlpha: 0,
        y: 18,
        filter: 'blur(8px)',
        willChange: 'transform, opacity, filter',
      })
      if (mock.length) {
        gsap.set(mock, { y: 24 })
      }
      gsap.set(heroPanel, {
        autoAlpha: 0,
        scale: 0.985,
        filter: 'blur(6px)',
        transformOrigin: 'center',
        willChange: 'transform, opacity, filter',
      })

      heroTimeline = gsap.timeline({
        defaults: {
          duration: 0.45,
          ease: 'power3.out',
        },
        onComplete: () => {
          gsap.set(heroPanel, { clearProps: 'transform,opacity,filter,visibility,willChange' })
          gsap.set(heroTargets, { clearProps: 'transform,opacity,filter,visibility,willChange' })
        },
      })

      heroTimeline.to(heroPanel, {
        autoAlpha: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.58,
        ease: 'power3.out',
      })

      if (heroTextTargets.length) {
        heroTimeline.to(heroTextTargets, {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          willChange: 'auto',
          stagger: 0.06,
        }, '-=0.3')
      }

      if (mock.length) {
        heroTimeline.to(mock, {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          willChange: 'auto',
        }, heroTextTargets.length ? '-=0.25' : 0)
      }
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
            borderColor: STEP_COLORS.border,
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
            borderColor: STEP_COLORS.borderSoft,
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
      if (heroTimeline) heroTimeline.kill()
      gsap.killTweensOf([heroPanel, ...heroTargets, ...revealSections, ...stepCards])
    }
  }, { scope: scopeRef })
}
