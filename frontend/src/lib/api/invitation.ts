import type { PublicEvent } from './event'
import type { PublicBankAccount } from './bank'

export type InvitationGroup = {
  token: string
  displayName: string
  contactEmail: string | null
  dietaryRestrictions: string | null
  message: string | null
  respondedAt: string | null
}

export type Guest = {
  id: number
  fullName: string
  sortOrder: number
  attending: boolean | null
  primaryGuest: boolean
}

export type InvitationContentSection = {
  id: number
  sectionType: string
  title: string
  subtitle: string | null
  body: string | null
  payloadJson: string | null
  orderIndex: number
}

export type InvitationBundle = {
  group: InvitationGroup
  guests: Guest[]
  event: PublicEvent
  sections: InvitationContentSection[]
  bankAccounts: PublicBankAccount[]
}

export type MemberRsvp = {
  guestId: number
  attending: boolean
}

export type FamilyRsvpPayload = {
  token: string
  members: MemberRsvp[]
  dietaryRestrictions?: string
  message?: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export async function getInvitationBundle(token: string): Promise<InvitationBundle> {
  const response = await fetch(`${API_BASE_URL}/api/invitations/${token}`)
  if (!response.ok) {
    throw new Error('No se pudo validar la invitación')
  }
  return response.json()
}

export async function submitRsvp(payload: FamilyRsvpPayload): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/rsvp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'No se pudo enviar la confirmación')
  }
}
