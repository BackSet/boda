import { motion, useReducedMotion } from 'motion/react'
import { Church, Copy, MapPin, Users } from 'lucide-react'
import { type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { UiButton, UiCard, UiTextarea } from '../ui'
import type { InvitationBundle } from '../../lib/api'
import { AmbientMusicToggle } from './AmbientMusicToggle'
import { FloralCorner } from './FloralCorner'
import { FloralDivider } from './FloralDivider'
import { FloatingPetals } from './FloatingPetals'
import { InvitationSectionRenderer } from './InvitationSectionRenderer'
import { WeddingSection } from './WeddingSection'

type SubmitState = 'idle' | 'sending' | 'success' | 'error'

type InvitationRevealContentProps = {
  bundle: InvitationBundle
  memberAttendance: Record<number, boolean>
  setMemberAttending: (guestId: number, attending: boolean) => void
  dietaryRestrictions: string
  setDietaryRestrictions: (value: string) => void
  message: string
  setMessage: (value: string) => void
  submitState: SubmitState
  submitError: string | null
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function InvitationRevealContent({
  bundle,
  memberAttendance,
  setMemberAttending,
  dietaryRestrictions,
  setDietaryRestrictions,
  message,
  setMessage,
  submitState,
  submitError,
  onSubmit,
}: InvitationRevealContentProps) {
  const reduceMotion = useReducedMotion()
  const { group, guests, event, sections, bankAccounts } = bundle
  const attendingCount = guests.filter((guest) => memberAttendance[guest.id]).length

  const Wrapper = reduceMotion ? 'div' : motion.div
  const wrapperProps = reduceMotion
    ? { className: 'relative' }
    : {
        className: 'relative',
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.6 },
      }

  return (
    <Wrapper {...wrapperProps}>
      <FloatingPetals count={5} className="fixed inset-0 z-0" />
      <AmbientMusicToggle active />

      <main className="relative z-10 mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 md:gap-8">
        <WeddingSection>
          <section className="wedding-frame section-glow relative px-6 py-12 text-center md:px-12 md:py-16">
            <FloralCorner position="top-left" />
            <FloralCorner position="top-right" />
            <p className="eyebrow">Invitación familiar</p>
            <p className="wedding-script mt-2 text-5xl text-rose-600 md:text-6xl dark:text-rose-300">
              {group.displayName}
            </p>
            <h1 className="hero-title mt-4">{event.eventTitle}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-600 md:text-lg dark:text-zinc-300">
              Confirmen la asistencia de cada miembro de su familia con un solo envío.
            </p>
            <p className="mt-4 font-serif text-xl text-rose-700 dark:text-rose-300">
              {event.eventDate}
            </p>
            <FloralDivider label="Con amor" className="mt-6" />
          </section>
        </WeddingSection>

        {sections.map((section) => (
          <InvitationSectionRenderer key={section.id} section={section} />
        ))}

        <WeddingSection>
          <section className="grid gap-4 lg:grid-cols-[1.1fr_1fr] lg:items-start">
            <div className="wedding-frame relative grid gap-4 p-6 md:p-8">
              <h2 className="font-serif text-3xl md:text-4xl">Lugares y horarios</h2>
              <FloralDivider />
              <AgendaCard
                icon={<Church className="h-5 w-5 text-rose-600 dark:text-rose-300" />}
                title="Ceremonia"
                description={event.ceremonyAddress}
              />
              <AgendaCard
                icon={<MapPin className="h-5 w-5 text-rose-600 dark:text-rose-300" />}
                title="Recepción"
                description={event.receptionAddress}
              />
              <AgendaCard
                icon={<Users className="h-5 w-5 text-rose-600 dark:text-rose-300" />}
                title="Su familia"
                description={`${guests.length} ${guests.length === 1 ? 'miembro invitado' : 'miembros invitados'}`}
              />
            </div>

            <UiCard className="wedding-frame relative border-amber-200/60 lg:sticky lg:top-24">
              <h2 className="font-serif text-3xl">Confirmación familiar</h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                Marquen quién asistirá. Pueden confirmar por todos en un solo paso.
              </p>
              <FloralDivider label="RSVP" className="mt-3" />

              <form className="relative z-10 mt-5 grid gap-4" onSubmit={onSubmit}>
                <fieldset className="grid gap-2 rounded-2xl border border-amber-200/70 bg-amber-50/40 p-4 dark:border-zinc-700 dark:bg-zinc-900/40">
                  <legend className="text-sm font-medium">¿Quién asistirá?</legend>
                  {guests.map((guest) => (
                    <label
                      key={guest.id}
                      className="flex items-center gap-3 rounded-xl border border-white/60 bg-white/70 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900/50"
                    >
                      <input
                        type="checkbox"
                        checked={memberAttendance[guest.id] ?? false}
                        onChange={(event) =>
                          setMemberAttending(guest.id, event.target.checked)
                        }
                      />
                      <span className="font-medium text-zinc-800 dark:text-zinc-100">
                        {guest.fullName}
                        {guest.primaryGuest && (
                          <span className="ml-2 text-xs text-rose-500">· Principal</span>
                        )}
                      </span>
                    </label>
                  ))}
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {attendingCount} de {guests.length} asistirán
                  </p>
                </fieldset>

                <label className="ui-field-label">
                  Restricciones alimentarias (familia)
                  <UiTextarea
                    value={dietaryRestrictions}
                    onChange={(event) => setDietaryRestrictions(event.target.value)}
                    rows={3}
                    placeholder="Ejemplo: vegetariano, sin gluten, alergias..."
                  />
                </label>

                <label className="ui-field-label">
                  Mensaje para los novios
                  <UiTextarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={4}
                    placeholder="Comparte un mensaje especial"
                  />
                </label>

                <UiButton
                  className="px-4 py-2.5 font-semibold"
                  variant="primary"
                  type="submit"
                  disabled={submitState === 'sending'}
                >
                  {submitState === 'sending' ? 'Enviando...' : 'Confirmar asistencia familiar'}
                </UiButton>
              </form>

              {submitState === 'success' && (
                <p className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                  Confirmación registrada. Gracias por acompañarnos.
                </p>
              )}
              {submitState === 'error' && (
                <p className="mt-4 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
                  {submitError}
                </p>
              )}
            </UiCard>
          </section>
        </WeddingSection>

        {bankAccounts.length > 0 && (
          <WeddingSection>
            <UiCard className="wedding-frame relative">
              <h2 className="font-serif text-3xl">Aportes para la boda</h2>
              <FloralDivider label="Gracias por tu cariño" className="mt-3" />
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {bankAccounts.map((account) => (
                  <article
                    className="grid gap-1 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-white to-amber-50/60 p-4 dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800"
                    key={account.id}
                  >
                    <h3 className="font-serif text-2xl">{account.bankName}</h3>
                    <p className="text-sm text-zinc-700 dark:text-zinc-200">
                      <strong>Número:</strong> {account.accountNumber}
                    </p>
                    <UiButton
                      className="mt-2 w-fit gap-2"
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(account.accountNumber)
                        } catch {
                          // no-op
                        }
                      }}
                    >
                      <Copy className="h-4 w-4" />
                      Copiar número
                    </UiButton>
                  </article>
                ))}
              </div>
            </UiCard>
          </WeddingSection>
        )}

        <p className="pb-16 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <Link
            to="/"
            className="font-medium text-rose-700 underline decoration-rose-300 underline-offset-2 dark:text-rose-300"
          >
            Volver al inicio
          </Link>
        </p>
      </main>
    </Wrapper>
  )
}

function AgendaCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <article className="flex gap-3 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-white to-rose-50/70 p-4 dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <h3 className="font-serif text-2xl">{title}</h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{description}</p>
      </div>
    </article>
  )
}
