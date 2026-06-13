// Single source of truth for the set of indexable URLs on the site.
// Consumed by both app/sitemap.ts and the IndexNow/Google submission route
// so the sitemap and what we push to search engines can never drift apart.
import { courts } from '@/lib/court-data'
import { neighborhoods } from '@/lib/neighborhood-data'

export const BASE_URL = 'https://www.seattleballmachine.com'

// Indexable static pages. Deliberately excludes noindexed utility pages
// (/guide, /book/cancel, /book/reschedule) and the /q QR redirectors.
const STATIC_PATHS = [
  '',
  '/book',
  '/courts',
  '/tennis-ball-machine-rental',
  '/support',
  '/privacy',
  '/terms',
] as const

export function getIndexableUrls(): string[] {
  const staticUrls = STATIC_PATHS.map((p) => `${BASE_URL}${p}`)
  const courtUrls = courts.map((c) => `${BASE_URL}/courts/${c.slug}`)
  const neighborhoodUrls = neighborhoods.map(
    (n) => `${BASE_URL}/tennis-ball-machine-rental/${n.slug}`,
  )
  return [...staticUrls, ...courtUrls, ...neighborhoodUrls]
}
