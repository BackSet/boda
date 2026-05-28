import { easeOut, motion, useReducedMotion } from 'motion/react'
import { Church, Copy, MapPin, Shirt, Users } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { UiButton, UiCard, UiTextarea } from '../ui'
import type { InvitationBundle, PublicBankAccount } from '../../lib/api'
import { AmbientMusicToggle } from './AmbientMusicToggle'
import { FloralCorner } from './FloralCorner'
import { FloralDivider } from './FloralDivider'
import { FloralWreath } from './FloralWreath'
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

const heroChildVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: easeOut } },
}

const heroContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
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
        className:
          'relative h-[100dvh] overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-amber-50/10 dark:bg-zinc-950/50',
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.6 },
      }

  return (
    <Wrapper {...wrapperProps}>
      <FloatingPetals falling count={16} className="fixed inset-0 z-0" />
      <AmbientMusicToggle active />

      <main className="relative z-10 w-full flex flex-col">
        <div className="min-h-[100dvh] w-full snap-start flex flex-col justify-center items-center px-4 py-12">
          <WeddingSection className="w-full max-w-5xl">
            <section className="wedding-frame section-glow relative overflow-hidden px-8 py-16 text-center md:px-16 md:py-24">
              {!reduceMotion && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-25 dark:opacity-15"
                >
                  <FloralWreath className="h-[70%] w-[70%] max-w-[520px]" />
                </div>
              )}
              <FloralCorner position="top-left" />
              <FloralCorner position="top-right" />
              <FloralCorner position="bottom-left" />
              <FloralCorner position="bottom-right" />

              <motion.div
                className="relative z-10"
                initial={reduceMotion ? 'visible' : 'hidden'}
                animate="visible"
                variants={heroContainerVariants}
              >
                <motion.p variants={heroChildVariants} className="eyebrow !text-sm">
                  Invitación familiar
                </motion.p>
                <motion.p
                  variants={heroChildVariants}
                  className="wedding-script mt-6 text-6xl text-rose-600 md:text-7xl dark:text-rose-300"
                >
                  {group.displayName}
                </motion.p>
                <motion.div variants={heroChildVariants}>
                  <motion.h1
                    layoutId="couple-names"
                    className="hero-title mt-6 text-4xl md:text-6xl"
                    transition={{ type: 'spring', stiffness: 160, damping: 20 }}
                  >
                    {event.eventTitle}
                  </motion.h1>
                </motion.div>
                <motion.p
                  variants={heroChildVariants}
                  className="mx-auto mt-6 max-w-3xl text-xl text-zinc-600 md:text-2xl dark:text-zinc-300 leading-relaxed"
                >
                  Confirmen la asistencia de cada miembro de su familia con un solo envío.
                </motion.p>
                <motion.p
                  variants={heroChildVariants}
                  className="mt-8 font-serif text-3xl text-rose-700 dark:text-rose-300"
                >
                  {event.eventDate}
                </motion.p>
                <motion.div variants={heroChildVariants}>
                  <FloralDivider label="Con amor" className="mt-12" />
                </motion.div>
              </motion.div>
            </section>
          </WeddingSection>
        </div>

        {sections.map((section) => (
          <InvitationSectionRenderer key={section.id} section={section} />
        ))}

        {event.dressCode && (
          <div className="min-h-[100dvh] w-full snap-start flex flex-col justify-center items-center px-4 py-12">
            <WeddingSection className="w-full max-w-4xl">
              <UiCard className="wedding-frame relative px-8 py-16 text-center md:px-16 md:py-24">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200">
                  <Shirt className="h-7 w-7" aria-hidden />
                </div>
                <h2 className="mt-6 font-serif text-4xl md:text-5xl">Dress code</h2>
                <FloralDivider className="mt-4" />
                <p className="mt-6 mx-auto max-w-2xl text-xl text-zinc-700 dark:text-zinc-200 leading-relaxed">
                  {event.dressCode}
                </p>
              </UiCard>
            </WeddingSection>
          </div>
        )}

        <div className="min-h-[100dvh] w-full snap-start flex flex-col justify-start items-center px-4 py-12">
          <WeddingSection className="w-full max-w-6xl">
            <motion.section
              className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start w-full"
              initial={reduceMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.14 } } }}
            >
              <motion.div
                className="wedding-frame relative grid gap-6 p-8 md:p-12"
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
              >
                <h2 className="font-serif text-4xl md:text-5xl">Lugares y horarios</h2>
                <FloralDivider />
                <AgendaCard
                  icon={<Church className="h-6 w-6 text-rose-600 dark:text-rose-300" />}
                  title="Ceremonia"
                  description={event.ceremonyAddress}
                  mapUrl={event.ceremonyMapUrl}
                />
                <AgendaCard
                  icon={<MapPin className="h-6 w-6 text-rose-600 dark:text-rose-300" />}
                  title="Recepción"
                  description={event.receptionAddress}
                  mapUrl={event.receptionMapUrl}
                />
                <AgendaCard
                  icon={<Users className="h-6 w-6 text-rose-600 dark:text-rose-300" />}
                  title="Su familia"
                  description={`${guests.length} ${guests.length === 1 ? 'miembro invitado' : 'miembros invitados'}`}
                />
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
              >
                <UiCard className="wedding-frame relative border-amber-200/60 p-8 md:p-12">
                  <h2 className="font-serif text-4xl md:text-5xl">Confirmación familiar</h2>
                  <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300">
                    Marquen quién asistirá. Pueden confirmar por todos en un solo paso.
                  </p>
                  <FloralDivider label="RSVP" className="mt-6" />

                  <form className="relative z-10 mt-8 grid gap-6" onSubmit={onSubmit}>
                    <fieldset className="grid gap-3 rounded-3xl border border-amber-200/70 bg-amber-50/40 p-6 dark:border-zinc-700 dark:bg-zinc-900/40">
                      <legend className="text-lg font-medium text-amber-800 dark:text-amber-400">
                        ¿Quién asistirá?
                      </legend>
                      {guests.map((guest) => (
                        <label
                          key={guest.id}
                          className="flex items-center gap-4 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-base dark:border-zinc-700 dark:bg-zinc-900/50 shadow-sm"
                        >
                          <input
                            type="checkbox"
                            className="h-5 w-5 rounded border-amber-300 text-rose-600 focus:ring-rose-500"
                            checked={memberAttendance[guest.id] ?? false}
                            onChange={(event) =>
                              setMemberAttending(guest.id, event.target.checked)
                            }
                          />
                          <span className="font-medium text-zinc-800 dark:text-zinc-100 text-lg">
                            {guest.fullName}
                            {guest.primaryGuest && (
                              <span className="ml-3 text-sm text-rose-500 font-normal">
                                · Principal
                              </span>
                            )}
                          </span>
                        </label>
                      ))}
                      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                        {attendingCount} de {guests.length} asistirán
                      </p>
                    </fieldset>

                    <label className="ui-field-label text-lg">
                      Restricciones alimentarias (familia)
                      <UiTextarea
                        value={dietaryRestrictions}
                        onChange={(event) => setDietaryRestrictions(event.target.value)}
                        rows={3}
                        className="mt-2 text-base p-4 rounded-2xl"
                        placeholder="Ejemplo: vegetariano, sin gluten, alergias..."
                      />
                    </label>

                    <label className="ui-field-label text-lg">
                      Mensaje para los novios
                      <UiTextarea
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        rows={4}
                        className="mt-2 text-base p-4 rounded-2xl"
                        placeholder="Comparte un mensaje especial"
                      />
                    </label>

                    <UiButton
                      className="px-6 py-4 text-lg font-semibold rounded-full"
                      variant="primary"
                      type="submit"
                      disabled={submitState === 'sending'}
                    >
                      {submitState === 'sending' ? 'Enviando...' : 'Confirmar asistencia familiar'}
                    </UiButton>
                  </form>

                  {submitState === 'success' && (
                    <p className="mt-6 rounded-2xl border border-emerald-300 bg-emerald-50 px-6 py-4 text-lg text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 shadow-sm">
                      Confirmación registrada. Gracias por acompañarnos.
                    </p>
                  )}
                  {submitState === 'error' && (
                    <p className="mt-6 rounded-2xl border border-rose-300 bg-rose-50 px-6 py-4 text-lg text-rose-800 dark:border-rose-700 dark:bg-rose-950/30 dark:text-rose-200 shadow-sm">
                      {submitError}
                    </p>
                  )}
                </UiCard>
              </motion.div>
            </motion.section>
          </WeddingSection>
        </div>

        {bankAccounts && bankAccounts.length > 0 && (
          <div className="min-h-[100dvh] w-full snap-start flex flex-col justify-center items-center px-4 py-12">
            <WeddingSection className="w-full max-w-5xl">
              <UiCard className="wedding-frame relative px-8 py-16 md:px-16 md:py-24">
                <h2 className="font-serif text-4xl md:text-6xl text-center">Aportes para la boda</h2>
                <FloralDivider label="Gracias por tu cariño" className="mt-6" />
                <motion.div
                  className="mt-12 grid gap-6 md:grid-cols-2"
                  initial={reduceMotion ? false : 'hidden'}
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
                >
                  {bankAccounts.map((account) => (
                    <BankAccountCard key={account.id} account={account} reduceMotion={!!reduceMotion} />
                  ))}
                </motion.div>
              </UiCard>
            </WeddingSection>
          </div>
        )}

        <div className="w-full snap-start flex flex-col justify-center items-center py-16">
          <p className="text-center text-lg text-zinc-500 dark:text-zinc-400">
            <Link
              to="/"
              className="font-medium text-rose-700 underline decoration-rose-300 underline-offset-4 dark:text-rose-300 transition-colors hover:text-rose-800"
            >
              Volver al inicio
            </Link>
          </p>
        </div>
      </main>
    </Wrapper>
  )
}

