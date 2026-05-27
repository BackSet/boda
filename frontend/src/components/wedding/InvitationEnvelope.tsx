import { motion, useReducedMotion } from 'motion/react'
import { FloralDivider } from './FloralDivider'
import { FloatingPetals } from './FloatingPetals'

type InvitationEnvelopeProps = {
  guestName: string
  eventTitle: string
  phase: 'sealed' | 'opening'
  onOpen: () => void
}

export function InvitationEnvelope({
  guestName,
  eventTitle,
  phase,
  onOpen,
}: InvitationEnvelopeProps) {
  const reduceMotion = useReducedMotion()
  const isOpening = phase === 'opening'

  return (
    <div className="relative flex min-h-[calc(100dvh-2rem)] w-full flex-col items-center justify-center px-4 py-10">
      <FloatingPetals count={6} />
      {isOpening && <FloatingPetals count={10} burst className="z-20" />}

      <motion.div
        className="relative z-10 w-full max-w-md"
        style={{ perspective: 1200 }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="wedding-script mb-3 text-center text-4xl text-rose-600 md:text-5xl dark:text-rose-300">
          Querido invitado
        </p>
        <p className="mb-8 text-center font-serif text-2xl text-wedding-ink dark:text-zinc-100">
          {guestName}
        </p>

        <div className="relative mx-auto aspect-[4/3] w-full max-w-sm">
          {/* Sobre — cuerpo */}
          <div className="absolute inset-x-4 bottom-0 top-[28%] rounded-b-lg border border-amber-200/60 bg-gradient-to-b from-rose-50 to-amber-50/90 shadow-xl dark:border-zinc-600 dark:from-zinc-800 dark:to-zinc-900" />

          {/* Carta interior */}
          <motion.div
            className="absolute inset-x-10 top-[18%] z-0 rounded-md border border-rose-100 bg-white px-4 py-6 text-center shadow-md dark:border-zinc-700 dark:bg-zinc-800"
            animate={
              isOpening
                ? { y: -72, scale: 1.02, opacity: 1 }
                : { y: 8, scale: 0.98, opacity: 0.92 }
            }
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          >
            <p className="wedding-script text-3xl text-rose-600 dark:text-rose-300">
              {guestName.split(' ')[0]}
            </p>
            <p className="mt-2 font-serif text-lg text-zinc-700 dark:text-zinc-200">
              {eventTitle}
            </p>
            <FloralDivider className="mt-3 scale-75" />
          </motion.div>

          {/* Solapa */}
          <motion.div
            className="absolute inset-x-4 top-[28%] z-20 h-[42%] origin-top"
            style={{ transformStyle: 'preserve-3d' }}
            animate={
              isOpening
                ? { rotateX: -165, opacity: 0.3 }
                : { rotateX: 0, opacity: 1 }
            }
            transition={{ type: 'spring', stiffness: 100, damping: 16 }}
          >
            <div
              className="h-full w-full border border-amber-200/70 bg-gradient-to-b from-rose-100/95 to-rose-200/80 dark:border-zinc-600 dark:from-zinc-700 dark:to-zinc-800"
              style={{
                clipPath: 'polygon(0 0, 50% 72%, 100% 0)',
              }}
            />
          </motion.div>

          {/* Sello */}
          <motion.button
            type="button"
            disabled={isOpening}
            onClick={onOpen}
            className="absolute top-[48%] left-1/2 z-30 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-amber-600/50 bg-gradient-to-br from-rose-700 to-rose-900 text-xs font-semibold tracking-wider text-amber-100 uppercase shadow-lg transition hover:scale-105 disabled:pointer-events-none"
            animate={
              isOpening
                ? { scale: 0, opacity: 0 }
                : { scale: 1, opacity: 1 }
            }
            whileHover={reduceMotion ? undefined : { scale: 1.06 }}
            whileTap={reduceMotion ? undefined : { scale: 0.96 }}
          >
            Abrir
          </motion.button>
        </div>

        {!isOpening && (
          <motion.p
            className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Toca el sello para abrir tu invitación
          </motion.p>
        )}
      </motion.div>
    </div>
  )
}
