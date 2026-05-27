import { getPartnerToken } from './partnerAuth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export type PartnerLoginResponse = {
  token: string
  expiresAt: number
  author: 'PARTNER_A' | 'PARTNER_B'
  displayName: string
}

export type PartnerLoveStoryEntry = {
  id: number
  eventDate: string
  title: string | null
  quote: string
  imageUrl: string
  sortOrder: number
}

export type PartnerLoveStoryEntryPayload = {
  eventDate: string
  title?: string
  quote: string
  imageUrl: string
}

export async function partnerLogin(
  username: string,
  password: string,
): Promise<PartnerLoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/partner/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!response.ok) {
    throw new Error('Usuario o contraseña inválidos')
  }
  return response.json()
}

async function partnerFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = getPartnerToken()
  if (!token) {
    throw new Error('Sesión de pareja no disponible')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Error en operación de pareja')
  }
  return response
}

export async function getPartnerLoveStoryEntries(): Promise<PartnerLoveStoryEntry[]> {
  const response = await partnerFetch('/api/partner/love-story/entries')
  return response.json()
}

export async function createPartnerLoveStoryEntry(
  payload: PartnerLoveStoryEntryPayload,
): Promise<PartnerLoveStoryEntry> {
  const response = await partnerFetch('/api/partner/love-story/entries', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return response.json()
}

export async function updatePartnerLoveStoryEntry(
  id: number,
  payload: PartnerLoveStoryEntryPayload,
): Promise<PartnerLoveStoryEntry> {
  const response = await partnerFetch(`/api/partner/love-story/entries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return response.json()
}

export async function deletePartnerLoveStoryEntry(id: number): Promise<void> {
  await partnerFetch(`/api/partner/love-story/entries/${id}`, { method: 'DELETE' })
}
