export type PublicEvent = {
  coupleDisplayName: string
  eventTitle: string
  eventDate: string
  targetDateIso: string
  ceremonyAddress: string
  receptionAddress: string
  dressCode: string | null
}

export type AdminEventUpsert = {
  coupleDisplayName: string
  eventTitle: string
  eventDate: string
  targetDateIso: string
  ceremonyAddress: string
  receptionAddress: string
  dressCode?: string
}
