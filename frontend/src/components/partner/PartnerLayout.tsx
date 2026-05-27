import { Link, Outlet, useNavigate } from 'react-router-dom'
import { clearPartnerSession, getPartnerDisplayName } from '../../lib/partnerAuth'

export function PartnerLayout() {
  const navigate = useNavigate()
  const displayName = getPartnerDisplayName() ?? 'Pareja'

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-zinc-200 bg-white px-4 py-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <p className="eyebrow">Historia de amor</p>
          <h1 className="text-2xl font-serif">Hola, {displayName}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/"
            className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          >
            Ver sitio
          </Link>
          <button
            type="button"
            className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
            onClick={() => {
              clearPartnerSession()
              navigate('/pareja/login', { replace: true })
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  )
}
