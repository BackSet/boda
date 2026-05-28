export type PublicEvent = {
  coupleDisplayName: string
  eventTitle: string
  eventDate: string
  targetDateIso: string
  ceremonyAddress: string
  receptionAddress: string
  ceremonyMapUrl: string
  receptionMapUrl: string
  dressCode: string | null
}

export type PublicEventTeaser = {
  coupleDisplayName: string
  eventTitle: string
  eventDate: string
  targetDateIso: string
  cityLabel: string | null
}

export type AdminEventUpsert = {
  coupleDisplayName: string
  eventTitle: string
  eventDate: string
  targetDateIso: string
  ceremonyAddress: string
  receptionAddress: string
  ceremonyMapUrl?: string
  receptionMapUrl?: string
  dressCode?: string
  cityLabel?: string
}
