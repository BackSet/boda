import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { LoveStoryTimeline } from '../../components/wedding/LoveStoryTimeline'
import {
  UiBadge,
  UiButton,
  UiCard,
  UiConfirmDialog,
  UiInput,
  UiModal,
  UiSelect,
  UiTextarea,
} from '../../components/ui'
import {
  createAdminLoveStoryEntry,
  deleteAdminLoveStoryEntry,
  getAdminLoveStoryEntries,
  getAdminLoveStoryPreview,
  getAdminLoveStorySettings,
  updateAdminLoveStoryEntry,
  updateAdminLoveStorySettings,
  type AdminLoveStoryEntry,
  type AdminLoveStoryEntryPayload,
  type AdminLoveStorySettings,
  type PublicLoveStory,
} from '../../lib/adminApi'

const EMPTY_ENTRY: AdminLoveStoryEntryPayload = {
  author: 'PARTNER_A',
  eventDate: '',
  title: '',
  quote: '',
  imageUrl: '',
}

export function AdminLoveStoryPage() {
  const [settings, setSettings] = useState<AdminLoveStorySettings | null>(null)
  const [entries, setEntries] = useState<AdminLoveStoryEntry[]>([])
  const [preview, setPreview] = useState<PublicLoveStory | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [entrySaving, setEntrySaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<AdminLoveStoryEntry | null>(null)
  const [entryForm, setEntryForm] = useState<AdminLoveStoryEntryPayload>(EMPTY_ENTRY)
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [settingsData, entriesData, previewData] = await Promise.all([
        getAdminLoveStorySettings(),
        getAdminLoveStoryEntries(),
        getAdminLoveStoryPreview(),
      ])
      setSettings(settingsData)
      setEntries(entriesData)
      setPreview(previewData)
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'No se pudo cargar la historia de amor',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function saveSettings() {
    if (!settings) return
    setSaving(true)
    setError(null)
    setMessage(null)
    try {
      const updated = await updateAdminLoveStorySettings({
        enabled: settings.enabled,
        published: settings.published,
        sectionTitle: settings.sectionTitle,
        sectionSubtitle: settings.sectionSubtitle ?? undefined,
      })
      setSettings(updated)
      setMessage('Configuración guardada.')
      const previewData = await getAdminLoveStoryPreview()
      setPreview(previewData)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'No se pudo guardar')
    } finally {
      setSaving(false)
    }
  }

  async function removeEntry(id: number) {
    try {
      await deleteAdminLoveStoryEntry(id)
      setMessage('Momento eliminado.')
      await load()
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : 'No se pudo eliminar')
    }
  }

  function openCreate() {
    setEditing(null)
    setEntryForm(EMPTY_ENTRY)
    setModalOpen(true)
  }

  function openEdit(entry: AdminLoveStoryEntry) {
    setEditing(entry)
    setEntryForm({
      author: entry.author,
      eventDate: entry.eventDate,
      title: entry.title ?? '',
      quote: entry.quote,
      imageUrl: entry.imageUrl,
    })
    setModalOpen(true)
  }

  async function submitEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setEntrySaving(true)
    setError(null)
    try {
      if (editing) {
        await updateAdminLoveStoryEntry(editing.id, entryForm)
        setMessage('Momento actualizado.')
      } else {
        await createAdminLoveStoryEntry(entryForm)
        setMessage('Momento creado.')
      }
      setModalOpen(false)
      setEntryForm(EMPTY_ENTRY)
      await load()
    } catch (entryError) {
      setError(entryError instanceof Error ? entryError.message : 'No se pudo guardar el momento')
    } finally {
      setEntrySaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-zinc-500">Cargando historia de amor...</p>
  }

  if (!settings) {
    return <p className="text-sm text-rose-600">{error ?? 'Sin configuración'}</p>
  }

  return (
    <section className="space-y-4">
      <div>
        <p className="eyebrow">Historia de amor</p>
        <h2 className="text-3xl">Gestión y publicación</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Cada pareja edita en{' '}
          <a href="/pareja/login" className="font-medium text-rose-700 underline dark:text-rose-300">
            /pareja/login
          </a>
          . Aquí activás la sección y publicás en el home.
        </p>
        <div className="mt-3 flex gap-2">
          <UiButton variant="primary" type="button" onClick={openCreate}>
            Nuevo momento (admin)
          </UiButton>
          <UiButton
            type="button"
            onClick={() =>
              setEntryForm((c) => ({
                ...c,
                eventDate: new Date().toISOString().slice(0, 10),
              }))
            }
          >
            Fecha de hoy
          </UiButton>
        </div>
      </div>

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

      <UiCard className="grid gap-4 p-4">
        <div className="flex flex-wrap gap-2">
          <UiBadge tone={settings.enabled ? 'rose' : 'default'}>
            {settings.enabled ? 'Visible en home' : 'Oculta en home'}
          </UiBadge>
          <UiBadge tone={settings.published ? 'rose' : 'default'}>
            {settings.published ? 'Publicada' : 'Borrador'}
          </UiBadge>
          <UiBadge tone="default">
            {settings.partnerADisplayName}: {settings.partnerAEntryCount} momentos
          </UiBadge>
          <UiBadge tone="default">
            {settings.partnerBDisplayName}: {settings.partnerBEntryCount} momentos
          </UiBadge>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => setSettings((s) => (s ? { ...s, enabled: e.target.checked } : s))}
          />
          Visible en página principal (cuando esté publicada)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.published}
            onChange={(e) => setSettings((s) => (s ? { ...s, published: e.target.checked } : s))}
          />
          Publicada (revelar en el sitio)
        </label>

        <label className="grid gap-1 text-sm font-medium">
          Título de sección
          <UiInput
            value={settings.sectionTitle}
            onChange={(e) =>
              setSettings((s) => (s ? { ...s, sectionTitle: e.target.value } : s))
            }
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Subtítulo
          <UiTextarea
            value={settings.sectionSubtitle ?? ''}
            onChange={(e) =>
              setSettings((s) => (s ? { ...s, sectionSubtitle: e.target.value } : s))
            }
            rows={2}
          />
        </label>

        <UiButton variant="primary" type="button" disabled={saving} onClick={() => void saveSettings()}>
          {saving ? 'Guardando...' : 'Guardar configuración'}
        </UiButton>
      </UiCard>

      <UiCard className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
            <tr>
              <th className="px-3 py-2">Autor</th>
              <th className="px-3 py-2">Fecha</th>
              <th className="px-3 py-2">Frase</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="px-3 py-2">{entry.authorDisplayName}</td>
                <td className="px-3 py-2">{entry.eventDate}</td>
                <td className="max-w-xs truncate px-3 py-2">{entry.quote}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <UiButton type="button" variant="ghost" onClick={() => openEdit(entry)}>
                      Editar
                    </UiButton>
                    <UiButton
                      type="button"
                      variant="ghost"
                      onClick={() => setPendingDeleteId(entry.id)}
                    >
                      Eliminar
                    </UiButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {entries.length === 0 && (
          <p className="p-4 text-sm text-zinc-500">Sin momentos cargados aún.</p>
        )}
      </UiCard>

      {preview && preview.entries.length > 0 && (
        <div className="rounded-3xl border border-dashed border-zinc-300 p-2 dark:border-zinc-700">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Vista previa (admin)
          </p>
          <LoveStoryTimeline
            title={preview.title}
            subtitle={preview.subtitle}
            entries={preview.entries}
          />
        </div>
      )}
      <UiModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar momento' : 'Nuevo momento (admin)'}
        footer={
          <UiButton
            variant="primary"
            form="admin-love-entry-form"
            type="submit"
            disabled={entrySaving}
          >
            {entrySaving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}
          </UiButton>
        }
      >
        <form id="admin-love-entry-form" className="grid gap-3" onSubmit={submitEntry}>
          <label className="grid gap-1 text-sm font-medium">
            Autor
            <UiSelect
              value={entryForm.author}
              onChange={(event) =>
                setEntryForm((c) => ({
                  ...c,
                  author: event.target.value as 'PARTNER_A' | 'PARTNER_B',
                }))
              }
            >
              <option value="PARTNER_A">{settings.partnerADisplayName}</option>
              <option value="PARTNER_B">{settings.partnerBDisplayName}</option>
            </UiSelect>
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Fecha
            <UiInput
              type="date"
              value={entryForm.eventDate}
              onChange={(event) =>
                setEntryForm((c) => ({ ...c, eventDate: event.target.value }))
              }
              required
            />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Título (opcional)
            <UiInput
              value={entryForm.title ?? ''}
              onChange={(event) => setEntryForm((c) => ({ ...c, title: event.target.value }))}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Frase
            <UiTextarea
              rows={3}
              value={entryForm.quote}
              onChange={(event) => setEntryForm((c) => ({ ...c, quote: event.target.value }))}
              required
            />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            URL de imagen
            <UiInput
              type="url"
              value={entryForm.imageUrl}
              onChange={(event) =>
                setEntryForm((c) => ({ ...c, imageUrl: event.target.value }))
              }
              required
            />
          </label>
        </form>
      </UiModal>
      <UiConfirmDialog
        open={pendingDeleteId !== null}
        title="Eliminar momento"
        message="Esta acción eliminará el momento seleccionado de forma permanente."
        confirmLabel="Eliminar"
        onClose={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId == null) return
          void removeEntry(pendingDeleteId)
          setPendingDeleteId(null)
        }}
      />
    </section>
  )
}
