import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWorldNav } from '../../hooks/useWorldNav'
import LeftSection from './LeftSection'
import RightSection from './RightSection'
import MinimalSvgArrowButton from './MinimalSvgArrowButton'
import CreativeConnectorLines from './CreativeConnectorLines'
import SectionBlob from './SectionBlob'

const EASE = [0.22, 1, 0.36, 1]
const sectionTransition = { duration: 0.55, ease: EASE }
const PARALLAX_MAX = 18

// directional slide: left section enters from the left, right from the right.
// a subtle blur masks the slide so it reads as one smooth motion (not two layers).
const panelVariants = {
  left: {
    initial: { opacity: 0, x: '-7vw', scale: 0.985, filter: 'blur(5px)' },
    animate: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, x: '-7vw', scale: 0.985, filter: 'blur(5px)' },
  },
  right: {
    initial: { opacity: 0, x: '7vw', scale: 0.985, filter: 'blur(5px)' },
    animate: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, x: '7vw', scale: 0.985, filter: 'blur(5px)' },
  },
}

const PANEL_LABEL = {
  left: 'Como funciona',
  right: 'Que cubre',
}

// the section sits on this side; return points back toward the center
const BACK_DIR = { left: 'right', right: 'left' }

function getPanelMotion(panel, reduced) {
  const variants = panelVariants[panel]

  if (!reduced) {
    return variants
  }

  return { ...variants, initial: variants.animate, exit: variants.animate }
}

function renderPanel(panel, reduced) {
  switch (panel) {
    case 'left':
      return <LeftSection reduced={reduced} />
    case 'right':
      return <RightSection reduced={reduced} />
    default:
      return null
  }
}

export default function BudgetExperienceCanvas({ children }) {
  const { active, navigate, reduced } = useWorldNav()
  const [hovered, setHovered] = useState(null)
  const open = active !== 'center'

  // center drifts opposite to the incoming panel for a directional, parallax feel
  const centerShift = active === 'right' ? '-3.5vw' : active === 'left' ? '3.5vw' : 0
  const centerAnim = reduced
    ? { opacity: open ? 0.6 : 1 }
    : open
      ? { x: centerShift, scale: 0.985, opacity: 0.5, filter: 'blur(2px)' }
      : { x: 0, scale: 1, opacity: 1, filter: 'blur(0px)' }
  const centerTransition = reduced ? { duration: 0 } : sectionTransition
  const panelMotion = open ? getPanelMotion(active, reduced) : null
  const panelTransition = reduced ? { duration: 0 } : sectionTransition

  useEffect(() => {
    if (reduced || !open || typeof window === 'undefined' || typeof document === 'undefined') {
      return undefined
    }

    const panel = document.querySelector('.lk-panel')

    if (!panel) {
      return undefined
    }

    let frame = 0
    let pointerX = window.innerWidth / 2
    let pointerY = window.innerHeight / 2

    function applyParallax() {
      frame = 0

      const halfW = Math.max(window.innerWidth / 2, 1)
      const halfH = Math.max(window.innerHeight / 2, 1)

      panel.querySelectorAll('.lk-parallax').forEach((layer) => {
        const parsedDepth = parseFloat(layer.dataset.depth)
        const depth = Number.isNaN(parsedDepth) ? 0.2 : parsedDepth
        const dx = (pointerX - halfW) * depth * PARALLAX_MAX / halfW
        const dy = (pointerY - halfH) * depth * PARALLAX_MAX / halfH

        layer.style.transform = 'translate3d(' + dx + 'px,' + dy + 'px,0)'
      })
    }

    function handlePointerMove(event) {
      pointerX = event.clientX
      pointerY = event.clientY

      if (!frame) {
        frame = window.requestAnimationFrame(applyParallax)
      }
    }

    panel.addEventListener('pointermove', handlePointerMove)

    return () => {
      panel.removeEventListener('pointermove', handlePointerMove)

      if (frame) {
        window.cancelAnimationFrame(frame)
      }

      panel.querySelectorAll('.lk-parallax').forEach((layer) => {
        layer.style.transform = ''
      })
    }
  }, [active, open, reduced])

  return (
    <div className="lk-canvas">
      <motion.div
        className="lk-world-center"
        animate={centerAnim}
        transition={centerTransition}
        style={{ pointerEvents: open ? 'none' : 'auto' }}
      >
        {children}
      </motion.div>

      <CreativeConnectorLines active={active} hovered={hovered} reduced={reduced} />

      <AnimatePresence>
        {open && (
          <motion.div
            key={active}
            className={'lk-panel lk-panel--' + active}
            role="region"
            aria-label={PANEL_LABEL[active]}
            initial={panelMotion.initial}
            animate={panelMotion.animate}
            exit={panelMotion.exit}
            transition={panelTransition}
          >
            <div className="lk-blob-wrap" aria-hidden="true">
              <SectionBlob variant={active} parallax depth={0.22} />
            </div>
            {renderPanel(active, reduced)}
          </motion.div>
        )}
      </AnimatePresence>

      {open ? (
        <div className="lk-arrows">
          <MinimalSvgArrowButton
            direction={BACK_DIR[active]}
            className={'lk-arrow--return lk-arrow--return-' + active}
            ariaLabel="Volver a la landing"
            onClick={() => {
              setHovered(null)
              navigate('center')
            }}
            onHover={setHovered}
          />
        </div>
      ) : (
        <div className="lk-arrows">
          <MinimalSvgArrowButton
            direction="left"
            ariaLabel="Ir a seccion izquierda"
            onClick={() => {
              setHovered(null)
              navigate('left')
            }}
            onHover={setHovered}
          />
          <MinimalSvgArrowButton
            direction="right"
            ariaLabel="Ir a seccion derecha"
            onClick={() => {
              setHovered(null)
              navigate('right')
            }}
            onHover={setHovered}
          />
        </div>
      )}
    </div>
  )
}
