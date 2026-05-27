import { useCallback, useEffect, useState } from 'react'
import { LoveStoryTimeline } from '../../components/wedding/LoveStoryTimeline'
import { UiBadge, UiButton, UiCard, UiInput, UiTextarea } from '../../components/ui'
import {
  deleteAdminLoveStoryEntry,
  getAdminLoveStoryEntries,
  getAdminLoveStoryPreview,
  getAdminLoveStorySettings,
  updateAdminLoveStorySettings,
  type AdminLoveStoryEntry,
  type AdminLoveStorySettings,
  type PublicLoveStory,
} from '../../lib/adminApi'

export function AdminLoveStoryPage() {
  const [settings, setSettings] = useState<AdminLoveStorySettings | null>(null)
  const [entries, setEntries] = useState<AdminLoveStoryEntry[]>([])
  const [preview, setPreview] = useState<PublicLoveStory | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

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
    if (!window.confirm('¿Eliminar este momento?')) return
    try {
      await deleteAdminLoveStoryEntry(id)
      setMessage('Momento eliminado.')
      await load()
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : 'No se pudo eliminar')
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
                  <UiButton type="button" variant="ghost" onClick={() => void removeEntry(entry.id)}>
                    Eliminar
                  </UiButton>
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
    </section>
  )
}
