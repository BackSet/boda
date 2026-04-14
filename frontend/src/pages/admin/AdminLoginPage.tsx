import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { adminLogin } from '../../lib/adminApi'
import { isAdminAuthenticated, setAdminToken } from '../../lib/adminAuth'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isAdminAuthenticated()) {
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await adminLogin(username, password)
      setAdminToken(response.token)
      navigate('/admin', { replace: true })
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
    <main className="admin-auth-page">
      <section className="admin-auth-card">
        <p className="eyebrow">Panel administrativo</p>
        <h1>Acceso de administrador</h1>
        <p>Ingresa tus credenciales para gestionar invitados y RSVP.</p>

        <form onSubmit={handleSubmit} className="admin-form">
          <label>
            Usuario
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Validando...' : 'Entrar al panel'}
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}
      </section>
    </main>
  )
}
