const PARTNER_TOKEN_KEY = 'boda_partner_token'
const PARTNER_DISPLAY_NAME_KEY = 'boda_partner_display_name'
const PARTNER_EXPIRES_AT_KEY = 'boda_partner_expires_at'

export function setPartnerSession(token: string, displayName: string, expiresAt: number): void {
  localStorage.setItem(PARTNER_TOKEN_KEY, token)
  localStorage.setItem(PARTNER_DISPLAY_NAME_KEY, displayName)
  localStorage.setItem(PARTNER_EXPIRES_AT_KEY, String(expiresAt))
}

export function getPartnerToken(): string | null {
  return localStorage.getItem(PARTNER_TOKEN_KEY)
}

export function getPartnerDisplayName(): string | null {
  return localStorage.getItem(PARTNER_DISPLAY_NAME_KEY)
}

export function clearPartnerSession(): void {
  localStorage.removeItem(PARTNER_TOKEN_KEY)
  localStorage.removeItem(PARTNER_DISPLAY_NAME_KEY)
  localStorage.removeItem(PARTNER_EXPIRES_AT_KEY)
}

export function isPartnerAuthenticated(): boolean {
  const token = getPartnerToken()
  const expiresAt = Number(localStorage.getItem(PARTNER_EXPIRES_AT_KEY))
  if (!token || !Number.isFinite(expiresAt)) return false
  if (Date.now() >= expiresAt) {
    clearPartnerSession()
    return false
  }
  return true
}
