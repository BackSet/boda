import { motion, useReducedMotion } from 'motion/react'
import { Heart } from 'lucide-react'
import { FloralDivider } from './FloralDivider'
import { UiCard } from '../ui'
import { WeddingSection } from './WeddingSection'
import {
  groupLoveStoryEntries,
  type LoveStoryEntry,
  type TimelineGroup,
} from '../../lib/loveStoryTimeline'

export type { LoveStoryEntry }

type LoveStoryTimelineProps = {
  title: string
  subtitle: string | null
  entries: LoveStoryEntry[]
}

function formatDate(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`)
  if (Number.isNaN(date.getTime())) return isoDate
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function LoveStoryMomentCard({
  entry,
  showAuthor = true,
  showDate = true,
}: {
  entry: LoveStoryEntry
  showAuthor?: boolean
  showDate?: boolean
}) {
  return (
    <article className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-white to-rose-50/60 p-4 shadow-sm dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-rose-600 dark:text-rose-300">
        {showDate && formatDate(entry.eventDate)}
        {showDate && showAuthor && ' · '}
        {showAuthor && entry.authorDisplayName}
      </p>
      {entry.title && <h3 className="mt-1 font-serif text-2xl">{entry.title}</h3>}
      <p className="mt-2 text-sm italic text-zinc-700 dark:text-zinc-200">
        &ldquo;{entry.quote}&rdquo;
      </p>
      {entry.imageUrl && (
        <img
          src={entry.imageUrl}
          alt={entry.title ?? entry.authorDisplayName}
          className="mt-3 max-h-56 w-full rounded-xl object-cover"
          loading="lazy"
        />
      )}
    </article>
  )
}

function TimelineHeartNode({ reduceMotion }: { reduceMotion: boolean | null }) {
  const HeartIcon = reduceMotion ? 'div' : motion.div
  const heartProps = reduceMotion
    ? {
        className:
          'absolute left-1.5 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-rose-300 bg-white shadow-md md:left-1/2 md:-translate-x-1/2 dark:border-rose-700 dark:bg-zinc-900',
      }
    : {
        className:
          'absolute left-1.5 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-rose-300 bg-white shadow-md md:left-1/2 md:-translate-x-1/2 dark:border-rose-700 dark:bg-zinc-900',
        initial: { scale: 0.85, opacity: 0 },
        whileInView: { scale: 1, opacity: 1 },
        animate: { scale: [1, 1.08, 1] },
        transition: {
          scale: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' as const },
          opacity: { duration: 0.4 },
        },
        viewport: { once: true },
      }

  return (
    <HeartIcon {...heartProps}>
      <Heart className="h-5 w-5 fill-rose-500 text-rose-500" aria-hidden />
      <span className="sr-only">Fecha compartida</span>
    </HeartIcon>
  )
}

function renderGroup(
  group: TimelineGroup,
  index: number,
  reduceMotion: boolean | null,
) {
  const Item = reduceMotion ? 'li' : motion.li
  const itemProps = reduceMotion
    ? { className: 'relative' }
    : {
        className: 'relative',
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-40px' },
        transition: { duration: 0.45, delay: index * 0.05 },
      }

  if (group.type === 'heart') {
    return (
      <Item key={`heart-${group.date}`} {...itemProps}>
        <div className="relative ml-10 rounded-3xl border border-rose-200/80 bg-rose-50/30 p-4 pt-8 md:ml-0 md:p-6 md:pt-10 dark:border-rose-900/50 dark:bg-rose-950/20">
          <TimelineHeartNode reduceMotion={reduceMotion} />
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.14em] text-rose-600 md:pl-0 dark:text-rose-300">
            {formatDate(group.date)}
          </p>
          <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            <div className="space-y-3 md:pr-6">
              {group.entriesA.map((entry) => (
                <LoveStoryMomentCard
                  key={entry.id}
                  entry={entry}
                  showDate={false}
                  showAuthor
                />
              ))}
            </div>
            <div className="space-y-3 md:pl-6">
              {group.entriesB.map((entry) => (
                <LoveStoryMomentCard
                  key={entry.id}
                  entry={entry}
                  showDate={false}
                  showAuthor
                />
              ))}
            </div>
          </div>
        </div>
      </Item>
    )
  }

  const alignRight = index % 2 === 1
  return (
    <Item key={group.entry.id} {...itemProps}>
      <div
        className={`grid gap-4 md:grid-cols-2 md:gap-8 ${
          alignRight ? 'md:[&>article]:col-start-2' : ''
        }`}
      >
        <div className={`relative ml-10 md:ml-0 ${alignRight ? 'md:mr-8' : 'md:ml-8'}`}>
          <span className="absolute left-1.5 top-6 z-10 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border-2 border-rose-300 bg-white text-[10px] font-bold text-rose-600 md:left-1/2 dark:border-rose-700 dark:bg-zinc-900 dark:text-rose-300">
            {index + 1}
          </span>
          <LoveStoryMomentCard entry={group.entry} />
        </div>
      </div>
    </Item>
  )
}

export function LoveStoryTimeline({ title, subtitle, entries }: LoveStoryTimelineProps) {
  const reduceMotion = useReducedMotion()
  const groups = groupLoveStoryEntries(entries)

  if (groups.length === 0) return null

  return (
    <WeddingSection id="historia-amor">
      <UiCard className="wedding-frame">
        <h2 className="text-center font-serif text-3xl md:text-4xl">{title}</h2>
        {subtitle && (
          <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-300">{subtitle}</p>
        )}
        <FloralDivider label="Nuestra historia" className="mt-4" />

        <ol className="relative mt-8 space-y-8 before:absolute before:inset-y-2 before:left-4 before:w-px before:bg-rose-200/80 md:before:left-1/2 md:before:-translate-x-px dark:before:rose-900/50">
          {groups.map((group, index) => renderGroup(group, index, reduceMotion))}
        </ol>
      </UiCard>
    </WeddingSection>
  )
}
