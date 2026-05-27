import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FloralCorner } from '../components/wedding/FloralCorner'
import { FloralDivider } from '../components/wedding/FloralDivider'
import { FloatingPetals } from '../components/wedding/FloatingPetals'
import { LoveStoryTimeline } from '../components/wedding/LoveStoryTimeline'
import { WeddingSection } from '../components/wedding/WeddingSection'
import { UiCard } from '../components/ui'
import {
  getHomePageContent,
  type HomeContentSection,
  type PublicEvent,
  type PublicLoveStory,
} from '../lib/api'

const FALLBACK_COUNTDOWN_DATE = '2026-12-12T16:00:00'

function formatCountdown(targetDateIso: string): string {
  const diff = new Date(targetDateIso).getTime() - Date.now()
  if (diff <= 0) {
    return 'Hoy celebramos nuestra boda'
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  return `${days} días · ${hours} horas · ${minutes} min`
}

export function HomePage() {
  const [event, setEvent] = useState<PublicEvent | null>(null)
  const [sections, setSections] = useState<HomeContentSection[]>([])
  const [loveStory, setLoveStory] = useState<PublicLoveStory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let active = true
    getHomePageContent()
      .then((data) => {
        if (active) {
          setEvent(data.event)
          setSections(data.sections)
          setLoveStory(data.loveStory ?? null)
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'No se pudo cargar el contenido de la invitación',
          )
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => setTick((value) => value + 1), 60_000)
    return () => window.clearInterval(interval)
  }, [])

  const normalizedSections = useMemo(() => {
    if (sections.length > 0) {
      return sections
    }
    return buildFallbackSections()
  }, [sections])

  const nonHeroSections = useMemo(
    () => normalizedSections.filter((section) => section.sectionType !== 'hero'),
    [normalizedSections],
  )

  const heroSection = useMemo(
    () => normalizedSections.find((section) => section.sectionType === 'hero'),
    [normalizedSections],
  )

  return (
    <div className="wedding-paper relative min-h-screen">
      <FloatingPetals count={6} className="fixed inset-0 z-0" />

      <main className="relative z-10 mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 md:gap-8">
        {heroSection ? (
          <HomeHeroSection section={heroSection} />
        ) : (
          <HomeHeroSection section={buildFallbackSections()[0]} />
        )}

        {loading && (
          <UiCard className="relative">
            <p>Cargando contenido de la invitación...</p>
          </UiCard>
        )}
        {error && !loading && (
          <section className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700 dark:border-rose-700/60 dark:bg-rose-950/30 dark:text-rose-200">
            <p>{error}</p>
          </section>
        )}

        {event && <EventSummarySection event={event} />}

        {!loading &&
          nonHeroSections.map((section) => (
            <HomeSectionRenderer
              key={section.id}
              section={section}
              tick={tick}
              event={event}
            />
          ))}

        {!loading && loveStory && loveStory.entries.length > 0 && (
          <LoveStoryTimeline
            title={loveStory.title}
            subtitle={loveStory.subtitle}
            entries={loveStory.entries}
          />
        )}
      </main>
    </div>
  )
}

function HomeHeroSection({ section }: { section: HomeContentSection }) {
  const reduceMotion = useReducedMotion()

  return (
    <WeddingSection>
      <section
        id="inicio-invitacion"
        className="wedding-frame section-glow relative overflow-hidden px-6 py-12 text-center md:px-12 md:py-16"
      >
        <FloralCorner position="top-left" />
        <FloralCorner position="top-right" />
        <FloralCorner position="bottom-left" />
        <FloralCorner position="bottom-right" />
        <p className="eyebrow">Edición especial</p>
        <p className="wedding-script mt-2 text-5xl text-rose-600 md:text-6xl dark:text-rose-300">
          {section.title}
        </p>
        {section.subtitle && (
          <p className="mx-auto mt-4 max-w-3xl text-base text-zinc-600 md:text-lg dark:text-zinc-300">
            {section.subtitle}
          </p>
        )}
        {section.body && (
          <p className="mt-4 font-serif text-xl text-rose-700 dark:text-rose-300">
            {section.body}
          </p>
        )}
        <FloralDivider label="Nuestra boda" className="mt-6" />
        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link
            to="/invitacion/demo-token"
            className="inline-flex items-center justify-center rounded-full border border-rose-700 bg-rose-700 px-7 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-rose-800"
          >
            Abrir invitación personalizada
          </Link>
          <a
            href="#seccion-countdown"
            className="inline-flex items-center justify-center rounded-full border border-amber-200/80 bg-white/80 px-6 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-amber-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Cuenta regresiva
          </a>
        </motion.div>
      </section>
    </WeddingSection>
  )
}

