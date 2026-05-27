export type LoveStoryAuthor = 'PARTNER_A' | 'PARTNER_B'

export type LoveStoryEntry = {
  id: number
  author: LoveStoryAuthor
  authorDisplayName: string
  eventDate: string
  title: string | null
  quote: string
  imageUrl: string
  sortOrder: number
}

export type TimelineSingleGroup = {
  type: 'single'
  entry: LoveStoryEntry
}

export type TimelineHeartGroup = {
  type: 'heart'
  date: string
  entriesA: LoveStoryEntry[]
  entriesB: LoveStoryEntry[]
}

export type TimelineGroup = TimelineSingleGroup | TimelineHeartGroup

function normalizeAuthor(entry: LoveStoryEntry): LoveStoryAuthor {
  if (entry.author === 'PARTNER_A' || entry.author === 'PARTNER_B') {
    return entry.author
  }
  return 'PARTNER_A'
}

export function groupLoveStoryEntries(entries: LoveStoryEntry[]): TimelineGroup[] {
  if (entries.length === 0) return []

  const normalized = entries.map((e) => ({ ...e, author: normalizeAuthor(e) }))
  const groups: TimelineGroup[] = []
  const dateOrder: string[] = []

  const byDate = new Map<string, LoveStoryEntry[]>()
  for (const entry of normalized) {
    if (!byDate.has(entry.eventDate)) {
      byDate.set(entry.eventDate, [])
      dateOrder.push(entry.eventDate)
    }
    byDate.get(entry.eventDate)!.push(entry)
  }

  for (const date of dateOrder) {
    const dateEntries = byDate.get(date) ?? []
    const hasA = dateEntries.some((e) => e.author === 'PARTNER_A')
    const hasB = dateEntries.some((e) => e.author === 'PARTNER_B')

    if (hasA && hasB) {
      groups.push({
        type: 'heart',
        date,
        entriesA: dateEntries.filter((e) => e.author === 'PARTNER_A'),
        entriesB: dateEntries.filter((e) => e.author === 'PARTNER_B'),
      })
    } else {
      for (const entry of dateEntries) {
        groups.push({ type: 'single', entry })
      }
    }
  }

  return groups
}
