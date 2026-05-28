import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { UiButton, UiCard, UiConfirmDialog, UiInput, UiModal, UiTextarea } from '../../components/ui'
import {
  createPartnerLoveStoryEntry,
  deletePartnerLoveStoryEntry,
  getPartnerLoveStoryEntries,
  updatePartnerLoveStoryEntry,
  type PartnerLoveStoryEntry,
  type PartnerLoveStoryEntryPayload,
} from '../../lib/partnerApi'

const EMPTY_FORM: PartnerLoveStoryEntryPayload = {
  eventDate: '',
  title: '',
  quote: '',
  imageUrl: '',
}

export function PartnerLoveStoryPage() {
  const [items, setItems] = useState<PartnerLoveStoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<PartnerLoveStoryEntry | null>(null)
  const [form, setForm] = useState<PartnerLoveStoryEntryPayload>(EMPTY_FORM)
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setItems(await getPartnerLoveStoryEntries())
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'No se pudieron cargar los momentos',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  function resetForm() {
    setEditing(null)
    setForm(EMPTY_FORM)
  }

  function openCreate() {
    resetForm()
    setModalOpen(true)
  }

  function openEdit(item: PartnerLoveStoryEntry) {
    setEditing(item)
    setForm({
      eventDate: item.eventDate,
      title: item.title ?? '',
      quote: item.quote,
      imageUrl: item.imageUrl,
    })
    setModalOpen(true)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setMessage(null)

    const payload: PartnerLoveStoryEntryPayload = {
      eventDate: form.eventDate,
      title: form.title?.trim() || undefined,
      quote: form.quote.trim(),
      imageUrl: form.imageUrl.trim(),
    }
    if (payload.quote.length < 8) {
      setSaving(false)
      setError('La frase debe tener al menos 8 caracteres.')
      return
    }

    try {
      if (editing) {
        await updatePartnerLoveStoryEntry(editing.id, payload)
        setMessage('Momento actualizado.')
      } else {
        await createPartnerLoveStoryEntry(payload)
        setMessage('Momento agregado.')
      }
      setModalOpen(false)
      resetForm()
      await load()
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'No se pudo guardar el momento',
      )
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: number) {
    setError(null)
    try {
      await deletePartnerLoveStoryEntry(id)
      setMessage('Momento eliminado.')
      await load()
    } catch (removeError) {
      setError(
        removeError instanceof Error ? removeError.message : 'No se pudo eliminar el momento',
      )
    }
  }

  return (
    <section className="space-y-4">
      <UiCard className="border-amber-200/60 bg-amber-50/40 p-4 dark:border-zinc-700 dark:bg-zinc-900/60">
        <p className="text-sm text-zinc-700 dark:text-zinc-200">
          Solo ves <strong>tus</strong> momentos. El contenido de tu pareja permanece oculto hasta
          que el administrador publique la historia en la página principal.
        </p>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          Tip rápido: usa fecha de hoy y una frase corta para crear el primer momento en segundos.
        </p>
      </UiCard>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-3xl">Tus momentos</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Fecha, frase e imagen (URL) de cada recuerdo.
          </p>
        </div>
        <UiButton variant="primary" type="button" onClick={openCreate}>
          Nuevo momento
        </UiButton>
      </div>

      {loading && <p className="text-sm text-zinc-500">Cargando...</p>}
      {message && (
        <p className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
          {error}
        </p>
      )}

      <div className="grid gap-3">
        {items.map((item) => (
          <UiCard key={item.id} className="grid gap-3 p-4 md:grid-cols-[120px_1fr_auto] md:items-start">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title ?? 'Momento'}
                className="h-28 w-full rounded-xl object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div className="flex h-28 items-center justify-center rounded-xl bg-zinc-100 text-xs text-zinc-500 dark:bg-zinc-800">
                Sin imagen
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-300">
                {item.eventDate}
              </p>
              {item.title && <h3 className="font-serif text-xl">{item.title}</h3>}
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{item.quote}</p>
            </div>
            <div className="flex gap-2">
              <UiButton type="button" onClick={() => openEdit(item)}>
                Editar
              </UiButton>
              <UiButton type="button" variant="ghost" onClick={() => setPendingDeleteId(item.id)}>
                Eliminar
              </UiButton>
            </div>
          </UiCard>
        ))}
        {!loading && items.length === 0 && (
          <p className="text-sm text-zinc-500">Aún no agregaste momentos.</p>
        )}
      </div>

      <UiModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          resetForm()
        }}
        title={editing ? 'Editar momento' : 'Nuevo momento'}
        footer={
          <UiButton variant="primary" form="partner-moment-form" type="submit" disabled={saving}>
            {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}
          </UiButton>
        }
      >
        <form id="partner-moment-form" className="grid gap-3" onSubmit={onSubmit}>
          <label className="grid gap-1 text-sm font-medium">
            Fecha
            <UiInput
              type="date"
              value={form.eventDate}
              onChange={(event) => setForm((c) => ({ ...c, eventDate: event.target.value }))}
              required
            />
            <div className="flex gap-2">
              <UiButton
                type="button"
                variant="ghost"
                className="rounded-xl px-2 py-1 text-xs"
                onClick={() =>
                  setForm((c) => ({ ...c, eventDate: new Date().toISOString().slice(0, 10) }))
                }
              >
                Usar fecha de hoy
              </UiButton>
            </div>
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Título (opcional)
            <UiInput
              value={form.title ?? ''}
              onChange={(event) => setForm((c) => ({ ...c, title: event.target.value }))}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Frase
            <UiTextarea
              value={form.quote}
              onChange={(event) => setForm((c) => ({ ...c, quote: event.target.value }))}
              rows={3}
              required
            />
            <div className="flex gap-2">
              <UiButton
                type="button"
                variant="ghost"
                className="rounded-xl px-2 py-1 text-xs"
                onClick={() =>
                  setForm((c) => ({
                    ...c,
                    quote: 'Ese día comenzó nuestra historia para siempre.',
                  }))
                }
              >
                Plantilla rápida
              </UiButton>
            </div>
          </label>
          <label className="grid gap-1 text-sm font-medium">
            URL de imagen
            <UiInput
              type="url"
              value={form.imageUrl}
              onChange={(event) => setForm((c) => ({ ...c, imageUrl: event.target.value }))}
              placeholder="https://..."
              required
            />
          </label>
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="Vista previa"
              className="max-h-40 w-full rounded-xl object-cover"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
                setError('No se pudo cargar vista previa. Verifica la URL de imagen.')
              }}
            />
          )}
        </form>
      </UiModal>
      <UiConfirmDialog
        open={pendingDeleteId !== null}
        title="Eliminar momento"
        message="Este momento se eliminará de forma permanente."
        confirmLabel="Eliminar"
        onClose={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId == null) return
          void remove(pendingDeleteId)
          setPendingDeleteId(null)
        }}
      />
    </section>
  )
}
