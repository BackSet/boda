import type { PublicEvent } from './event'

export type HomeContentSection = {
  id: number
  sectionType: string
  title: string
  subtitle: string | null
  body: string | null
  payloadJson: string | null
  orderIndex: number
}

export type LoveStoryAuthor = 'PARTNER_A' | 'PARTNER_B'

export type PublicLoveStoryEntry = {
  id: number
  author: LoveStoryAuthor
  authorDisplayName: string
  eventDate: string
  title: string | null
  quote: string
  imageUrl: string
  sortOrder: number
}

export type PublicLoveStory = {
  title: string
  subtitle: string | null
  entries: PublicLoveStoryEntry[]
}

export type HomePageContent = {
  event: PublicEvent
  sections: HomeContentSection[]
  loveStory: PublicLoveStory | null
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export async function getHomePageContent(): Promise<HomePageContent> {
  const response = await fetch(`${API_BASE_URL}/api/content/home`)
  if (!response.ok) {
    throw new Error('No se pudo cargar el contenido de la página principal')
  }
  return response.json()
}
