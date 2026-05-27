import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { clearAdminToken } from '../../lib/adminAuth'

const NAV_ITEMS = [
  { to: '/admin/overview', label: 'Resumen' },
  { to: '/admin/grupos', label: 'Grupos familiares' },
  { to: '/admin/evento', label: 'Evento' },
  { to: '/admin/contenido', label: 'Contenido Home' },
  { to: '/admin/contenido-invitacion', label: 'Contenido Invitación' },
  { to: '/admin/cuentas', label: 'Cuentas bancarias' },
  { to: '/admin/historia-amor', label: 'Historia de amor' },
]

export function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-4 py-6 lg:grid-cols-[250px_1fr]">
      <aside className="hidden rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:block">
        <AdminSidebarContent onNavigate={() => setDrawerOpen(false)} />
      </aside>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px] lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[78vw] max-w-[280px] border-r border-zinc-200 bg-white p-3 shadow-xl transition-transform dark:border-zinc-800 dark:bg-zinc-900 lg:hidden ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminSidebarContent onNavigate={() => setDrawerOpen(false)} />
      </aside>

      <main className="min-w-0 space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-zinc-200 bg-white px-4 py-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <button
            type="button"
            className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 lg:hidden"
            onClick={() => setDrawerOpen((prev) => !prev)}
          >
            Menu
          </button>
          <div>
            <p className="eyebrow">Panel administrativo</p>
            <h1 className="text-3xl">Gestión de boda</h1>
          </div>
          <div className="ml-auto">
            <button
              type="button"
              className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              onClick={() => clearAdminToken()}
            >
              Cerrar sesión
            </button>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  )
}

function AdminSidebarContent({ onNavigate }: { onNavigate: () => void }) {
  return (
    <nav className="grid gap-1">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `rounded-xl px-3 py-2 text-sm font-medium transition ${
              isActive
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200'
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
