import { easeOut, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, MapPin } from 'lucide-react'
import { FloralCorner } from '../components/wedding/FloralCorner'
import { FloralDivider } from '../components/wedding/FloralDivider'
import { FloatingPetals } from '../components/wedding/FloatingPetals'
import { FloralWreath } from '../components/wedding/FloralWreath'
import { LoveStoryTimeline } from '../components/wedding/LoveStoryTimeline'
import { WeddingSection } from '../components/wedding/WeddingSection'
import { UiCard } from '../components/ui'
import {
  getHomePageContent,
  type HomeContentSection,
  type PublicEventTeaser,
  type PublicLoveStory,
} from '../lib/api'

const FALLBACK_COUNTDOWN_DATE = '2026-12-12T16:00:00'
const SENSITIVE_SECTION_TYPES = new Set(['locations', 'dress_code', 'timeline', 'rsvp'])
const SENSITIVE_TITLE_TOKENS = [
  'aporte',
  'cuenta',
  'clabe',
  'direcci',
  'ubicac',
  'itinerar',
  'horario',
  'dress',
]

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

function isPublicSafeSection(section: HomeContentSection): boolean {
  const type = (section.sectionType ?? '').toLowerCase()
  if (SENSITIVE_SECTION_TYPES.has(type)) {
    return false
  }
  const title = (section.title ?? '').toLowerCase()
  return !SENSITIVE_TITLE_TOKENS.some((token) => title.includes(token))
}

export function HomePage() {
  const [event, setEvent] = useState<PublicEventTeaser | null>(null)
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

  const heroSection = useMemo(
    () => normalizedSections.find((section) => section.sectionType === 'hero'),
    [normalizedSections],
  )

  const teaserSections = useMemo(
    () =>
      normalizedSections.filter(
        (section) => section.sectionType !== 'hero' && isPublicSafeSection(section),
      ),
    [normalizedSections],
  )

  return (
    <div className="wedding-paper relative h-[100dvh] overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth">
      <FloatingPetals falling count={16} className="fixed inset-0 z-0" />

      <main className="relative z-10 w-full flex flex-col">
        <HomeHeroSection
          section={heroSection ?? buildFallbackSections()[0]}
          cityLabel={event?.cityLabel ?? null}
          eventDate={event?.eventDate ?? null}
        />

        {loading && (
          <div className="min-h-[100dvh] w-full snap-start flex flex-col justify-center items-center px-4 py-12">
            <UiCard className="relative p-12 text-center text-xl">
              <p>Cargando contenido de la invitación...</p>
            </UiCard>
          </div>
        )}
        {error && !loading && (
          <div className="min-h-[100dvh] w-full snap-start flex flex-col justify-center items-center px-4 py-12">
            <section className="rounded-3xl border border-rose-200 bg-rose-50 p-12 text-center text-xl text-rose-700 dark:border-rose-700/60 dark:bg-rose-950/30 dark:text-rose-200">
              <p>{error}</p>
            </section>
          </div>
        )}

        {!loading &&
          teaserSections.map((section) => (
            <HomeSectionRenderer
              key={section.id}
              section={section}
              tick={tick}
              event={event}
            />
          ))}

        {!loading && loveStory && loveStory.entries.length > 0 && (
          <div className="min-h-[100dvh] w-full snap-start flex flex-col justify-start items-center px-4 py-12 md:py-24">
            <div className="w-full max-w-6xl">
              <LoveStoryTimeline
                title={loveStory.title}
                subtitle={loveStory.subtitle}
                entries={loveStory.entries}
              />
            </div>
          </div>
        )}

        {!loading && (
          <div className="w-full snap-start flex flex-col justify-center items-center py-16 px-4">
            <WeddingSection className="w-full max-w-3xl">
              <UiCard className="wedding-frame relative px-8 py-16 text-center md:px-16 md:py-20">
                <p className="eyebrow !text-sm">Próximo capítulo</p>
                <h2 className="mt-4 font-serif text-3xl md:text-5xl">
                  ¿Tienes una invitación personal?
                </h2>
                <FloralDivider className="mt-6" />
                <p className="mt-6 mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Abre el enlace privado que recibiste por mensaje para descubrir los detalles
                  exclusivos de tu familia: lugares exactos, itinerario y confirmación de asistencia.
                </p>
                <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
                  Si aún no lo recibiste, escríbenos para enviártelo con cariño.
                </p>
              </UiCard>
            </WeddingSection>
          </div>
        )}
      </main>
    </div>
  )
}

