import { Clock, Shirt, Sparkles } from 'lucide-react'
import type { InvitationContentSection } from '../../lib/api'
import { FloralDivider } from './FloralDivider'
import { WeddingSection } from './WeddingSection'
import { UiCard } from '../ui'

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

export function InvitationSectionRenderer({
  section,
}: {
  section: InvitationContentSection
}) {
  const payload = parsePayload(section.payloadJson)

  if (section.sectionType === 'welcome') {
    return (
      <div className="min-h-[100dvh] w-full snap-start flex flex-col justify-center items-center px-4 py-12">
        <WeddingSection className="w-full max-w-4xl">
          <UiCard className="wedding-frame px-8 py-16 text-center md:px-16 md:py-24">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200">
              <Sparkles className="h-7 w-7" aria-hidden />
            </div>
            <p className="wedding-script mt-6 text-5xl text-rose-600 md:text-6xl dark:text-rose-300">
              {section.title}
            </p>
            <FloralDivider className="mt-4" />
            {section.subtitle && (
              <p className="mt-6 text-xl text-zinc-600 dark:text-zinc-300">{section.subtitle}</p>
            )}
            {section.body && (
              <p className="mt-6 mx-auto max-w-2xl text-lg text-zinc-700 dark:text-zinc-200 leading-relaxed">
                {section.body}
              </p>
            )}
          </UiCard>
        </WeddingSection>
      </div>
    )
  }

  if (section.sectionType === 'timeline') {
    const items = Array.isArray(payload?.items) ? payload.items : []
    return (
      <div className="min-h-[100dvh] w-full snap-start flex flex-col justify-center items-center px-4 py-12">
        <WeddingSection className="w-full max-w-5xl">
          <UiCard className="wedding-frame px-8 py-16 md:px-16 md:py-24">
            <div className="flex flex-col items-center gap-3 text-center">
              <Clock className="h-7 w-7 text-rose-600 dark:text-rose-300" aria-hidden />
              <h2 className="font-serif text-4xl md:text-6xl">{section.title}</h2>
            </div>
            <FloralDivider className="mt-6" />
            <ol className="mt-12 grid gap-6">
              {items.map((item, index) => (
                <li
                  key={`${section.id}-t-${index}`}
                  className="grid gap-4 rounded-3xl border border-amber-200/50 bg-white/80 p-6 shadow-sm md:grid-cols-[160px_1fr] md:items-center dark:border-zinc-700 dark:bg-zinc-900/60"
                >
                  <span className="text-lg font-bold uppercase tracking-[0.1em] text-rose-500">
                    {String(item?.time ?? '')}
                  </span>
                  <p className="text-xl text-zinc-700 dark:text-zinc-200">
                    {String(item?.description ?? '')}
                  </p>
                </li>
              ))}
            </ol>
          </UiCard>
        </WeddingSection>
      </div>
    )
  }

  if (section.sectionType === 'dress_code') {
    const colors = Array.isArray(payload?.colors) ? (payload.colors as unknown[]) : []
    return (
      <div className="min-h-[100dvh] w-full snap-start flex flex-col justify-center items-center px-4 py-12">
        <WeddingSection className="w-full max-w-4xl">
          <UiCard className="wedding-frame px-8 py-16 text-center md:px-16 md:py-24">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200">
              <Shirt className="h-7 w-7" aria-hidden />
            </div>
            <h2 className="mt-6 font-serif text-4xl md:text-5xl">{section.title}</h2>
            <FloralDivider className="mt-4" />
            {section.subtitle && (
              <p className="mt-6 text-xl text-zinc-600 dark:text-zinc-300">{section.subtitle}</p>
            )}
            {section.body && (
              <p className="mt-6 mx-auto max-w-2xl text-lg text-zinc-700 dark:text-zinc-200 leading-relaxed">
                {section.body}
              </p>
            )}
            {colors.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {colors.map((color, index) => (
                  <span
                    key={`${section.id}-c-${index}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/80 shadow-md"
                    style={{ backgroundColor: typeof color === 'string' ? color : '#f3d4e0' }}
                    title={typeof color === 'string' ? color : undefined}
                    aria-label={typeof color === 'string' ? color : 'Color sugerido'}
                  />
                ))}
              </div>
            )}
          </UiCard>
        </WeddingSection>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] w-full snap-start flex flex-col justify-center items-center px-4 py-12">
      <WeddingSection className="w-full max-w-5xl">
        <UiCard className="wedding-frame px-8 py-16 text-center md:px-16 md:py-24">
          <h2 className="font-serif text-4xl md:text-6xl">{section.title}</h2>
          {section.subtitle && (
            <p className="mt-4 text-xl text-zinc-600 dark:text-zinc-300">{section.subtitle}</p>
          )}
          {section.body && (
            <p className="mt-6 text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">{section.body}</p>
          )}
        </UiCard>
      </WeddingSection>
    </div>
  )
}
