import { useState, type FormEvent } from 'react'
import { RowActionMenu } from '../../components/admin/RowActionMenu'
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
import { useAdminInvitationSections } from '../../hooks/useAdminInvitationSections'

export function AdminInvitationContentPage() {
  const {
    items,
    loading,
    saving,
    error,
    message,
    editing,
    form,
    setForm,
    edit,
    resetForm,
    submit,
    remove,
    reorder,
  } = useAdminInvitationSections()

  const [modalOpen, setModalOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)
  const [payloadError, setPayloadError] = useState<string | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPayloadError(null)
    if (form.payloadJson && form.payloadJson.trim()) {
      try {
        JSON.parse(form.payloadJson)
      } catch {
        setPayloadError('El payload JSON no es válido.')
        return
      }
    }
    const ok = await submit()
    if (ok) {
      setModalOpen(false)
    }
  }

  async function moveItem(id: number, direction: 'up' | 'down') {
    const index = items.findIndex((item) => item.id === id)
    if (index < 0) return
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= items.length) return

    const reordered = [...items]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(targetIndex, 0, moved)
    await reorder(reordered.map((item) => item.id))
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Contenido</p>
          <h2 className="text-3xl">Contenido de invitación personal</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Administrá bloques dinámicos de la home y su orden de aparición.
          </p>
        </div>
        <UiButton
          variant="primary"
          onClick={() => {
            resetForm()
            setModalOpen(true)
          }}
        >
          Nueva sección
        </UiButton>
      </div>

      <UiCard className="space-y-3">
        <div className="flex items-center justify-between gap-3 border-b border-zinc-200 pb-2 dark:border-zinc-700">
          <h3>Listado</h3>
          <UiBadge tone="rose">{items.length} secciones</UiBadge>
        </div>
        {loading && <p className="text-sm text-zinc-500 dark:text-zinc-400">Cargando secciones...</p>}
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
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="bg-zinc-50 text-left text-xs uppercase tracking-[0.08em] text-zinc-500 dark:bg-zinc-800/60 dark:text-zinc-400">
                <th className="px-3 py-2">Orden</th>
                <th className="px-3 py-2">Tipo</th>
                <th className="px-3 py-2">Título</th>
                <th className="px-3 py-2">Estado</th>
                <th className="px-3 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-zinc-200 dark:border-zinc-700">
                  <td className="px-3 py-2">{item.orderIndex}</td>
                  <td className="px-3 py-2">{item.sectionType}</td>
                  <td className="px-3 py-2">{item.title}</td>
                  <td className="px-3 py-2">{item.enabled ? 'Visible' : 'Oculta'}</td>
                  <td className="px-3 py-2">
                    <RowActionMenu>
                      <UiButton
                        className="justify-start rounded-xl px-3"
                        onClick={() => {
                          edit(item)
                          setModalOpen(true)
                        }}
                      >
                        Editar
                      </UiButton>
                      <UiButton
                        className="justify-start rounded-xl px-3"
                        onClick={() => void moveItem(item.id, 'up')}
                      >
                        Subir
                      </UiButton>
                      <UiButton
                        className="justify-start rounded-xl px-3"
                        onClick={() => void moveItem(item.id, 'down')}
                      >
                        Bajar
                      </UiButton>
                      <UiButton
                        variant="danger"
                        className="justify-start rounded-xl px-3"
                        onClick={() => setPendingDeleteId(item.id)}
                      >
                        Eliminar
                      </UiButton>
                    </RowActionMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && items.length === 0 && (
          <p className="px-3 py-5 text-sm text-zinc-500 dark:text-zinc-400">
            No hay secciones todavía. Crea una sección para empezar.
          </p>
        )}
      </UiCard>

      <UiModal
        open={modalOpen}
        title={editing ? 'Editar sección' : 'Nueva sección'}
        onClose={() => {
          setModalOpen(false)
          resetForm()
        }}
        footer={
          <>
            <UiButton
              onClick={() => {
                setModalOpen(false)
                resetForm()
              }}
            >
              Cancelar
            </UiButton>
            <UiButton variant="primary" form="content-form" type="submit" disabled={saving}>
              {saving ? 'Guardando...' : editing ? 'Actualizar sección' : 'Crear sección'}
            </UiButton>
          </>
        }
      >
        <form id="content-form" className="grid gap-3 md:grid-cols-2" onSubmit={onSubmit}>
          <label className="grid gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Tipo
            <UiSelect
              value={form.sectionType}
              onChange={(event) =>
                setForm((current) => ({ ...current, sectionType: event.target.value }))
              }
              required
            >
              <option value="welcome">Welcome</option>
              <option value="timeline">Timeline</option>
              <option value="dress_code">Dress code</option>
              <option value="generic">Generic</option>
            </UiSelect>
          </label>
          <label className="grid gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Título
            <UiInput
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              required
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Subtítulo
            <UiInput
              value={form.subtitle ?? ''}
              onChange={(event) =>
                setForm((current) => ({ ...current, subtitle: event.target.value }))
              }
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Orden
            <UiInput
              type="number"
              min={0}
              value={form.orderIndex}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  orderIndex: Number(event.target.value || 0),
                }))
              }
              required
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-200 md:col-span-2">
            Body
            <UiTextarea
              value={form.body ?? ''}
              onChange={(event) =>
                setForm((current) => ({ ...current, body: event.target.value }))
              }
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-200 md:col-span-2">
            Payload JSON
            <UiTextarea
              value={form.payloadJson ?? ''}
              onChange={(event) =>
                setForm((current) => ({ ...current, payloadJson: event.target.value }))
              }
            />
            {form.sectionType === 'timeline' && (
              <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
                Timeline:{' '}
                <code className="rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800">
                  {`{"items":[{"time":"16:00","description":"Ceremonia"}]}`}
                </code>
              </span>
            )}
            <div className="mt-1 flex gap-2">
              <UiButton
                type="button"
                variant="ghost"
                className="rounded-xl px-2 py-1 text-xs"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    payloadJson:
                      '{"items":[{"time":"16:00","description":"Ceremonia"},{"time":"18:00","description":"Recepción"}]}',
                  }))
                }
              >
                Plantilla timeline
              </UiButton>
              <UiButton
                type="button"
                variant="ghost"
                className="rounded-xl px-2 py-1 text-xs"
                onClick={() => setForm((current) => ({ ...current, payloadJson: '' }))}
              >
                Limpiar payload
              </UiButton>
            </div>
            {payloadError && (
              <span className="text-xs text-rose-600 dark:text-rose-300">{payloadError}</span>
            )}
          </label>
          <label className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 md:col-span-2">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(event) =>
                setForm((current) => ({ ...current, enabled: event.target.checked }))
              }
            />
            Habilitada
          </label>
        </form>
      </UiModal>
      <UiConfirmDialog
        open={pendingDeleteId !== null}
        title="Eliminar sección de invitación"
        message="Esta acción eliminará la sección de forma permanente."
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
