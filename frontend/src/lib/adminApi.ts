import { getAdminToken } from './adminAuth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export type AdminLoginResponse = {
  token: string
  expiresAtEpochMs: number
}

export type AdminGuest = {
  id: number
  token: string
  invitationUrl: string
  guestName: string
  guestEmail: string | null
  maxGuests: number
  eventTitle: string
  eventDate: string
  ceremonyAddress: string
  receptionAddress: string
  attending: boolean | null
  guestCount: number | null
  dietaryRestrictions: string | null
  message: string | null
  respondedAt: string | null
}

export type AdminGuestUpsertPayload = {
  guestName: string
  guestEmail?: string
  maxGuests: number
  eventTitle: string
  eventDate: string
  ceremonyAddress: string
  receptionAddress: string
}

export type AdminRsvpSummary = {
  confirmed: number
  declined: number
  pending: number
  confirmedGuests: number
}

export async function adminLogin(
  username: string,
  password: string,
): Promise<AdminLoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!response.ok) {
    throw new Error('Usuario o contraseña inválidos')
  }
  return response.json()
}

async function adminFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = getAdminToken()
  if (!token) {
    throw new Error('Sesión admin no disponible')
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
    throw new Error(errorText || 'Error en operación admin')
  }
  return response
}

export async function getAdminGuests(): Promise<AdminGuest[]> {
  const response = await adminFetch('/api/admin/guests')
  return response.json()
}

export async function createAdminGuest(
  payload: AdminGuestUpsertPayload,
): Promise<AdminGuest> {
  const response = await adminFetch('/api/admin/guests', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return response.json()
}

export async function updateAdminGuest(
  id: number,
  payload: AdminGuestUpsertPayload,
): Promise<AdminGuest> {
  const response = await adminFetch(`/api/admin/guests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return response.json()
}

export async function deleteAdminGuest(id: number): Promise<void> {
  await adminFetch(`/api/admin/guests/${id}`, { method: 'DELETE' })
}

export async function getAdminRsvpSummary(): Promise<AdminRsvpSummary> {
  const response = await adminFetch('/api/admin/rsvp/summary')
  return response.json()
}
