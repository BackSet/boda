import { useEffect, useState } from 'react'
import {
  createAdminBankAccount,
  deleteAdminBankAccount,
  getAdminBankAccounts,
  reorderAdminBankAccounts,
  updateAdminBankAccount,
  type AdminBankAccount,
  type AdminBankAccountUpsertPayload,
} from '../lib/adminApi'

const EMPTY_FORM: AdminBankAccountUpsertPayload = {
  bankName: '',
  accountHolder: '',
  accountType: '',
  accountNumber: '',
  clabeIban: '',
  accountAlias: '',
  notes: '',
  orderIndex: 0,
  enabled: true,
}

export function useAdminBankAccounts() {
  const [items, setItems] = useState<AdminBankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const [editing, setEditing] = useState<AdminBankAccount | null>(null)
  const [form, setForm] = useState<AdminBankAccountUpsertPayload>(EMPTY_FORM)

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      setItems(await getAdminBankAccounts())
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'No se pudo cargar cuentas',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  function edit(item: AdminBankAccount) {
    setEditing(item)
    setForm({
      bankName: item.bankName,
      accountHolder: item.accountHolder,
      accountType: item.accountType,
      accountNumber: item.accountNumber,
      clabeIban: item.clabeIban ?? '',
      accountAlias: item.accountAlias ?? '',
      notes: item.notes ?? '',
      orderIndex: item.orderIndex,
      enabled: item.enabled,
    })
  }

  function resetForm() {
    setEditing(null)
    setForm(EMPTY_FORM)
  }

  async function submit() {
    setSaving(true)
    setError(null)
    setMessage(null)
    try {
      if (editing) {
        await updateAdminBankAccount(editing.id, form)
        setMessage('Cuenta actualizada.')
      } else {
        await createAdminBankAccount(form)
        setMessage('Cuenta creada.')
      }
      await refresh()
      if (!editing) {
        resetForm()
      }
      return true
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'No se pudo guardar la cuenta',
      )
      return false
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: number) {
    setError(null)
    try {
      await deleteAdminBankAccount(id)
      await refresh()
      if (editing?.id === id) {
        resetForm()
      }
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'No se pudo eliminar la cuenta',
      )
    }
  }

  async function reorder(ids: number[]) {
    setError(null)
    try {
      await reorderAdminBankAccounts(ids)
      await refresh()
      setMessage('Orden de cuentas actualizado.')
    } catch (reorderError) {
      setError(
        reorderError instanceof Error
          ? reorderError.message
          : 'No se pudo reordenar cuentas',
      )
    }
  }

  return {
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
  }
}