function HomeHeroSection({
  section,
  cityLabel,
  eventDate,
}: {
  section: HomeContentSection
  cityLabel: string | null
  eventDate: string | null
}) {
  const reduceMotion = useReducedMotion()
  const heroRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const cornerY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ['0%', '0%'] : ['0%', '-22%'])
  const cornerOpacity = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1, 0.35])
  const wreathScale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1, 1.15])

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
  }

  return (
    <div
      ref={heroRef}
      className="relative min-h-[100dvh] w-full snap-start flex flex-col justify-center items-center px-4 py-12"
    >
      <WeddingSection className="w-full max-w-5xl">
        <section
          id="inicio-invitacion"
          className="wedding-frame section-glow relative overflow-hidden px-8 py-20 text-center md:px-16 md:py-32"
        >
          {!reduceMotion ? (
            <>
              <motion.div style={{ y: cornerY, opacity: cornerOpacity }} className="absolute inset-0 pointer-events-none">
                <FloralCorner position="top-left" />
                <FloralCorner position="top-right" />
                <FloralCorner position="bottom-left" />
                <FloralCorner position="bottom-right" />
              </motion.div>
              <motion.div
                aria-hidden
                style={{ scale: wreathScale }}
                className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-25 dark:opacity-15"
              >
                <FloralWreath className="h-[78%] w-[78%] max-w-[640px]" />
              </motion.div>
            </>
          ) : (
            <>
              <FloralCorner position="top-left" />
              <FloralCorner position="top-right" />
              <FloralCorner position="bottom-left" />
              <FloralCorner position="bottom-right" />
            </>
          )}

          <motion.div
            className="relative z-10"
            initial={reduceMotion ? 'visible' : 'hidden'}
            animate="visible"
            variants={containerVariants}
          >
            <motion.p variants={itemVariants} className="eyebrow !text-sm">
              Edición especial
            </motion.p>
            <motion.div variants={itemVariants}>
              <motion.p
                layoutId="couple-names"
                className="wedding-script mt-6 text-7xl text-rose-600 md:text-8xl lg:text-[140px] dark:text-rose-300"
                transition={{ type: 'spring', stiffness: 160, damping: 20 }}
              >
                {section.title}
              </motion.p>
            </motion.div>
            {section.subtitle && (
              <motion.p
                variants={itemVariants}
                className="mx-auto mt-8 max-w-3xl text-xl text-zinc-600 md:text-2xl dark:text-zinc-300 leading-relaxed"
              >
                {section.subtitle}
              </motion.p>
            )}
            {(section.body || eventDate) && (
              <motion.p
                variants={itemVariants}
                className="mt-8 font-serif text-2xl md:text-4xl text-rose-700 dark:text-rose-300"
              >
                {section.body ?? eventDate}
              </motion.p>
            )}
            {cityLabel && (
              <motion.div variants={itemVariants} className="mt-6 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-white/80 px-5 py-2 text-sm font-medium tracking-wide text-amber-800 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-amber-200">
                  <MapPin className="h-4 w-4" aria-hidden />
                  {cityLabel}
                </span>
              </motion.div>
            )}
            <motion.div variants={itemVariants}>
              <FloralDivider label="Save the date" className="mt-12" />
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="mt-12 flex flex-wrap items-center justify-center gap-4"
            >
              <a
                href="#seccion-countdown"
                className="inline-flex items-center justify-center rounded-full border border-amber-200/80 bg-white/80 px-8 py-4 text-lg font-semibold text-zinc-700 shadow-md transition hover:bg-amber-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                Cuenta regresiva
              </a>
              <span className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50/70 px-6 py-3 text-sm font-medium tracking-wide text-rose-700 dark:border-rose-700/40 dark:bg-rose-950/30 dark:text-rose-200">
                Detalles privados por invitación personal
              </span>
            </motion.div>
          </motion.div>
        </section>
      </WeddingSection>

      {!reduceMotion && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-rose-500/80 dark:text-rose-300/80"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: [0, 0.85, 0.4], y: [0, 6, 0] }}
          transition={{ delay: 1.2, duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      )}
    </div>
  )
}

