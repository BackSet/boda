import { useState, type FormEvent } from 'react'
import { RowActionMenu } from '../../components/admin/RowActionMenu'
import { UiBadge, UiButton, UiCard, UiInput, UiModal, UiTextarea } from '../../components/ui'
import { useAdminBankAccounts } from '../../hooks/useAdminBankAccounts'

export function AdminBankAccountsPage() {
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
  } = useAdminBankAccounts()

  const [modalOpen, setModalOpen] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
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
          <p className="eyebrow">Cuentas</p>
          <h2 className="text-3xl">Cuentas bancarias</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Gestioná cuentas visibles en la invitación privada (con token), no en la página principal.
          </p>
        </div>
        <UiButton
          variant="primary"
          onClick={() => {
            resetForm()
            setModalOpen(true)
          }}
        >
          Nueva cuenta
        </UiButton>
      </div>

      <UiCard className="space-y-3">
        <div className="flex items-center justify-between gap-3 border-b border-zinc-200 pb-2 dark:border-zinc-700">
          <h3>Listado</h3>
          <UiBadge tone="rose">{items.length} cuentas</UiBadge>
        </div>
        {loading && <p className="text-sm text-zinc-500 dark:text-zinc-400">Cargando cuentas...</p>}
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
                <th className="px-3 py-2">Banco</th>
                <th className="px-3 py-2">Titular</th>
                <th className="px-3 py-2">Estado</th>
                <th className="px-3 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-zinc-200 dark:border-zinc-700">
                  <td className="px-3 py-2">{item.orderIndex}</td>
                  <td className="px-3 py-2">{item.bankName}</td>
                  <td className="px-3 py-2">{item.accountHolder}</td>
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
                        onClick={() => void remove(item.id)}
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
      </UiCard>

      <UiModal
        open={modalOpen}
        title={editing ? 'Editar cuenta' : 'Nueva cuenta'}
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
            <UiButton variant="primary" form="bank-form" type="submit" disabled={saving}>
              {saving ? 'Guardando...' : editing ? 'Actualizar cuenta' : 'Crear cuenta'}
            </UiButton>
          </>
        }
      >
        <form id="bank-form" className="grid gap-3 md:grid-cols-2" onSubmit={onSubmit}>
          <label className="grid gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Banco
            <UiInput
              value={form.bankName}
              onChange={(event) =>
                setForm((current) => ({ ...current, bankName: event.target.value }))
              }
              required
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Titular
            <UiInput
              value={form.accountHolder}
              onChange={(event) =>
                setForm((current) => ({ ...current, accountHolder: event.target.value }))
              }
              required
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Tipo
            <UiInput
              value={form.accountType}
              onChange={(event) =>
                setForm((current) => ({ ...current, accountType: event.target.value }))
              }
              required
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Número
            <UiInput
              value={form.accountNumber}
              onChange={(event) =>
                setForm((current) => ({ ...current, accountNumber: event.target.value }))
              }
              required
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            CLABE / IBAN
            <UiInput
              value={form.clabeIban ?? ''}
              onChange={(event) =>
                setForm((current) => ({ ...current, clabeIban: event.target.value }))
              }
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Alias
            <UiInput
              value={form.accountAlias ?? ''}
              onChange={(event) =>
                setForm((current) => ({ ...current, accountAlias: event.target.value }))
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
            Notas
            <UiTextarea
              value={form.notes ?? ''}
              onChange={(event) =>
                setForm((current) => ({ ...current, notes: event.target.value }))
              }
            />
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
    </section>
  )
}
