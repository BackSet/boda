const PARTNER_TOKEN_KEY = 'boda_partner_token'
const PARTNER_DISPLAY_NAME_KEY = 'boda_partner_display_name'

export function setPartnerSession(token: string, displayName: string): void {
  localStorage.setItem(PARTNER_TOKEN_KEY, token)
  localStorage.setItem(PARTNER_DISPLAY_NAME_KEY, displayName)
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
}

export function isPartnerAuthenticated(): boolean {
  return Boolean(getPartnerToken())
}