function EventSummarySection({ event }: { event: PublicEvent }) {
  return (
    <WeddingSection>
      <UiCard className="wedding-frame relative px-6 py-8 md:px-10">
        <h2 className="font-serif text-3xl md:text-4xl">Detalles del evento</h2>
        <FloralDivider className="mt-3" />
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <article className="rounded-2xl border border-amber-200/60 bg-white/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/60">
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-rose-500">
              Ceremonia
            </span>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
              {event.ceremonyAddress}
            </p>
          </article>
          <article className="rounded-2xl border border-amber-200/60 bg-white/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/60">
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-rose-500">
              Recepción
            </span>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
              {event.receptionAddress}
            </p>
          </article>
          <article className="rounded-2xl border border-amber-200/60 bg-white/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/60">
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-rose-500">
              Dress code
            </span>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
              {event.dressCode ?? 'Formal elegante'}
            </p>
          </article>
        </div>
      </UiCard>
    </WeddingSection>
  )
}

function HomeSectionRenderer({
  section,
  tick,
  event,
}: {
  section: HomeContentSection
  tick: number
  event: PublicEvent | null
}) {
  const payload = parsePayload(section.payloadJson)
  const sectionId = `seccion-${section.sectionType}`

  if (section.sectionType === 'countdown') {
    const targetDateIso =
      event?.targetDateIso ??
      (typeof payload?.targetDateIso === 'string'
        ? payload.targetDateIso
        : FALLBACK_COUNTDOWN_DATE)
    const countdown = formatCountdown(targetDateIso)
    void tick

    return (
      <WeddingSection>
        <UiCard id={sectionId} className="wedding-frame relative px-6 py-10 text-center md:px-10">
          <FloralCorner position="top-right" className="opacity-35" />
          <h2 className="font-serif text-3xl md:text-4xl">{section.title}</h2>
          <p className="mt-4 font-serif text-4xl font-semibold text-zinc-900 md:text-5xl dark:text-zinc-100">
            {countdown}
          </p>
          {section.subtitle && (
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">{section.subtitle}</p>
          )}
          <FloralDivider className="mt-5" />
        </UiCard>
      </WeddingSection>
    )
  }

  if (section.sectionType === 'highlights') {
    const items = Array.isArray(payload?.items) ? payload.items : []
    return (
      <WeddingSection>
        <UiCard id={sectionId} className="wedding-frame relative">
          <h2 className="font-serif text-3xl md:text-4xl">{section.title}</h2>
          <FloralDivider className="mt-3" />
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {items.map((item, index) => (
              <article
                className="grid gap-1 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-white to-rose-50/60 p-4 dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800"
                key={`${section.id}-h-${index}`}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-rose-500 dark:text-rose-300">
                  {String(item?.label ?? '')}
                </span>
                <h3 className="font-serif text-2xl">{String(item?.title ?? '')}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  {String(item?.description ?? '')}
                </p>
              </article>
            ))}
          </div>
        </UiCard>
      </WeddingSection>
    )
  }

  if (section.sectionType === 'story') {
    const items = Array.isArray(payload?.items) ? payload.items : []
    return (
      <WeddingSection>
        <UiCard id={sectionId} className="wedding-frame">
          <h2 className="font-serif text-3xl md:text-4xl">{section.title}</h2>
          <FloralDivider className="mt-3" />
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {items.map((item, index) => (
              <article
                className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-800/60"
                key={`${section.id}-s-${index}`}
              >
                <h3 className="font-serif text-2xl">{String(item?.title ?? '')}</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                  {String(item?.description ?? '')}
                </p>
              </article>
            ))}
          </div>
        </UiCard>
      </WeddingSection>
    )
  }

  if (section.sectionType === 'timeline') {
    const items = Array.isArray(payload?.items) ? payload.items : []
    return (
      <WeddingSection>
        <UiCard id={sectionId} className="wedding-frame">
          <h2 className="font-serif text-3xl md:text-4xl">{section.title}</h2>
          <FloralDivider className="mt-3" />
          <ol className="mt-5 grid gap-3">
            {items.map((item, index) => (
              <li
                className="grid gap-1 rounded-2xl border border-amber-200/50 bg-white/80 p-4 md:grid-cols-[110px_1fr] md:items-center dark:border-zinc-700 dark:bg-zinc-900/60"
                key={`${section.id}-t-${index}`}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-rose-500 dark:text-rose-300">
                  {String(item?.time ?? '')}
                </span>
                <p className="text-sm text-zinc-700 dark:text-zinc-200">
                  {String(item?.description ?? '')}
                </p>
              </li>
            ))}
          </ol>
        </UiCard>
      </WeddingSection>
    )
  }

  if (section.sectionType === 'locations') {
    const items = Array.isArray(payload?.items) ? payload.items : []
    return (
      <WeddingSection id={sectionId}>
        <h2 className="mb-4 text-center font-serif text-3xl md:text-4xl">{section.title}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item, index) => (
            <article
              className="wedding-frame grid gap-2 p-5"
              key={`${section.id}-l-${index}`}
            >
              <span className="w-fit rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.08em] text-rose-700 dark:bg-rose-900/60 dark:text-rose-200">
                {String(item?.tag ?? '')}
              </span>
              <h3 className="font-serif text-2xl">{String(item?.title ?? '')}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                {String(item?.description ?? '')}
              </p>
              <a
                href={String(item?.mapUrl ?? 'https://maps.google.com')}
                target="_blank"
                rel="noreferrer"
                className="w-fit text-sm font-medium text-rose-700 underline decoration-rose-300 underline-offset-2 dark:text-rose-300"
              >
                Ver ruta en mapa
              </a>
            </article>
          ))}
        </div>
      </WeddingSection>
    )
  }

  if (section.sectionType === 'gallery') {
    return <GallerySection section={section} payload={payload} sectionId={sectionId} />
  }

  return (
    <WeddingSection>
      <UiCard id={sectionId} className="wedding-frame">
        <h2 className="font-serif text-3xl md:text-4xl">{section.title}</h2>
        {section.subtitle && (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{section.subtitle}</p>
        )}
        {section.body && (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{section.body}</p>
        )}
      </UiCard>
    </WeddingSection>
  )
}

