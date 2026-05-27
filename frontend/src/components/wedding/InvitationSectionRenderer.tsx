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
      <WeddingSection>
        <UiCard className="wedding-frame px-6 py-8 text-center md:px-10">
          <h2 className="font-serif text-3xl md:text-4xl">{section.title}</h2>
          {section.subtitle && (
            <p className="mt-2 text-zinc-600 dark:text-zinc-300">{section.subtitle}</p>
          )}
          {section.body && (
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">{section.body}</p>
          )}
        </UiCard>
      </WeddingSection>
    )
  }

  if (section.sectionType === 'timeline') {
    const items = Array.isArray(payload?.items) ? payload.items : []
    return (
      <WeddingSection>
        <UiCard className="wedding-frame px-6 py-8 md:px-10">
          <h2 className="font-serif text-3xl md:text-4xl">{section.title}</h2>
          <FloralDivider className="mt-3" />
          <ol className="mt-5 grid gap-3">
            {items.map((item, index) => (
              <li
                key={`${section.id}-t-${index}`}
                className="grid gap-1 rounded-2xl border border-amber-200/50 bg-white/80 p-4 md:grid-cols-[110px_1fr] md:items-center dark:border-zinc-700 dark:bg-zinc-900/60"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-rose-500">
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

  if (section.sectionType === 'dress_code') {
    return (
      <WeddingSection>
        <UiCard className="wedding-frame px-6 py-8 md:px-10">
          <h2 className="font-serif text-3xl md:text-4xl">{section.title}</h2>
          {section.subtitle && (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{section.subtitle}</p>
          )}
          {section.body && (
            <p className="mt-4 text-sm text-zinc-700 dark:text-zinc-200">{section.body}</p>
          )}
        </UiCard>
      </WeddingSection>
    )
  }

  return (
    <WeddingSection>
      <UiCard className="wedding-frame px-6 py-8 md:px-10">
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
