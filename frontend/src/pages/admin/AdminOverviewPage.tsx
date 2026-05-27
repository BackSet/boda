import { Link } from 'react-router-dom'
import { UiButton, UiCard } from '../../components/ui'
import { useAdminSummary } from '../../hooks/useAdminSummary'

export function AdminOverviewPage() {
  const { summary, loading, error, refresh } = useAdminSummary()

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Overview</p>
          <h2 className="text-3xl">Resumen RSVP</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Personas confirmadas y familias que ya respondieron.
          </p>
        </div>
        <UiButton onClick={refresh}>Actualizar</UiButton>
      </div>

      {loading && <p className="text-sm text-zinc-500 dark:text-zinc-400">Cargando resumen...</p>}
      {error && (
        <p className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
          {error}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <UiCard className="rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
            Personas que asisten
          </p>
          <strong className="mt-1 block text-3xl">{summary.guestsAttending}</strong>
        </UiCard>
        <UiCard className="rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
            Personas que declinan
          </p>
          <strong className="mt-1 block text-3xl">{summary.guestsDeclined}</strong>
        </UiCard>
        <UiCard className="rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
            Familias respondidas
          </p>
          <strong className="mt-1 block text-3xl">{summary.groupsResponded}</strong>
        </UiCard>
        <UiCard className="rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
            Familias pendientes
          </p>
          <strong className="mt-1 block text-3xl">{summary.groupsPending}</strong>
        </UiCard>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link to="/admin/grupos">
          <UiButton>Gestionar grupos</UiButton>
        </Link>
        <Link to="/admin/evento">
          <UiButton>Editar evento</UiButton>
        </Link>
        <Link to="/admin/contenido">
          <UiButton>Contenido home</UiButton>
        </Link>
        <Link to="/admin/contenido-invitacion">
          <UiButton>Contenido invitación</UiButton>
        </Link>
      </div>
    </section>
  )
}