function GallerySection({
  section,
  payload,
  sectionId,
}: {
  section: HomeContentSection
  payload: Record<string, unknown> | null
  sectionId: string
}) {
  const items = Array.isArray(payload?.items) ? payload.items : []
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)
  const reduceMotion = useReducedMotion()

  return (
    <WeddingSection>
      <UiCard id={sectionId} className="wedding-frame relative">
        <h2 className="font-serif text-3xl md:text-4xl">{section.title}</h2>
        <FloralDivider className="mt-3" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const imageUrl =
              typeof item?.imageUrl === 'string' ? item.imageUrl : undefined
            const title = String(item?.title ?? '')
            const alt =
              typeof item?.alt === 'string' ? item.alt : title || 'Foto de la galería'

            return (
              <article
                className="group relative min-h-44 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700"
                key={`${section.id}-g-${index}`}
              >
                {imageUrl ? (
                  <button
                    type="button"
                    className="block h-full w-full cursor-zoom-in text-left"
                    onClick={() => setLightboxUrl(imageUrl)}
                  >
                    <img
                      src={imageUrl}
                      alt={alt}
                      loading="lazy"
                      className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none'
                      }}
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-3 text-sm font-semibold text-white">
                      {title}
                    </span>
                  </button>
                ) : (
                  <div className="flex min-h-36 items-end bg-gradient-to-br from-rose-300/70 to-emerald-200/70 p-4 text-sm font-semibold text-zinc-800 dark:from-rose-900/50 dark:to-emerald-900/50 dark:text-zinc-100">
                    <span>{title}</span>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </UiCard>

      {lightboxUrl && (
        <motion.button
          type="button"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setLightboxUrl(null)}
          aria-label="Cerrar imagen ampliada"
        >
          <motion.img
            src={lightboxUrl}
            alt=""
            className="max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl"
            initial={reduceMotion ? false : { scale: 0.92 }}
            animate={{ scale: 1 }}
            onClick={(event) => event.stopPropagation()}
          />
        </motion.button>
      )}
    </WeddingSection>
  )
}

function parsePayload(payloadJson: string | null): Record<string, unknown> | null {
  if (!payloadJson) {
    return null
  }
  try {
    const parsed = JSON.parse(payloadJson)
    if (parsed && typeof parsed === 'object') {
      return parsed as Record<string, unknown>
    }
    return null
  } catch {
    return null
  }
}

function buildFallbackSections(): HomeContentSection[] {
  return [
    {
      id: 1,
      sectionType: 'hero',
      title: 'Ana + Daniel',
      subtitle:
        'Con mucha ilusión, te invitamos a compartir una celebración íntima llena de flores, música y amor.',
      body: '12 de diciembre de 2026 · Ciudad de México',
      payloadJson: null,
      orderIndex: 1,
    },
    {
      id: 2,
      sectionType: 'countdown',
      title: 'Cuenta regresiva',
      subtitle: 'Faltan pocos días para celebrar este nuevo capítulo.',
      body: null,
      payloadJson: '{"targetDateIso":"2026-12-12T16:00:00"}',
      orderIndex: 2,
    },
  ]
}
