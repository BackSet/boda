export type InvitationView = {
  token: string
  guestName: string
  guestEmail: string | null
  maxGuests: number
  attending: boolean | null
  guestCount: number | null
  dietaryRestrictions: string | null
  message: string | null
  eventTitle: string
  eventDate: string
  ceremonyAddress: string
  receptionAddress: string
}

export type RsvpPayload = {
  token: string
  attending: boolean
  guestCount: number
  dietaryRestrictions?: string
  message?: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export async function getInvitationByToken(token: string): Promise<InvitationView> {
  const response = await fetch(`${API_BASE_URL}/api/invitations/${token}`)
  if (!response.ok) {
    throw new Error('No se pudo validar la invitacion')
  }
  return response.json()
}

export async function submitRsvp(payload: RsvpPayload): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/rsvp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'No se pudo enviar la confirmacion')
  }
}
