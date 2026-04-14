import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getInvitationByToken, submitRsvp, type InvitationView } from '../lib/api'

type SubmitState = 'idle' | 'sending' | 'success' | 'error'

export function InvitationPage() {
  const { token = '' } = useParams()
  const [invitation, setInvitation] = useState<InvitationView | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [attending, setAttending] = useState(true)
  const [guestCount, setGuestCount] = useState(1)
  const [dietaryRestrictions, setDietaryRestrictions] = useState('')
  const [message, setMessage] = useState('')
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setLoadError(null)

    getInvitationByToken(token)
      .then((data) => {
        if (!active) {
          return
        }
        setInvitation(data)
        if (data.attending !== null) {
          setAttending(data.attending)
        }
        if (data.guestCount !== null && data.guestCount > 0) {
          setGuestCount(data.guestCount)
        } else {
          setGuestCount(1)
        }
        setDietaryRestrictions(data.dietaryRestrictions ?? '')
        setMessage(data.message ?? '')
      })
      .catch(() => {
        if (!active) {
          return
        }
        setLoadError(
          'No encontramos una invitacion valida para este enlace. Verifica tu token.',
        )
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [token])

  const guestLimit = useMemo(() => invitation?.maxGuests ?? 1, [invitation])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!invitation) {
      return
    }

    setSubmitState('sending')
    setSubmitError(null)

    try {
      await submitRsvp({
        token: invitation.token,
        attending,
        guestCount: attending ? guestCount : 0,
        dietaryRestrictions,
        message,
      })
      setSubmitState('success')
    } catch (error) {
      setSubmitState('error')
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Ocurrio un error al enviar tu confirmacion.',
      )
    }
  }

  if (loading) {
    return (
      <main className="editorial-page centered-state">
        <section className="section panel">
          <p className="eyebrow">Un momento</p>
          <h1>Preparando tu invitacion</h1>
          <p>Cargando detalles para tu experiencia personalizada...</p>
        </section>
      </main>
    )
  }

  if (loadError || !invitation) {
    return (
      <main className="editorial-page centered-state">
        <section className="section panel">
          <p className="eyebrow">Token no valido</p>
          <h1>Invitacion no disponible</h1>
          <p>{loadError}</p>
          <Link className="text-link" to="/">
            Volver al inicio
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="editorial-page">
      <section className="section hero invitation-hero">
        <p className="eyebrow">Invitado especial</p>
        <h1>{invitation.guestName}</h1>
        <p className="lead">
          Nos encantaria compartir contigo este momento.
          <br />
          {invitation.eventTitle}
        </p>
        <p className="date-label">{invitation.eventDate}</p>
        <div className="floral-divider">✿ ✿ ✿</div>
      </section>

      <section className="invitation-shell">
        <article className="section panel">
          <h2>Tu agenda de celebracion</h2>
          <div className="info-grid">
            <div className="info-block">
              <h3>Ceremonia</h3>
              <p>{invitation.ceremonyAddress}</p>
            </div>
            <div className="info-block">
              <h3>Recepcion</h3>
              <p>{invitation.receptionAddress}</p>
            </div>
            <div className="info-block">
              <h3>Lugares reservados</h3>
              <p>
                Puedes confirmar hasta <strong>{guestLimit}</strong>{' '}
                {guestLimit === 1 ? 'asistente' : 'asistentes'}.
              </p>
            </div>
          </div>
        </article>

        <article className="section panel rsvp-panel">
          <h2>Confirma tu asistencia</h2>
          <p>Completa el formulario para reservar tu lugar.</p>

          <form className="rsvp-form" onSubmit={handleSubmit}>
            <fieldset>
              <legend>Asistencia</legend>
              <label>
                <input
                  type="radio"
                  checked={attending}
                  onChange={() => setAttending(true)}
                />
                Asistire con gusto
              </label>
              <label>
                <input
                  type="radio"
                  checked={!attending}
                  onChange={() => setAttending(false)}
                />
                Esta vez no podre asistir
              </label>
            </fieldset>

            <label>
              Numero de asistentes
              <input
                type="number"
                min={1}
                max={guestLimit}
                value={attending ? guestCount : 0}
                onChange={(event) => setGuestCount(Number(event.target.value))}
                disabled={!attending}
              />
            </label>

            <label>
              Restricciones alimentarias
              <textarea
                value={dietaryRestrictions}
                onChange={(event) => setDietaryRestrictions(event.target.value)}
                rows={3}
                placeholder="Ejemplo: vegetariano, sin gluten, alergias..."
              />
            </label>

            <label>
              Mensaje para los novios
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={4}
                placeholder="Comparte un mensaje especial"
              />
            </label>

            <button
              className="primary-btn"
              type="submit"
              disabled={submitState === 'sending'}
            >
              {submitState === 'sending' ? 'Enviando...' : 'Enviar confirmacion'}
            </button>
          </form>

          {submitState === 'success' && (
            <p className="success-text">
              Confirmacion registrada. Gracias por acompanarnos.
            </p>
          )}
          {submitState === 'error' && (
            <p className="error-text">{submitError}</p>
          )}
        </article>
      </section>
    </main>
  )
}
