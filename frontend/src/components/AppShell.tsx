import { Link, Outlet, useLocation } from 'react-router-dom'
import { ThemeModeSelector } from './ThemeModeSelector'
import { useInvitationRevealContext } from '../lib/invitation-reveal-context'

export function AppShell() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isInvitationRoute = location.pathname.startsWith('/invitacion/')
  const { phase } = useInvitationRevealContext()

  const hideHeaderForEnvelope =
    isInvitationRoute &&
    (phase === 'sealed' || phase === 'opening' || phase === 'loading')

  return (
    <div className="min-h-screen">
      {!hideHeaderForEnvelope && (
        <header className="sticky top-0 z-30 border-b border-rose-100/80 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/88">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="font-serif text-xl font-semibold tracking-tight text-zinc-900 transition hover:text-rose-700 md:text-2xl dark:text-zinc-100 dark:hover:text-rose-300"
              >
                <span className="wedding-script text-3xl text-rose-600 md:text-4xl dark:text-rose-300">
                  Ana
                </span>
                <span className="mx-1 text-amber-600/80">&</span>
                <span className="wedding-script text-3xl text-rose-600 md:text-4xl dark:text-rose-300">
                  Daniel
                </span>
              </Link>
              {!isInvitationRoute && (
                <span className="hidden rounded-full border border-amber-200/80 bg-amber-50/60 px-2.5 py-0.5 text-xs font-semibold tracking-[0.08em] text-amber-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 sm:inline">
                  {isAdminRoute ? 'Admin' : 'Invitación'}
                </span>
              )}
            </div>
            <ThemeModeSelector />
          </div>
        </header>
      )}

      <Outlet />
    </div>
  )
}
