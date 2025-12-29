import { MetadataRoute } from 'next'

// Court data for programmatic SEO pages
const courts = [
  { slug: "green-lake-park", name: "Green Lake Park" },
  { slug: "amy-yee-tennis-center", name: "Amy Yee Tennis Center" },
  { slug: "lower-woodland-playfield", name: "Lower Woodland Playfield" },
  { slug: "volunteer-park", name: "Volunteer Park" },
  { slug: "seward-park", name: "Seward Park" },
  { slug: "jefferson-park", name: "Jefferson Park" },
  { slug: "observatory-courts", name: "Observatory Courts" },
  { slug: "alki-playfield", name: "Alki Playfield" },
  { slug: "bitter-lake-playfield", name: "Bitter Lake Playfield" },
  { slug: "beacon-hill-playfield", name: "Beacon Hill Playfield" },
  { slug: "brighton-playfield", name: "Brighton Playfield" },
  { slug: "bryant-playground", name: "Bryant Playground" },
  { slug: "david-rodgers-park", name: "David Rodgers Park" },
  { slug: "dearborn-park", name: "Dearborn Park" },
  { slug: "delridge-playfield", name: "Delridge Playfield" },
  { slug: "discovery-park", name: "Discovery Park" },
  { slug: "froula-playground", name: "Froula Playground" },
  { slug: "garfield-playfield", name: "Garfield Playfield" },
  { slug: "gilman-playfield", name: "Gilman Playfield" },
  { slug: "hiawatha-playfield", name: "Hiawatha Playfield" },
  { slug: "laurelhurst-playfield", name: "Laurelhurst Playfield" },
  { slug: "madison-park", name: "Madison Park" },
  { slug: "magnolia-park", name: "Magnolia Park" },
  { slug: "magnolia-playfield", name: "Magnolia Playfield" },
  { slug: "meadowbrook-playfield", name: "Meadowbrook Playfield" },
  { slug: "miller-playfield", name: "Miller Playfield" },
  { slug: "montlake-playfield", name: "Montlake Playfield" },
  { slug: "mount-baker-park", name: "Mount Baker Park" },
  { slug: "rainier-beach-playfield", name: "Rainier Beach Playfield" },
  { slug: "rainier-playfield", name: "Rainier Playfield" },
  { slug: "riverview-playfield", name: "Riverview Playfield" },
  { slug: "rogers-eastlake-playfield", name: "Rogers Eastlake Playfield" },
  { slug: "sam-smith-park", name: "Sam Smith Park" },
  { slug: "solstice-park", name: "Solstice Park" },
  { slug: "soundview-playfield", name: "Soundview Playfield" },
  { slug: "wallingford-playfield", name: "Wallingford Playfield" },
  { slug: "walt-hundley-playfield", name: "Walt Hundley Playfield" },
  { slug: "madrona-playground", name: "Madrona Playground" },
]

// Neighborhood landing pages
const neighborhoods = [
  "queen-anne",
  "capitol-hill",
  "ballard",
  "fremont",
  "wallingford",
  "green-lake",
  "university-district",
  "magnolia",
  "west-seattle",
  "beacon-hill",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.seattleballmachine.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Court pages (programmatic SEO)
  const courtPages: MetadataRoute.Sitemap = courts.map((court) => ({
    url: `${baseUrl}/courts/${court.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Neighborhood landing pages
  const neighborhoodPages: MetadataRoute.Sitemap = neighborhoods.map((neighborhood) => ({
    url: `${baseUrl}/tennis-ball-machine-rental/${neighborhood}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...courtPages, ...neighborhoodPages]
}
