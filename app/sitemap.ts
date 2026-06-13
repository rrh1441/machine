import { MetadataRoute } from 'next'
import { courts } from '@/lib/court-data'
import { neighborhoods } from '@/lib/neighborhood-data'

// Bump when static page content meaningfully changes. A per-build `new Date()`
// tells Google every page changed on every deploy, which erodes trust in the
// sitemap's lastmod signal. Court/neighborhood pages use a more recent date
// because they now refresh live court data (busyness, reviews) daily.
const SITE_UPDATED = new Date('2026-06-12')
const DATA_UPDATED = new Date('2026-06-13')

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.seattleballmachine.com'

  // Static pages. Excluded on purpose:
  //   /guide, /book/cancel, /book/reschedule — noindexed utility pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: SITE_UPDATED, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/book`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/courts`, lastModified: DATA_UPDATED, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/tennis-ball-machine-rental`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/support`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: SITE_UPDATED, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: SITE_UPDATED, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Court pages — imported from the canonical court list so the sitemap can
  // never drift from the pages that actually exist.
  const courtPages: MetadataRoute.Sitemap = courts.map((court) => ({
    url: `${baseUrl}/courts/${court.slug}`,
    lastModified: DATA_UPDATED,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Neighborhood landing pages — likewise imported from the canonical list.
  const neighborhoodPages: MetadataRoute.Sitemap = neighborhoods.map((n) => ({
    url: `${baseUrl}/tennis-ball-machine-rental/${n.slug}`,
    lastModified: SITE_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...courtPages, ...neighborhoodPages]
}
