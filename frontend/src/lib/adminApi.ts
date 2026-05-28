import { getAdminToken } from './adminAuth'
import { clearAdminToken } from './adminAuth'
import type { AdminEventUpsert, PublicEvent } from './api/event'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export type AdminLoginResponse = {
  token: string
  expiresAtEpochMs: number
}

export type AdminFamilyMember = {
  id: number
  fullName: string
  sortOrder: number
  attending: boolean | null
  primaryGuest: boolean
}

export type AdminFamilyGroup = {
  id: number
  token: string
  invitationUrl: string
  displayName: string
  contactEmail: string | null
  dietaryRestrictions: string | null
  message: string | null
  respondedAt: string | null
  members: AdminFamilyMember[]
}

export type AdminFamilyMemberPayload = {
  fullName: string
  primaryGuest: boolean
}

export type AdminFamilyGroupUpsertPayload = {
  displayName: string
  contactEmail?: string
  members: AdminFamilyMemberPayload[]
}

export type AdminRsvpSummary = {
  guestsAttending: number
  guestsDeclined: number
  groupsResponded: number
  groupsPending: number
}

export type AdminHomeContentSection = {
  id: number
  sectionType: string
  title: string
  subtitle: string | null
  body: string | null
  payloadJson: string | null
  orderIndex: number
  enabled: boolean
}

export type AdminHomeContentUpsertPayload = {
  sectionType: string
  title: string
  subtitle?: string
  body?: string
  payloadJson?: string
  orderIndex: number
  enabled: boolean
}

export type AdminBankAccount = {
  id: number
  bankName: string
  accountHolder: string
  accountType: string
  accountNumber: string
  clabeIban: string | null
  accountAlias: string | null
  notes: string | null
  orderIndex: number
  enabled: boolean
}

export type AdminBankAccountUpsertPayload = {
  bankName: string
  accountHolder: string
  accountType: string
  accountNumber: string
  clabeIban?: string
  accountAlias?: string
  notes?: string
  orderIndex: number
  enabled: boolean
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

  if (response.status === 401) {
    clearAdminToken()
    throw new Error('Tu sesión de admin expiró. Inicia sesión nuevamente.')
  }

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Error en operación admin')
  }
  return response
}

export async function getAdminEvent(): Promise<AdminEventUpsert> {
  const response = await adminFetch('/api/admin/event')
  return response.json()
}

