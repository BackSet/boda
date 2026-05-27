import { useEffect, useState } from 'react'
import { getAdminRsvpSummary, type AdminRsvpSummary } from '../lib/adminApi'

const EMPTY_SUMMARY: AdminRsvpSummary = {
  guestsAttending: 0,
  guestsDeclined: 0,
  groupsResponded: 0,
  groupsPending: 0,
}

export function useAdminSummary() {
  const [summary, setSummary] = useState<AdminRsvpSummary>(EMPTY_SUMMARY)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      setSummary(await getAdminRsvpSummary())
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'No se pudo cargar el resumen',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  return { summary, loading, error, refresh }
}
