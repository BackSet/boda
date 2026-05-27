import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { InvitationEnvelope } from '../components/wedding/InvitationEnvelope'
import { InvitationRevealContent } from '../components/wedding/InvitationRevealContent'
import { FloatingPetals } from '../components/wedding/FloatingPetals'
import { UiCard } from '../components/ui'
import { useInvitationReveal } from '../hooks/useInvitationReveal'
import {
  getInvitationBundle,
  submitRsvp,
  type InvitationBundle,
  type MemberRsvp,
} from '../lib/api'
import { useInvitationRevealContext } from '../lib/invitation-reveal-context'

type SubmitState = 'idle' | 'sending' | 'success' | 'error'

export function InvitationPage() {
  const { token = '' } = useParams()
  const [bundle, setBundle] = useState<InvitationBundle | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [memberAttendance, setMemberAttendance] = useState<Record<number, boolean>>({})
  const [dietaryRestrictions, setDietaryRestrictions] = useState('')
  const [message, setMessage] = useState('')
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)

  const dataReady = !loading && !loadError && bundle !== null
  const { phase, setPhase } = useInvitationRevealContext()
  const { openEnvelope } = useInvitationReveal(token, dataReady, setPhase, phase)

  const envelopeLabel = useMemo(() => {
    if (!bundle) {
      return ''
    }
    const primary = bundle.guests.find((guest) => guest.primaryGuest)
    return bundle.group.displayName || primary?.fullName || 'Familia invitada'
  }, [bundle])

  useEffect(() => {
    if (loadError) {
      setPhase('error')
    }
  }, [loadError, setPhase])

  useEffect(() => {
    let active = true

    getInvitationBundle(token)
      .then((data) => {
        if (!active) {
          return
        }
        setLoadError(null)
        setBundle(data)
        setDietaryRestrictions(data.group.dietaryRestrictions ?? '')
        setMessage(data.group.message ?? '')
        const attendance: Record<number, boolean> = {}
        for (const guest of data.guests) {
          attendance[guest.id] = guest.attending ?? false
        }
        setMemberAttendance(attendance)
      })
      .catch(() => {
        if (!active) {
          return
        }
        setLoadError(
          'No encontramos una invitación válida para este enlace. Verifica tu token.',
        )
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [token])

  function setMemberAttending(guestId: number, attending: boolean) {
    setMemberAttendance((current) => ({ ...current, [guestId]: attending }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!bundle) {
      return
    }

    setSubmitState('sending')
    setSubmitError(null)

    const members: MemberRsvp[] = bundle.guests.map((guest) => ({
      guestId: guest.id,
      attending: memberAttendance[guest.id] ?? false,
    }))

    try {
      await submitRsvp({
        token: bundle.group.token,
        members,
        dietaryRestrictions,
        message,
      })
      setSubmitState('success')
      setBundle((current) =>
        current
          ? {
              ...current,
              group: {
                ...current.group,
                dietaryRestrictions,
                message,
                respondedAt: new Date().toISOString(),
              },
              guests: current.guests.map((guest) => ({
                ...guest,
                attending: memberAttendance[guest.id] ?? false,
              })),
            }
          : current,
      )
    } catch (error) {
      setSubmitState('error')
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Ocurrió un error al enviar tu confirmación.',
      )
    }
  }

  return (
    <div className="wedding-paper relative min-h-screen">
      <AnimatePresence mode="wait">
        {phase === 'loading' && (
          <motion.div
            key="loading"
            className="relative flex min-h-[calc(100dvh-2rem)] items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FloatingPetals count={4} />
            <UiCard className="relative z-10 p-8 text-center">
              <p className="eyebrow">Un momento</p>
              <h1 className="mt-2 font-serif text-4xl">Preparando tu invitación</h1>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                Cargando detalles para tu experiencia personalizada...
              </p>
            </UiCard>
          </motion.div>
        )}

        {phase === 'error' && (
          <motion.main
            key="error"
            className="mx-auto grid min-h-[calc(100dvh-2rem)] w-full max-w-3xl place-content-center px-4 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <UiCard className="border-rose-200 p-8 text-center dark:border-rose-800">
              <p className="eyebrow">Token no válido</p>
              <h1 className="mt-2 font-serif text-4xl">Invitación no disponible</h1>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{loadError}</p>
              <Link
                className="mt-4 inline-flex justify-center text-sm font-medium text-rose-700 underline decoration-rose-300 underline-offset-2 dark:text-rose-300"
                to="/"
              >
                Volver al inicio
              </Link>
            </UiCard>
          </motion.main>
        )}

        {(phase === 'sealed' || phase === 'opening') && bundle && (
          <motion.div
            key="envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <InvitationEnvelope
              guestName={envelopeLabel}
              eventTitle={bundle.event.eventTitle}
              phase={phase === 'opening' ? 'opening' : 'sealed'}
              onOpen={openEnvelope}
            />
          </motion.div>
        )}

        {phase === 'revealed' && bundle && (
          <motion.div
            key="revealed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <InvitationRevealContent
              bundle={bundle}
              memberAttendance={memberAttendance}
              setMemberAttending={setMemberAttending}
              dietaryRestrictions={dietaryRestrictions}
              setDietaryRestrictions={setDietaryRestrictions}
              message={message}
              setMessage={setMessage}
              submitState={submitState}
              submitError={submitError}
              onSubmit={handleSubmit}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