export async function updateAdminEvent(payload: AdminEventUpsert): Promise<PublicEvent> {
  const response = await adminFetch('/api/admin/event', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return response.json()
}

export async function getAdminFamilyGroups(): Promise<AdminFamilyGroup[]> {
  const response = await adminFetch('/api/admin/family-groups')
  return response.json()
}

export async function createAdminFamilyGroup(
  payload: AdminFamilyGroupUpsertPayload,
): Promise<AdminFamilyGroup> {
  const response = await adminFetch('/api/admin/family-groups', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return response.json()
}

export async function updateAdminFamilyGroup(
  id: number,
  payload: AdminFamilyGroupUpsertPayload,
): Promise<AdminFamilyGroup> {
  const response = await adminFetch(`/api/admin/family-groups/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return response.json()
}

export async function deleteAdminFamilyGroup(id: number): Promise<void> {
  await adminFetch(`/api/admin/family-groups/${id}`, { method: 'DELETE' })
}

export async function getAdminRsvpSummary(): Promise<AdminRsvpSummary> {
  const response = await adminFetch('/api/admin/rsvp/summary')
  return response.json()
}

export async function getAdminContentSections(): Promise<AdminHomeContentSection[]> {
  const response = await adminFetch('/api/admin/content-sections')
  return response.json()
}

export async function createAdminContentSection(
  payload: AdminHomeContentUpsertPayload,
): Promise<AdminHomeContentSection> {
  const response = await adminFetch('/api/admin/content-sections', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return response.json()
}

export async function updateAdminContentSection(
  id: number,
  payload: AdminHomeContentUpsertPayload,
): Promise<AdminHomeContentSection> {
  const response = await adminFetch(`/api/admin/content-sections/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return response.json()
}

export async function deleteAdminContentSection(id: number): Promise<void> {
  await adminFetch(`/api/admin/content-sections/${id}`, { method: 'DELETE' })
}

export async function reorderAdminContentSections(orderedIds: number[]): Promise<void> {
  await adminFetch('/api/admin/content-sections/reorder', {
    method: 'PATCH',
    body: JSON.stringify({ orderedIds }),
  })
}

export async function getAdminInvitationSections(): Promise<AdminHomeContentSection[]> {
  const response = await adminFetch('/api/admin/invitation-sections')
  return response.json()
}

export async function createAdminInvitationSection(
  payload: AdminHomeContentUpsertPayload,
): Promise<AdminHomeContentSection> {
  const response = await adminFetch('/api/admin/invitation-sections', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return response.json()
}

export async function updateAdminInvitationSection(
  id: number,
  payload: AdminHomeContentUpsertPayload,
): Promise<AdminHomeContentSection> {
  const response = await adminFetch(`/api/admin/invitation-sections/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return response.json()
}

export async function deleteAdminInvitationSection(id: number): Promise<void> {
  await adminFetch(`/api/admin/invitation-sections/${id}`, { method: 'DELETE' })
}

export async function reorderAdminInvitationSections(orderedIds: number[]): Promise<void> {
  await adminFetch('/api/admin/invitation-sections/reorder', {
    method: 'PATCH',
    body: JSON.stringify({ orderedIds }),
  })
}

export async function getAdminBankAccounts(): Promise<AdminBankAccount[]> {
  const response = await adminFetch('/api/admin/bank-accounts')
  return response.json()
}

export async function createAdminBankAccount(
  payload: AdminBankAccountUpsertPayload,
): Promise<AdminBankAccount> {
  const response = await adminFetch('/api/admin/bank-accounts', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return response.json()
}

export async function updateAdminBankAccount(
  id: number,
  payload: AdminBankAccountUpsertPayload,
): Promise<AdminBankAccount> {
  const response = await adminFetch(`/api/admin/bank-accounts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return response.json()
}

export async function deleteAdminBankAccount(id: number): Promise<void> {
  await adminFetch(`/api/admin/bank-accounts/${id}`, { method: 'DELETE' })
}

export async function reorderAdminBankAccounts(orderedIds: number[]): Promise<void> {
  await adminFetch('/api/admin/bank-accounts/reorder', {
    method: 'PATCH',
    body: JSON.stringify({ orderedIds }),
  })
}

export type AdminLoveStorySettings = {
  enabled: boolean
  published: boolean
  sectionTitle: string
  sectionSubtitle: string | null
  partnerADisplayName: string
  partnerBDisplayName: string
  partnerAEntryCount: number
  partnerBEntryCount: number
}

export type AdminLoveStorySettingsPayload = {
  enabled: boolean
  published: boolean
  sectionTitle: string
  sectionSubtitle?: string
}

export type AdminLoveStoryEntry = {
  id: number
  author: 'PARTNER_A' | 'PARTNER_B'
  authorDisplayName: string
  eventDate: string
  title: string | null
  quote: string
  imageUrl: string
  sortOrder: number
}

export type AdminLoveStoryEntryPayload = {
  author: 'PARTNER_A' | 'PARTNER_B'
  eventDate: string
  title?: string
  quote: string
  imageUrl: string
}

export type PublicLoveStory = {
  title: string
  subtitle: string | null
  entries: {
    id: number
    author: 'PARTNER_A' | 'PARTNER_B'
    authorDisplayName: string
    eventDate: string
    title: string | null
    quote: string
    imageUrl: string
    sortOrder: number
  }[]
}

export async function getAdminLoveStorySettings(): Promise<AdminLoveStorySettings> {
  const response = await adminFetch('/api/admin/love-story/settings')
  return response.json()
}

export async function updateAdminLoveStorySettings(
  payload: AdminLoveStorySettingsPayload,
): Promise<AdminLoveStorySettings> {
  const response = await adminFetch('/api/admin/love-story/settings', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return response.json()
}

export async function getAdminLoveStoryEntries(): Promise<AdminLoveStoryEntry[]> {
  const response = await adminFetch('/api/admin/love-story/entries')
  return response.json()
}

export async function createAdminLoveStoryEntry(
  payload: AdminLoveStoryEntryPayload,
): Promise<AdminLoveStoryEntry> {
  const response = await adminFetch('/api/admin/love-story/entries', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return response.json()
}

export async function updateAdminLoveStoryEntry(
  id: number,
  payload: AdminLoveStoryEntryPayload,
): Promise<AdminLoveStoryEntry> {
  const response = await adminFetch(`/api/admin/love-story/entries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return response.json()
}

export async function getAdminLoveStoryPreview(): Promise<PublicLoveStory> {
  const response = await adminFetch('/api/admin/love-story/preview')
  return response.json()
}

export async function deleteAdminLoveStoryEntry(id: number): Promise<void> {
  await adminFetch(`/api/admin/love-story/entries/${id}`, { method: 'DELETE' })
}
