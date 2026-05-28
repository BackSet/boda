import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { FloralCorner } from './FloralCorner'
import { FloralDivider } from './FloralDivider'
import { FloatingPetals } from './FloatingPetals'
import { SealFragments } from './SealFragments'

type InvitationEnvelopeProps = {
  guestName: string
  eventTitle: string
  phase: 'sealed' | 'opening'
  onOpen: () => void
  onAnimationComplete?: () => void
}

type Stage = 'idle' | 'sealPulse' | 'sealBreak' | 'flap' | 'letterRise' | 'letterUnfold' | 'finishing'

const STAGE_DURATIONS: Record<Stage, number> = {
  idle: 0,
  sealPulse: 350,
  sealBreak: 700,
  flap: 900,
  letterRise: 900,
  letterUnfold: 900,
  finishing: 350,
}

const STAGE_ORDER: Stage[] = [
  'sealPulse',
  'sealBreak',
  'flap',
  'letterRise',
  'letterUnfold',
  'finishing',
]

function nextStage(current: Stage): Stage | null {
  const index = STAGE_ORDER.indexOf(current)
  if (index === -1) return STAGE_ORDER[0]
  if (index === STAGE_ORDER.length - 1) return null
  return STAGE_ORDER[index + 1]
}

export function InvitationEnvelope({
  guestName,
  eventTitle,
  phase,
  onOpen,
  onAnimationComplete,
}: InvitationEnvelopeProps) {
  const reduceMotion = useReducedMotion()
  const [stage, setStage] = useState<Stage>('idle')

  useEffect(() => {
    if (phase !== 'opening') {
      setStage('idle')
      return
    }
    setStage('sealPulse')
  }, [phase])

  useEffect(() => {
    if (stage === 'idle') return

    const duration = STAGE_DURATIONS[stage]
    const timer = window.setTimeout(() => {
      const upcoming = nextStage(stage)
      if (upcoming) {
        setStage(upcoming)
      } else {
        onAnimationComplete?.()
      }
    }, duration)

    return () => window.clearTimeout(timer)
  }, [stage, onAnimationComplete])

  const stageIndex = STAGE_ORDER.indexOf(stage)
  const isOpening = phase === 'opening'
  const sealBroken = stageIndex >= STAGE_ORDER.indexOf('sealBreak')
  const flapOpen = stageIndex >= STAGE_ORDER.indexOf('flap')
  const letterRising = stageIndex >= STAGE_ORDER.indexOf('letterRise')
  const letterUnfolded = stageIndex >= STAGE_ORDER.indexOf('letterUnfold')
  const showSealFragments = stage === 'sealBreak' || stage === 'flap'

  const handleOpen = useCallback(() => {
    if (isOpening) return
    onOpen()
  }, [isOpening, onOpen])

  return (
    <div className="relative flex min-h-[calc(100dvh-2rem)] w-full flex-col items-center justify-center px-4 py-10">
      <FloatingPetals count={6} />
      {isOpening && <FloatingPetals count={18} burst className="z-20" />}

      <motion.div
        className="relative z-10 w-full max-w-md"
        style={{ perspective: 1400 }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence>
          {!isOpening && (
            <motion.div
              key="envelope-header"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45 }}
            >
              <p className="wedding-script mb-3 text-center text-4xl text-rose-600 md:text-5xl dark:text-rose-300">
                Querido invitado
              </p>
              <p className="mb-8 text-center font-serif text-2xl text-wedding-ink dark:text-zinc-100">
                {guestName}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative mx-auto aspect-[4/3] w-full max-w-sm">
          {/* Sombra suave bajo el sobre */}
          <motion.div
            aria-hidden
            className="absolute inset-x-10 bottom-2 h-6 rounded-full bg-black/20 blur-xl"
            animate={{ opacity: isOpening ? 0.45 : 0.25, scale: isOpening ? 1.1 : 1 }}
            transition={{ duration: 0.7 }}
          />

          {/* Cuerpo del sobre */}
          <div className="absolute inset-x-4 bottom-0 top-[28%] overflow-hidden rounded-b-lg border border-amber-200/70 bg-gradient-to-b from-rose-50 to-amber-50/90 shadow-2xl dark:border-zinc-600 dark:from-zinc-800 dark:to-zinc-900">
            <FloralCorner position="bottom-left" className="opacity-50" />
            <FloralCorner position="bottom-right" className="opacity-50" />
          </div>

          {/* Carta interior */}
          <motion.div
            className="absolute inset-x-10 top-[18%] z-10 origin-bottom rounded-md border border-rose-100 bg-white px-4 py-6 text-center shadow-md dark:border-zinc-700 dark:bg-zinc-800"
            animate={
              letterUnfolded
                ? { y: -110, scaleY: 1, opacity: 1 }
                : letterRising
                ? { y: -90, scaleY: 0.7, opacity: 1 }
                : isOpening
                ? { y: -10, scaleY: 0.55, opacity: 0.95 }
                : { y: 8, scaleY: 0.55, opacity: 0.92 }
            }
            transition={{ type: 'spring', stiffness: 110, damping: 18 }}
            style={{ transformOrigin: 'top center' }}
          >
            <p className="wedding-script text-3xl text-rose-600 dark:text-rose-300">
              {guestName.split(' ')[0] || guestName}
            </p>
            <p className="mt-2 font-serif text-lg text-zinc-700 dark:text-zinc-200">
              {eventTitle}
            </p>
            <FloralDivider className="mt-3 scale-75" />
            {letterUnfolded && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="mt-3 text-xs uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300"
              >
                Una carta para tu familia
              </motion.p>
            )}
          </motion.div>

          {/* Solapa */}
          <motion.div
            className="absolute inset-x-4 top-[28%] z-20 h-[42%] origin-top"
            style={{ transformStyle: 'preserve-3d' }}
            animate={
              flapOpen
                ? { rotateX: -172, opacity: 0.25 }
                : sealBroken
                ? { rotateX: -28, opacity: 0.95 }
                : isOpening
                ? { rotateX: -8, opacity: 1 }
                : { rotateX: 0, opacity: 1 }
            }
            transition={{ type: 'spring', stiffness: 90, damping: 14 }}
          >
            <div
              className="relative h-full w-full border border-amber-200/70 bg-gradient-to-b from-rose-100/95 to-rose-200/80 dark:border-zinc-600 dark:from-zinc-700 dark:to-zinc-800"
              style={{
                clipPath: 'polygon(0 0, 50% 72%, 100% 0)',
                boxShadow: 'inset 0 -10px 18px rgba(168, 61, 104, 0.18)',
              }}
            />
          </motion.div>

          {/* Sello con SVG */}
          <motion.button
            type="button"
            disabled={isOpening}
            onClick={handleOpen}
            aria-label="Abrir invitación"
            className="absolute top-[48%] left-1/2 z-30 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition disabled:pointer-events-none"
            animate={
              sealBroken
                ? { scale: 1.6, opacity: 0, rotate: 25 }
                : stage === 'sealPulse'
                ? { scale: [1, 1.12, 1.05], opacity: 1, rotate: 0 }
                : isOpening
                ? { scale: 1.08, opacity: 1, rotate: 0 }
                : reduceMotion
                ? { scale: 1, opacity: 1 }
                : { scale: [1, 1.05, 1], opacity: 1 }
            }
            transition={
              stage === 'sealPulse'
                ? { duration: 0.35, ease: 'easeOut' }
                : sealBroken
                ? { duration: 0.45, ease: 'easeOut' }
                : !isOpening && !reduceMotion
                ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.4 }
            }
            whileHover={reduceMotion || isOpening ? undefined : { scale: 1.08 }}
            whileTap={reduceMotion || isOpening ? undefined : { scale: 0.94 }}
            style={{
              filter:
                isOpening || reduceMotion
                  ? undefined
                  : 'drop-shadow(0 4px 12px rgba(168, 61, 104, 0.45))',
            }}
          >
            <img
              src="/assets/florals/wax-seal.svg"
              alt=""
              aria-hidden
              className="h-full w-full"
            />
          </motion.button>

          {/* Fragmentos del sello al romperse */}
          <div className="absolute top-[48%] left-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
            <SealFragments active={showSealFragments} />
          </div>
        </div>

        <AnimatePresence>
          {!isOpening && (
            <motion.p
              key="hint"
              className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4 }}
            >
              Toca el sello para abrir tu invitación
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpening && (
            <motion.p
              key="opening-hint"
              className="mt-10 text-center text-sm font-medium uppercase tracking-[0.16em] text-rose-700 dark:text-rose-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              Abriendo tu carta...
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
