import { useEffect, useState, type FormEvent } from 'react'
import { UiButton, UiCard, UiInput } from '../../components/ui'
import type { AdminEventUpsert } from '../../lib/api/event'
import { getAdminEvent, updateAdminEvent } from '../../lib/adminApi'

const EMPTY: AdminEventUpsert = {
  coupleDisplayName: '',
  eventTitle: '',
  eventDate: '',
  targetDateIso: '',
  ceremonyAddress: '',
  receptionAddress: '',
  ceremonyMapUrl: '',
  receptionMapUrl: '',
  dressCode: '',
  cityLabel: '',
}

export function AdminEventPage() {
  const [form, setForm] = useState<AdminEventUpsert>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getAdminEvent()
      .then((data) => {
        if (active) {
          setForm({
            ...data,
            dressCode: data.dressCode ?? '',
            ceremonyMapUrl: data.ceremonyMapUrl ?? '',
            receptionMapUrl: data.receptionMapUrl ?? '',
            cityLabel: data.cityLabel ?? '',
          })
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Error al cargar evento')
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setMessage(null)
    try {
      await updateAdminEvent({
        ...form,
        dressCode: form.dressCode?.trim() || undefined,
        cityLabel: form.cityLabel?.trim() || undefined,
      })
      setMessage('Evento actualizado correctamente.')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo guardar')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-zinc-500">Cargando datos del evento...</p>
  }

  return (
    <section className="space-y-4">
      <div>
        <p className="eyebrow">Evento</p>
        <h2 className="text-3xl">Datos globales de la boda</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Los datos exactos (direcciones, mapas, dress code, dirección de cuentas) solo aparecen en las
          invitaciones individuales con token. La página pública únicamente muestra nombres, fecha,
          countdown e historia, junto con una zona/ciudad general si la configuras abajo.
        </p>
      </div>

      {error && (
        <p className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
          {message}
        </p>
      )}

      <UiCard>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <label className="ui-field-label md:col-span-2">
            Nombre de la pareja
            <UiInput
              value={form.coupleDisplayName}
              onChange={(e) => setForm((c) => ({ ...c, coupleDisplayName: e.target.value }))}
              required
            />
          </label>
          <label className="ui-field-label md:col-span-2">
            Título del evento
            <UiInput
              value={form.eventTitle}
              onChange={(e) => setForm((c) => ({ ...c, eventTitle: e.target.value }))}
              required
            />
          </label>
          <label className="ui-field-label">
            Fecha (texto)
            <UiInput
              value={form.eventDate}
              onChange={(e) => setForm((c) => ({ ...c, eventDate: e.target.value }))}
              required
            />
          </label>
          <label className="ui-field-label">
            Fecha ISO (countdown)
            <UiInput
              value={form.targetDateIso}
              onChange={(e) => setForm((c) => ({ ...c, targetDateIso: e.target.value }))}
              required
            />
          </label>
          <label className="ui-field-label md:col-span-2">
            Dirección ceremonia
            <UiInput
              value={form.ceremonyAddress}
              onChange={(e) => setForm((c) => ({ ...c, ceremonyAddress: e.target.value }))}
              required
            />
          </label>
          <label className="ui-field-label md:col-span-2">
            Enlace Google Maps ceremonia (opcional)
            <UiInput
              type="url"
              value={form.ceremonyMapUrl ?? ''}
              onChange={(e) => setForm((c) => ({ ...c, ceremonyMapUrl: e.target.value }))}
              placeholder="https://maps.google.com/..."
            />
            <span className="mt-1 text-xs font-normal text-zinc-500 dark:text-zinc-400">
              Si lo dejás vacío, se genera una búsqueda con la dirección de ceremonia.
            </span>
          </label>
          <label className="ui-field-label md:col-span-2">
            Dirección recepción
            <UiInput
              value={form.receptionAddress}
              onChange={(e) => setForm((c) => ({ ...c, receptionAddress: e.target.value }))}
              required
            />
          </label>
          <label className="ui-field-label md:col-span-2">
            Enlace Google Maps recepción (opcional)
            <UiInput
              type="url"
              value={form.receptionMapUrl ?? ''}
              onChange={(e) => setForm((c) => ({ ...c, receptionMapUrl: e.target.value }))}
              placeholder="https://maps.google.com/..."
            />
            <span className="mt-1 text-xs font-normal text-zinc-500 dark:text-zinc-400">
              Si lo dejás vacío, se genera una búsqueda con la dirección de recepción.
            </span>
          </label>
          <label className="ui-field-label md:col-span-2">
            Dress code
            <UiInput
              value={form.dressCode ?? ''}
              onChange={(e) => setForm((c) => ({ ...c, dressCode: e.target.value }))}
            />
          </label>
          <label className="ui-field-label md:col-span-2">
            Ciudad o zona pública (teaser home)
            <UiInput
              value={form.cityLabel ?? ''}
              onChange={(e) => setForm((c) => ({ ...c, cityLabel: e.target.value }))}
              placeholder="Ej.: Ciudad de México · Roma Norte"
            />
            <span className="mt-1 text-xs font-normal text-zinc-500 dark:text-zinc-400">
              Se muestra en la página pública como guía general. Las direcciones exactas siguen siendo privadas (solo invitación con token).
            </span>
          </label>
          <div className="md:col-span-2">
            <UiButton type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar evento'}
            </UiButton>
          </div>
        </form>
      </UiCard>
    </section>
  )
}