function BankAccountCard({
  account,
  reduceMotion,
}: {
  account: PublicBankAccount
  reduceMotion: boolean
}) {
  const [copiedField, setCopiedField] = useState<'account' | 'clabe' | null>(null)

  async function copyToClipboard(value: string, field: 'account' | 'clabe') {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedField(field)
      window.setTimeout(() => setCopiedField((current) => (current === field ? null : current)), 2000)
    } catch {
      // no-op
    }
  }

  return (
    <motion.article
      className="wedding-frame relative grid gap-3 p-8 text-left"
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
      }}
      whileHover={reduceMotion ? undefined : { y: -3 }}
    >
      <header>
        <p className="eyebrow !text-xs">{account.accountType}</p>
        <h3 className="mt-1 font-serif text-3xl">{account.bankName}</h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          A nombre de {account.accountHolder}
        </p>
      </header>

      <div className="mt-2 grid gap-2">
        <FieldRow label="Número de cuenta" value={account.accountNumber} />
        {account.clabeIban && <FieldRow label="CLABE / IBAN" value={account.clabeIban} />}
        {account.accountAlias && <FieldRow label="Alias" value={account.accountAlias} />}
      </div>

      {account.notes && (
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          {account.notes}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <UiButton
          className="gap-2 rounded-full px-4 py-2 text-sm"
          type="button"
          onClick={() => copyToClipboard(account.accountNumber, 'account')}
        >
          <Copy className="h-4 w-4" />
          {copiedField === 'account' ? 'Copiado' : 'Copiar cuenta'}
        </UiButton>
        {account.clabeIban && (
          <UiButton
            className="gap-2 rounded-full px-4 py-2 text-sm"
            type="button"
            onClick={() => copyToClipboard(account.clabeIban as string, 'clabe')}
          >
            <Copy className="h-4 w-4" />
            {copiedField === 'clabe' ? 'Copiado' : 'Copiar CLABE'}
          </UiButton>
        )}
      </div>
    </motion.article>
  )
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-amber-200/70 bg-white/70 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900/60">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-rose-500 dark:text-rose-300">
        {label}
      </p>
      <p className="mt-1 break-all font-mono text-base text-zinc-800 dark:text-zinc-100">{value}</p>
    </div>
  )
}

function AgendaCard({
  icon,
  title,
  description,
  mapUrl,
}: {
  icon: ReactNode
  title: string
  description: string
  mapUrl?: string
}) {
  return (
    <article className="flex gap-4 rounded-3xl border border-amber-200/80 bg-gradient-to-br from-white to-rose-50/70 p-6 dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800 shadow-sm">
      <div className="mt-1 shrink-0">{icon}</div>
      <div>
        <h3 className="font-serif text-3xl">{title}</h3>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">{description}</p>
        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/80 px-4 py-2 text-base font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-700/40 dark:bg-rose-950/30 dark:text-rose-200 dark:hover:bg-rose-900/40"
          >
            <MapPin className="h-4 w-4" aria-hidden />
            Ver ruta en mapa
          </a>
        )}
      </div>
    </article>
  )
}
