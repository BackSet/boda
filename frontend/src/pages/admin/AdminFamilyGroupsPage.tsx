import { useState, type FormEvent } from 'react'
import { RowActionMenu } from '../../components/admin/RowActionMenu'
import { UiBadge, UiButton, UiCard, UiConfirmDialog, UiInput, UiModal } from '../../components/ui'
import { useAdminFamilyGroups } from '../../hooks/useAdminFamilyGroups'

export function AdminFamilyGroupsPage() {
  const {
    items,
    loading,
    error,
    modalOpen,
    setModalOpen,
    editing,
    form,
    setForm,
    openCreate,
    edit,
    save,
    remove,
  } = useAdminFamilyGroups()

  const [copyMessage, setCopyMessage] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<{ id: number; name: string } | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    await save(event)
  }

  function addMember() {
    setForm((current) => ({
      ...current,
      members: [...current.members, { fullName: '', primaryGuest: false }],
    }))
  }

  function removeMember(index: number) {
    setForm((current) => ({
      ...current,
      members: current.members.filter((_, memberIndex) => memberIndex !== index),
    }))
  }

  function updateMember(
    index: number,
    patch: Partial<{ fullName: string; primaryGuest: boolean }>,
  ) {
    setForm((current) => ({
      ...current,
      members: current.members.map((member, memberIndex) =>
        memberIndex === index ? { ...member, ...patch } : member,
      ),
    }))
  }

  function setPrimary(index: number) {
    setForm((current) => ({
      ...current,
      members: current.members.map((member, memberIndex) => ({
        ...member,
        primaryGuest: memberIndex === index,
      })),
    }))
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url)
      setCopyMessage('Enlace copiado')
      window.setTimeout(() => setCopyMessage(null), 2000)
    } catch {
      setCopyMessage('No se pudo copiar')
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Familias</p>
          <h2 className="text-3xl">Grupos familiares</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Un enlace por familia. Cada miembro confirma con checkbox en la invitación.
          </p>
        </div>
        <UiButton variant="primary" onClick={openCreate}>
          Nuevo grupo
        </UiButton>
      </div>

      {copyMessage && (
        <p className="text-sm text-emerald-600 dark:text-emerald-300">{copyMessage}</p>
      )}

      <UiCard className="space-y-3">
        {loading && <p className="text-sm text-zinc-500">Cargando grupos...</p>}
        {error && (
          <p className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
            {error}
          </p>
        )}

        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full min-w-[800px] border-collapse text-sm">
            <thead>
              <tr className="bg-zinc-50 text-left text-xs uppercase tracking-[0.08em] text-zinc-500 dark:bg-zinc-800/60">
                <th className="px-3 py-2">Familia</th>
                <th className="px-3 py-2">Miembros</th>
                <th className="px-3 py-2">RSVP</th>
                <th className="px-3 py-2">Enlace</th>
                <th className="px-3 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((group) => (
                <tr key={group.id} className="border-t border-zinc-200 dark:border-zinc-700">
                  <td className="px-3 py-2 font-medium">{group.displayName}</td>
                  <td className="px-3 py-2">{group.members.length}</td>
                  <td className="px-3 py-2">
                    {group.respondedAt ? 'Respondido' : 'Pendiente'}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      className="text-rose-700 underline dark:text-rose-300"
                      onClick={() => void copyUrl(group.invitationUrl)}
                    >
                      Copiar enlace
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <RowActionMenu>
                      <button
                        type="button"
                        className="block w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        onClick={() => {
                          edit(group)
                          setModalOpen(true)
                        }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="block w-full px-3 py-2 text-left text-sm text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/40"
                        onClick={() => setPendingDelete({ id: group.id, name: group.displayName })}
                      >
                        Eliminar
                      </button>
                    </RowActionMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && items.length === 0 && (
          <p className="px-3 py-5 text-sm text-zinc-500 dark:text-zinc-400">
            No hay grupos todavía. Crea un grupo familiar para generar su enlace.
          </p>
        )}
        <UiBadge tone="rose">{items.length} grupos</UiBadge>
      </UiCard>

      <UiModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar grupo familiar' : 'Nuevo grupo familiar'}
        footer={
          <>
            <UiButton type="button" onClick={() => setModalOpen(false)}>
              Cancelar
            </UiButton>
            <UiButton variant="primary" type="submit" form="family-group-form">
              Guardar
            </UiButton>
          </>
        }
      >
        <form id="family-group-form" className="grid gap-3" onSubmit={onSubmit}>
          <label className="ui-field-label">
            Nombre del grupo
            <UiInput
              value={form.displayName}
              onChange={(e) => setForm((c) => ({ ...c, displayName: e.target.value }))}
              required
            />
          </label>
          <label className="ui-field-label">
            Email de contacto (opcional)
            <UiInput
              type="email"
              value={form.contactEmail ?? ''}
              onChange={(e) => setForm((c) => ({ ...c, contactEmail: e.target.value }))}
            />
          </label>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Miembros</span>
              <UiButton type="button" onClick={addMember}>
                Añadir miembro
              </UiButton>
            </div>
            {form.members.map((member, index) => (
              <div
                key={`member-${index}`}
                className="grid gap-2 rounded-xl border border-zinc-200 p-3 dark:border-zinc-700"
              >
                <UiInput
                  value={member.fullName}
                  placeholder="Nombre completo"
                  onChange={(e) => updateMember(index, { fullName: e.target.value })}
                  required
                />
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="primary-guest"
                    checked={member.primaryGuest}
                    onChange={() => setPrimary(index)}
                  />
                  Miembro principal (saludo en el sobre)
                </label>
                {form.members.length > 1 && (
                  <UiButton type="button" variant="ghost" onClick={() => removeMember(index)}>
                    Quitar
                  </UiButton>
                )}
              </div>
            ))}
          </div>
        </form>
      </UiModal>
      <UiConfirmDialog
        open={pendingDelete !== null}
        title="Eliminar grupo familiar"
        message={
          pendingDelete
            ? `Se eliminará "${pendingDelete.name}" y sus miembros. Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar grupo"
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return
          void remove(pendingDelete.id)
          setPendingDelete(null)
        }}
      />
    </section>
  )
}
