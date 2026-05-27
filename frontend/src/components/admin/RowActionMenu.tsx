import { type ReactNode } from 'react'
import { UiButton } from '../ui'

export function RowActionMenu({ children }: { children: ReactNode }) {
  return (
    <details className="relative">
      <summary className="list-none [&::-webkit-details-marker]:hidden">
        <UiButton type="button">Acciones</UiButton>
      </summary>
      <div className="absolute right-0 z-20 mt-2 grid min-w-44 gap-1 rounded-2xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
        {children}
      </div>
    </details>
  )
}