function HomeSectionRenderer({
  section,
  tick,
  event,
}: {
  section: HomeContentSection
  tick: number
  event: PublicEventTeaser | null
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
      <div className="min-h-[100dvh] w-full snap-start flex flex-col justify-center items-center px-4 py-12">
        <WeddingSection className="w-full max-w-5xl">
          <UiCard id={sectionId} className="wedding-frame relative px-8 py-20 text-center md:px-16 md:py-32">
            <FloralCorner position="top-right" className="opacity-35" />
            <FloralCorner position="bottom-left" className="opacity-35" />
            <h2 className="font-serif text-5xl md:text-6xl">{section.title}</h2>
            <p className="mt-8 font-serif text-5xl md:text-7xl font-semibold text-zinc-900 dark:text-zinc-100">
              {countdown}
            </p>
            {section.subtitle && (
              <p className="mt-6 text-xl md:text-2xl text-zinc-500 dark:text-zinc-400">{section.subtitle}</p>
            )}
            <FloralDivider className="mt-12" />
          </UiCard>
        </WeddingSection>
      </div>
    )
  }

  if (section.sectionType === 'highlights') {
    const items = Array.isArray(payload?.items) ? payload.items : []
    return (
      <div className="min-h-[100dvh] w-full snap-start flex flex-col justify-center items-center px-4 py-12">
        <WeddingSection className="w-full max-w-5xl">
          <UiCard id={sectionId} className="wedding-frame relative px-8 py-16 md:px-16 md:py-24">
            <h2 className="font-serif text-4xl md:text-6xl text-center">{section.title}</h2>
            <FloralDivider className="mt-6" />
            <motion.div
              className="mt-12 grid gap-6 md:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
            >
              {items.map((item, index) => (
                <motion.article
                  className="grid gap-3 rounded-3xl border border-amber-200/60 bg-gradient-to-br from-white to-rose-50/60 p-8 shadow-sm dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800 text-center"
                  key={`${section.id}-h-${index}`}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
                  }}
                >
                  <span className="text-sm font-bold uppercase tracking-[0.1em] text-rose-500 dark:text-rose-300">
                    {String(item?.label ?? '')}
                  </span>
                  <h3 className="font-serif text-3xl md:text-4xl">{String(item?.title ?? '')}</h3>
                  <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {String(item?.description ?? '')}
                  </p>
                </motion.article>
              ))}
            </motion.div>
          </UiCard>
        </WeddingSection>
      </div>
    )
  }

  if (section.sectionType === 'story') {
    const items = Array.isArray(payload?.items) ? payload.items : []
    return (
      <div className="min-h-[100dvh] w-full snap-start flex flex-col justify-center items-center px-4 py-12">
        <WeddingSection className="w-full max-w-5xl">
          <UiCard id={sectionId} className="wedding-frame px-8 py-16 md:px-16 md:py-24">
            <h2 className="font-serif text-4xl md:text-6xl text-center">{section.title}</h2>
            <FloralDivider className="mt-6" />
            <motion.div
              className="mt-12 grid gap-6 md:grid-cols-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
            >
              {items.map((item, index) => (
                <motion.article
                  className="rounded-3xl border border-amber-200/60 bg-white/80 p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/60"
                  key={`${section.id}-s-${index}`}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
                  }}
                >
                  <h3 className="font-serif text-2xl md:text-3xl">{String(item?.title ?? '')}</h3>
                  <p className="mt-3 text-base md:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {String(item?.description ?? '')}
                  </p>
                </motion.article>
              ))}
            </motion.div>
          </UiCard>
        </WeddingSection>
      </div>
    )
  }

  if (section.sectionType === 'gallery') {
    return <GallerySection section={section} payload={payload} sectionId={sectionId} />
  }

  return (
    <div className="min-h-[100dvh] w-full snap-start flex flex-col justify-center items-center px-4 py-12">
      <FloatingPetals falling />
      <WeddingSection className="w-full max-w-5xl">
        <UiCard id={sectionId} className="wedding-frame px-8 py-16 md:px-16 md:py-24 text-center">
          <h2 className="font-serif text-4xl md:text-6xl">{section.title}</h2>
          {section.subtitle && (
            <p className="mt-4 text-xl text-zinc-600 dark:text-zinc-300">{section.subtitle}</p>
          )}
          {section.body && (
            <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">{section.body}</p>
          )}
        </UiCard>
      </WeddingSection>
    </div>
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
    <div className="min-h-[100dvh] w-full snap-start flex flex-col justify-center items-center px-4 py-12">
      <FloatingPetals falling />
      <WeddingSection className="w-full max-w-6xl">
        <UiCard id={sectionId} className="wedding-frame relative px-6 py-12 md:px-12 md:py-20">
          <h2 className="font-serif text-4xl md:text-6xl text-center">{section.title}</h2>
          <FloralDivider className="mt-6" />
          <motion.div
            className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {items.map((item, index) => {
              const imageUrl =
                typeof item?.imageUrl === 'string' ? item.imageUrl : undefined
              const title = String(item?.title ?? '')
              const alt =
                typeof item?.alt === 'string' ? item.alt : title || 'Foto de la galería'

              return (
                <motion.article
                  className="group relative min-h-64 overflow-hidden rounded-3xl border border-zinc-200 shadow-sm dark:border-zinc-700"
                  key={`${section.id}-g-${index}`}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                  }}
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
                        className="h-64 md:h-72 w-full object-cover transition duration-700 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.style.display = 'none'
                        }}
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 py-5 text-lg font-semibold text-white">
                        {title}
                      </span>
                    </button>
                  ) : (
                    <div className="flex min-h-64 items-end bg-gradient-to-br from-rose-300/70 to-emerald-200/70 p-6 text-xl font-semibold text-zinc-800 dark:from-rose-900/50 dark:to-emerald-900/50 dark:text-zinc-100">
                      <span>{title}</span>
                    </div>
                  )}
                </motion.article>
              )
            })}
          </motion.div>
        </UiCard>

        {lightboxUrl && (
          <motion.button
            type="button"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setLightboxUrl(null)}
            aria-label="Cerrar imagen ampliada"
          >
            <motion.img
              src={lightboxUrl}
              alt=""
              className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
              initial={reduceMotion ? false : { scale: 0.92 }}
              animate={{ scale: 1 }}
              onClick={(event) => event.stopPropagation()}
            />
          </motion.button>
        )}
      </WeddingSection>
    </div>
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
