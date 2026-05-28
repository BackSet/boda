import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { partnerLogin } from '../../lib/partnerApi'
import { isPartnerAuthenticated, setPartnerSession } from '../../lib/partnerAuth'

export function PartnerLoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isPartnerAuthenticated()) {
    return <Navigate to="/pareja" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await partnerLogin(username, password)
      setPartnerSession(response.token, response.displayName, response.expiresAt)
      navigate('/pareja', { replace: true })
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'No se pudo iniciar sesión',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center p-4">
      <section className="grid w-full max-w-md gap-4 rounded-3xl border border-amber-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="eyebrow">Historia de amor</p>
        <h1 className="font-serif text-4xl">Acceso de pareja</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Cargá tus momentos en secreto. No podrás ver el lado de tu pareja hasta que el
          administrador publique la sección en la página principal.
        </p>

        <form onSubmit={handleSubmit} className="grid gap-3">
          <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Usuario
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-zinc-700 dark:bg-zinc-900"
              required
            />
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-zinc-700 dark:bg-zinc-900"
              required
            />
          </label>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full border border-rose-700 bg-rose-700 px-4 py-2.5 font-semibold text-white transition hover:bg-rose-800 disabled:cursor-wait disabled:opacity-70"
            disabled={loading}
          >
            {loading ? 'Validando...' : 'Entrar'}
          </button>
        </form>

        {error && (
          <p className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
            {error}
          </p>
        )}
      </section>
    </main>
  )
}
