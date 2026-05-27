import { useCallback, useEffect, useState } from 'react'
import {
  createAdminFamilyGroup,
  deleteAdminFamilyGroup,
  getAdminFamilyGroups,
  updateAdminFamilyGroup,
  type AdminFamilyGroup,
  type AdminFamilyGroupUpsertPayload,
} from '../lib/adminApi'

const EMPTY_FORM: AdminFamilyGroupUpsertPayload = {
  displayName: '',
  contactEmail: '',
  members: [{ fullName: '', primaryGuest: true }],
}

export function useAdminFamilyGroups() {
  const [items, setItems] = useState<AdminFamilyGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<AdminFamilyGroup | null>(null)
  const [form, setForm] = useState<AdminFamilyGroupUpsertPayload>(EMPTY_FORM)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setItems(await getAdminFamilyGroups())
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'No se pudieron cargar los grupos familiares',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  function openCreate() {
    setEditing(null)
    setForm({
      displayName: '',
      contactEmail: '',
      members: [{ fullName: '', primaryGuest: true }],
    })
    setModalOpen(true)
  }

  function edit(item: AdminFamilyGroup) {
    setEditing(item)
    setForm({
      displayName: item.displayName,
      contactEmail: item.contactEmail ?? '',
      members: item.members.map((member) => ({
        fullName: member.fullName,
        primaryGuest: member.primaryGuest,
      })),
    })
    setModalOpen(true)
  }

  async function save(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    const payload: AdminFamilyGroupUpsertPayload = {
      displayName: form.displayName.trim(),
      contactEmail: form.contactEmail?.trim() || undefined,
      members: form.members
        .filter((member) => member.fullName.trim())
        .map((member) => ({
          fullName: member.fullName.trim(),
          primaryGuest: member.primaryGuest,
        })),
    }

    if (payload.members.length === 0) {
      setError('Agrega al menos un miembro')
      return
    }

    const primaryCount = payload.members.filter((member) => member.primaryGuest).length
    if (primaryCount !== 1) {
      setError('Debe haber exactamente un miembro principal')
      return
    }

    try {
      if (editing) {
        await updateAdminFamilyGroup(editing.id, payload)
      } else {
        await createAdminFamilyGroup(payload)
      }
      setModalOpen(false)
      await refresh()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo guardar el grupo')
    }
  }

  async function remove(id: number) {
    await deleteAdminFamilyGroup(id)
    await refresh()
  }

  return {
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
    refresh,
    setError,
  }
}
