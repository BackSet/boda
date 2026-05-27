import { useEffect, useState } from 'react'
import {
  createAdminContentSection,
  deleteAdminContentSection,
  getAdminContentSections,
  reorderAdminContentSections,
  updateAdminContentSection,
  type AdminHomeContentSection,
  type AdminHomeContentUpsertPayload,
} from '../lib/adminApi'

const EMPTY_FORM: AdminHomeContentUpsertPayload = {
  sectionType: 'hero',
  title: '',
  subtitle: '',
  body: '',
  payloadJson: '',
  orderIndex: 0,
  enabled: true,
}

export function useAdminContentSections() {
  const [items, setItems] = useState<AdminHomeContentSection[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const [editing, setEditing] = useState<AdminHomeContentSection | null>(null)
  const [form, setForm] = useState<AdminHomeContentUpsertPayload>(EMPTY_FORM)

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      setItems(await getAdminContentSections())
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'No se pudo cargar secciones',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  function edit(item: AdminHomeContentSection) {
    setEditing(item)
    setForm({
      sectionType: item.sectionType,
      title: item.title,
      subtitle: item.subtitle ?? '',
      body: item.body ?? '',
      payloadJson: item.payloadJson ?? '',
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
        await updateAdminContentSection(editing.id, form)
        setMessage('Sección actualizada.')
      } else {
        await createAdminContentSection(form)
        setMessage('Sección creada.')
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
          : 'No se pudo guardar la sección',
      )
      return false
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: number) {
    setError(null)
    try {
      await deleteAdminContentSection(id)
      await refresh()
      if (editing?.id === id) {
        resetForm()
      }
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'No se pudo eliminar la sección',
      )
    }
  }

  async function reorder(ids: number[]) {
    setError(null)
    try {
      await reorderAdminContentSections(ids)
      await refresh()
      setMessage('Orden actualizado.')
    } catch (reorderError) {
      setError(
        reorderError instanceof Error
          ? reorderError.message
          : 'No se pudo reordenar secciones',
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
