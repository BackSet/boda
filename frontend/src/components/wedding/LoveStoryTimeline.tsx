import { motion, useReducedMotion } from 'motion/react'
import { Heart, Sparkles } from 'lucide-react'
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
    <article className="timeline-card-glow rounded-2xl border border-amber-200/70 bg-gradient-to-br from-white to-rose-50/60 p-4 dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800">
      <div className="floral-watermark" />
      <div className="relative z-10">
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
            className="mt-3 max-h-56 w-full rounded-xl object-cover shadow-sm"
            loading="lazy"
          />
        )}
      </div>
    </article>
  )
}

function TimelineMatchNode({ reduceMotion }: { reduceMotion: boolean | null }) {
  const NodeIcon = reduceMotion ? 'div' : motion.div

  const nodeProps = reduceMotion
    ? {
        className:
          'match-glow absolute left-[24px] top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-amber-300 bg-gradient-to-br from-amber-100 to-amber-50 shadow-xl md:left-1/2 md:-translate-x-1/2 dark:border-amber-600 dark:from-amber-900 dark:to-zinc-900',
      }
    : {
        className:
          'match-glow absolute left-[24px] top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-amber-300 bg-gradient-to-br from-amber-100 to-amber-50 shadow-xl md:left-1/2 md:-translate-x-1/2 dark:border-amber-600 dark:from-amber-900 dark:to-zinc-900',
        initial: { scale: 0.8, opacity: 0, y: '-50%', x: '-50%' },
        whileInView: { scale: 1, opacity: 1, y: '-50%', x: '-50%' },
        animate: { 
          scale: [1, 1.08, 1],
          boxShadow: [
            '0 0 35px rgba(181, 138, 75, 0.4), inset 0 0 15px rgba(255, 255, 255, 0.8)',
            '0 0 45px rgba(181, 138, 75, 0.7), inset 0 0 20px rgba(255, 255, 255, 1)',
            '0 0 35px rgba(181, 138, 75, 0.4), inset 0 0 15px rgba(255, 255, 255, 0.8)'
          ]
        },
        transition: {
          scale: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const },
          boxShadow: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const },
          opacity: { duration: 0.5 },
        },
        viewport: { once: true, margin: '-20px' },
      }

  // Adjust x transform for mobile (left-1.5 means we don't translate-x-1/2 on mobile)
  if (!reduceMotion && 'initial' in nodeProps) {
    (nodeProps as any).initial.x = '0';
    (nodeProps as any).whileInView.x = '0';
  }

  return (
    <NodeIcon {...nodeProps} className={`${nodeProps.className} md:-translate-x-1/2`}>
      <Heart className="absolute h-6 w-6 fill-amber-500 text-amber-500" aria-hidden />
      {!reduceMotion && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
          whileInView={{ opacity: 1, scale: 1.2, rotate: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
           <Sparkles className="absolute -top-1 -right-2 h-5 w-5 text-amber-400" />
           <Sparkles className="absolute -bottom-2 -left-1 h-4 w-4 text-amber-400 opacity-80" />
        </motion.div>
      )}
      <span className="sr-only">Fecha compartida</span>
    </NodeIcon>
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
        <TimelineMatchNode reduceMotion={reduceMotion} />
        <div className="relative ml-16 overflow-hidden rounded-3xl border border-amber-200/80 bg-gradient-to-b from-amber-50/40 to-transparent p-4 pt-10 md:ml-0 md:p-6 md:pt-10 dark:border-amber-900/50 dark:from-amber-950/30">
          <div className="floral-watermark opacity-10" />
          <motion.p 
            className="relative z-10 mb-5 text-center text-xs font-bold uppercase tracking-[0.16em] text-amber-600 md:pl-0 dark:text-amber-400"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
          >
            {formatDate(group.date)}
          </motion.p>
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

  const isA = group.entry.author === 'PARTNER_A'
  // El lado izquierdo pertenece a PARTNER_A y el lado derecho a PARTNER_B
  const alignRight = !isA

  const dotColorClass = isA 
    ? 'border-rose-400 text-rose-600 dark:border-rose-600 dark:text-rose-300' 
    : 'border-slate-400 text-slate-600 dark:border-slate-500 dark:text-slate-300'

  
  // Mobile: left-[12px] or left-[36px]
  // Desktop: left-[calc(50%-12px)] or left-[calc(50%+12px)]
  const dotPosition = isA 
    ? 'left-[12px] md:left-[calc(50%-12px)]' 
    : 'left-[36px] md:left-[calc(50%+12px)]'

  return (
    <Item key={group.entry.id} {...itemProps}>
      <span className={`absolute ${dotPosition} top-6 z-10 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-2 bg-white text-[10px] font-bold shadow-sm dark:bg-zinc-900 ${dotColorClass}`}>
        {index + 1}
      </span>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8">
        <div className={`relative ml-16 md:ml-0 ${alignRight ? 'md:col-start-2 md:ml-10' : 'md:mr-10'}`}>
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

        <div className="relative mt-8">
          <div className="absolute inset-y-2 left-0 w-[48px] md:left-1/2 md:-translate-x-1/2 z-0">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 48 100">
              <defs>
                <linearGradient id="pathA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fb7185" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="pathB" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#475569" stopOpacity="1" />
              </linearGradient>
              </defs>
              <motion.path 
                d="M 12 0 L 12 85 C 12 95, 24 97, 24 100" 
                stroke="url(#pathA)" 
                strokeWidth="2" 
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                viewport={{ once: true }}
              />
              <motion.path 
                d="M 36 0 L 36 85 C 36 95, 24 97, 24 100" 
                stroke="url(#pathB)" 
                strokeWidth="2" 
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
                viewport={{ once: true }}
              />
            </svg>
          </div>

          <ol className="relative space-y-8 z-10 pt-8 pb-16">
            {groups.map((group, index) => renderGroup(group, index, reduceMotion))}
          </ol>

          {/* El Destino (Matrimonio) */}
          <div className="absolute bottom-0 left-[24px] -translate-x-1/2 md:left-1/2 flex flex-col items-center z-20">
            <motion.div
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-amber-300 bg-gradient-to-br from-white to-amber-50 shadow-lg dark:border-amber-600 dark:from-zinc-900 dark:to-zinc-800"
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="text-xl">💍</span>
            </motion.div>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-500">Un Destino</p>
          </div>
        </div>
      </UiCard>
    </WeddingSection>
  )
}
