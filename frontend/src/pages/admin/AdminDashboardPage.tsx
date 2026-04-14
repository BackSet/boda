import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  type AdminGuest,
  type AdminGuestUpsertPayload,
  createAdminGuest,
  deleteAdminGuest,
  getAdminGuests,
  getAdminRsvpSummary,
  updateAdminGuest,
} from '../../lib/adminApi'
import { clearAdminToken } from '../../lib/adminAuth'

const EMPTY_FORM: AdminGuestUpsertPayload = {
  guestName: '',
  guestEmail: '',
  maxGuests: 1,
  eventTitle: 'Boda de Ana y Daniel',
  eventDate: '12 de diciembre de 2026 · 16:00 hrs',
  ceremonyAddress: 'Parroquia de San Miguel, Centro Historico',
  receptionAddress: 'Casa Editorial Roma Norte',
}

type AdminSummary = {
  confirmed: number
  declined: number
  pending: number
  confirmedGuests: number
}

export function AdminDashboardPage() {
  const [guests, setGuests] = useState<AdminGuest[]>([])
  const [summary, setSummary] = useState<AdminSummary>({
    confirmed: 0,
    declined: 0,
    pending: 0,
    confirmedGuests: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editingGuest, setEditingGuest] = useState<AdminGuest | null>(null)
  const [form, setForm] = useState<AdminGuestUpsertPayload>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  useEffect(() => {
    void refreshData()
  }, [])

  async function refreshData() {
    setLoading(true)
    setError(null)
    try {
      const [guestsData, summaryData] = await Promise.all([
        getAdminGuests(),
        getAdminRsvpSummary(),
      ])
      setGuests(guestsData)
      setSummary(summaryData)
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'No se pudo cargar la información del panel',
      )
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(guest: AdminGuest) {
    setEditingGuest(guest)
    setForm({
      guestName: guest.guestName,
      guestEmail: guest.guestEmail ?? '',
      maxGuests: guest.maxGuests,
      eventTitle: guest.eventTitle,
      eventDate: guest.eventDate,
      ceremonyAddress: guest.ceremonyAddress,
      receptionAddress: guest.receptionAddress,
    })
    setSaveMessage(null)
  }

  function handleCreateNew() {
    setEditingGuest(null)
    setForm(EMPTY_FORM)
    setSaveMessage(null)
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar invitado? Esta acción no se puede deshacer.')) {
      return
    }
    try {
      await deleteAdminGuest(id)
      await refreshData()
      if (editingGuest?.id === id) {
        handleCreateNew()
      }
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'No se pudo eliminar el invitado',
      )
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setSaveMessage(null)
    setError(null)

    try {
      if (editingGuest) {
        await updateAdminGuest(editingGuest.id, form)
        setSaveMessage('Invitado actualizado correctamente.')
      } else {
        await createAdminGuest(form)
        setSaveMessage('Invitado creado correctamente.')
      }
      await refreshData()
      if (!editingGuest) {
        handleCreateNew()
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'No se pudo guardar el invitado',
      )
    } finally {
      setSaving(false)
    }
  }

  async function copyToClipboard(text: string, successMessage: string) {
    try {
      await navigator.clipboard.writeText(text)
      setSaveMessage(successMessage)
    } catch {
      setError('No se pudo copiar al portapapeles')
    }
  }

  const orderedGuests = useMemo(() => guests, [guests])

  return (
    <main className="admin-page">
      <section className="admin-header">
        <div>
          <p className="eyebrow">Panel de invitados</p>
          <h1>Gestión administrativa</h1>
          <p>Administra invitados, enlaces personalizados y estado RSVP.</p>
        </div>
        <button
          type="button"
          className="admin-logout-btn"
          onClick={() => {
            clearAdminToken()
            window.location.href = '/admin/login'
          }}
        >
          Cerrar sesión
        </button>
      </section>

      <section className="admin-summary-grid">
        <article className="admin-summary-card">
          <h3>Confirmados</h3>
          <p>{summary.confirmed}</p>
        </article>
        <article className="admin-summary-card">
          <h3>No asisten</h3>
          <p>{summary.declined}</p>
        </article>
        <article className="admin-summary-card">
          <h3>Pendientes</h3>
          <p>{summary.pending}</p>
        </article>
        <article className="admin-summary-card">
          <h3>Asistentes confirmados</h3>
          <p>{summary.confirmedGuests}</p>
        </article>
      </section>

      <section className="admin-layout-grid">
        <article className="section panel admin-panel">
          <div className="admin-panel-header">
            <h2>{editingGuest ? 'Editar invitado' : 'Crear invitado'}</h2>
            <button
              type="button"
              className="admin-secondary-btn"
              onClick={handleCreateNew}
            >
              Nuevo
            </button>
          </div>

          <form className="admin-form" onSubmit={handleSubmit}>
            <label>
              Nombre del invitado
              <input
                value={form.guestName}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, guestName: event.target.value }))
                }
                required
              />
            </label>
            <label>
              Email (opcional)
              <input
                type="email"
                value={form.guestEmail}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, guestEmail: event.target.value }))
                }
              />
            </label>
            <label>
              Cupos máximos
              <input
                type="number"
                min={1}
                max={10}
                value={form.maxGuests}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    maxGuests: Number(event.target.value),
                  }))
                }
                required
              />
            </label>
            <label>
              Título del evento
              <input
                value={form.eventTitle}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, eventTitle: event.target.value }))
                }
                required
              />
            </label>
            <label>
              Fecha del evento
              <input
                value={form.eventDate}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, eventDate: event.target.value }))
                }
                required
              />
            </label>
            <label>
              Dirección de ceremonia
              <input
                value={form.ceremonyAddress}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    ceremonyAddress: event.target.value,
                  }))
                }
                required
              />
            </label>
            <label>
              Dirección de recepción
              <input
                value={form.receptionAddress}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    receptionAddress: event.target.value,
                  }))
                }
                required
              />
            </label>

            <button type="submit" className="primary-btn" disabled={saving}>
              {saving
                ? 'Guardando...'
                : editingGuest
                  ? 'Actualizar invitado'
                  : 'Crear invitado'}
            </button>
          </form>
        </article>

        <article className="section panel admin-panel">
          <h2>Invitados</h2>
          {loading && <p>Cargando invitados...</p>}
          {!loading && orderedGuests.length === 0 && (
            <p>No hay invitados registrados todavía.</p>
          )}

          {!loading && orderedGuests.length > 0 && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Invitado</th>
                    <th>Token</th>
                    <th>RSVP</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orderedGuests.map((guest) => {
                    const rsvpLabel =
                      guest.attending === null
                        ? 'Pendiente'
                        : guest.attending
                          ? `Asiste (${guest.guestCount ?? 0})`
                          : 'No asiste'
                    return (
                      <tr key={guest.id}>
                        <td>
                          <strong>{guest.guestName}</strong>
                          <br />
                          <small>{guest.guestEmail ?? 'Sin email'}</small>
                        </td>
                        <td>{guest.token}</td>
                        <td>{rsvpLabel}</td>
                        <td>
                          <div className="admin-action-group">
                            <button
                              type="button"
                              className="admin-secondary-btn"
                              onClick={() => handleEdit(guest)}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className="admin-secondary-btn"
                              onClick={() =>
                                copyToClipboard(
                                  guest.invitationUrl,
                                  'URL de invitación copiada',
                                )
                              }
                            >
                              Copiar URL
                            </button>
                            <button
                              type="button"
                              className="admin-secondary-btn"
                              onClick={() =>
                                copyToClipboard(
                                  buildWhatsAppMessage(guest),
                                  'Mensaje de WhatsApp copiado',
                                )
                              }
                            >
                              Copiar WhatsApp
                            </button>
                            <button
                              type="button"
                              className="admin-danger-btn"
                              onClick={() => handleDelete(guest.id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>

      {saveMessage && <p className="success-text">{saveMessage}</p>}
      {error && <p className="error-text">{error}</p>}
    </main>
  )
}

function buildWhatsAppMessage(guest: AdminGuest): string {
  return [
    `Hola ${guest.guestName},`,
    'Nos encantará contar contigo en nuestra boda.',
    `Aquí tienes tu invitación personal: ${guest.invitationUrl}`,
    'Por favor confirma tu asistencia en el enlace.',
  ].join('\n')
}
