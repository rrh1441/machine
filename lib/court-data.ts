// Shared court data for programmatic SEO pages
export interface CourtInfo {
  id: string
  slug: string
  name: string
  address: string
  driveTime: number
  neighborhood: string
  amenities: string[]
  description: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export const courts: CourtInfo[] = [
  {
    id: "glp7201",
    slug: "green-lake-park",
    name: "Green Lake Park",
    address: "7201 E Green Lake DR N Seattle, WA 98115",
    driveTime: 13,
    neighborhood: "Green Lake",
    amenities: ["Public courts", "Free parking", "Restrooms", "Scenic views"],
    description: "Beautiful lakeside tennis courts at Green Lake Park, one of Seattle's most popular outdoor recreation destinations. Perfect for combining tennis practice with a walk around the lake."
  },
  {
    id: "aytc2000",
    slug: "amy-yee-tennis-center",
    name: "Amy Yee Tennis Center",
    address: "2000 Martin Luther King Jr WAY S Seattle, WA 98144",
    driveTime: 17,
    neighborhood: "Central District",
    amenities: ["Indoor courts", "Pro shop", "Lessons available", "Covered parking"],
    description: "Seattle's premier public indoor tennis facility with 10 indoor courts. Great option for year-round practice regardless of weather."
  },
  {
    id: "lw5773",
    slug: "lower-woodland-playfield",
    name: "Lower Woodland Playfield",
    address: "5773 West Green Lake Way N Seattle, WA 98103",
    driveTime: 9,
    neighborhood: "Wallingford",
    amenities: ["Multiple courts", "Free parking", "Well maintained"],
    description: "Popular tennis courts near Green Lake with multiple courts available. Close proximity to Queen Anne makes it convenient for ball machine practice."
  },
  {
    id: "vp1247",
    slug: "volunteer-park",
    name: "Volunteer Park",
    address: "1247 15th AVE E Seattle, WA 98112",
    driveTime: 17,
    neighborhood: "Capitol Hill",
    amenities: ["Historic setting", "Water tower views", "Conservatory nearby"],
    description: "Historic tennis courts in one of Seattle's most beautiful parks on Capitol Hill. Play tennis with views of the iconic water tower."
  },
  {
    id: "sp5898",
    slug: "seward-park",
    name: "Seward Park",
    address: "5898 Lake Washington BLVD S Seattle, WA 98118",
    driveTime: 26,
    neighborhood: "Seward Park",
    amenities: ["Lakefront location", "Old growth forest", "Beach access"],
    description: "Tennis courts in a stunning natural setting surrounded by old-growth forest and Lake Washington views."
  },
  {
    id: "jp3901",
    slug: "jefferson-park",
    name: "Jefferson Park",
    address: "3901 Beacon AVE S Seattle, WA 98108",
    driveTime: 16,
    neighborhood: "Beacon Hill",
    amenities: ["Multiple courts", "Golf course nearby", "City views"],
    description: "Well-maintained courts at Jefferson Park with spectacular views of downtown Seattle and the Olympic Mountains."
  },
  {
    id: "oc1405",
    slug: "observatory-courts",
    name: "Observatory Courts",
    address: "1405 Warren AVE N Seattle, WA 98109",
    driveTime: 5,
    neighborhood: "Queen Anne",
    amenities: ["Closest to pickup", "Multiple courts", "Easy access"],
    description: "The closest tennis courts to our pickup location! Just 5 minutes away, making them perfect for maximizing your practice time."
  },
  {
    id: "ap5817",
    slug: "alki-playfield",
    name: "Alki Playfield",
    address: "5817 SW Lander ST Seattle, WA 98136",
    driveTime: 18,
    neighborhood: "West Seattle",
    amenities: ["Beach nearby", "Ocean views", "Family friendly"],
    description: "Play tennis near the beach at Alki! Combine your ball machine session with a visit to Seattle's favorite beach neighborhood."
  },
  {
    id: "blp13035",
    slug: "bitter-lake-playfield",
    name: "Bitter Lake Playfield",
    address: "13035 Linden AVE N Seattle, WA 98133",
    driveTime: 19,
    neighborhood: "Bitter Lake",
    amenities: ["Community park", "Playground nearby", "Free parking"],
    description: "Community tennis courts in the Bitter Lake neighborhood. A great option for north Seattle residents."
  },
  {
    id: "bhp1902",
    slug: "beacon-hill-playfield",
    name: "Beacon Hill Playfield",
    address: "1902 13th AVE S Seattle, WA 98144",
    driveTime: 16,
    neighborhood: "Beacon Hill",
    amenities: ["Community courts", "Playground", "Sports fields"],
    description: "Neighborhood tennis courts on Beacon Hill with a community feel. Great for local players looking for convenient practice."
  },
  {
    id: "bp6000",
    slug: "brighton-playfield",
    name: "Brighton Playfield",
    address: "6000 39th AVE S Seattle, WA 98136",
    driveTime: 23,
    neighborhood: "Rainier Beach",
    amenities: ["Public courts", "Community center nearby"],
    description: "Public tennis courts in the Brighton neighborhood of South Seattle."
  },
  {
    id: "bry4103",
    slug: "bryant-playground",
    name: "Bryant Playground",
    address: "4103 NE 65th ST Seattle, WA 98115",
    driveTime: 19,
    neighborhood: "Bryant",
    amenities: ["Neighborhood park", "Playground", "Quiet setting"],
    description: "Quiet neighborhood courts in the Bryant area of Northeast Seattle."
  },
  {
    id: "drp2800",
    slug: "david-rodgers-park",
    name: "David Rodgers Park",
    address: "2800 1st AVE W Seattle, WA 98119",
    driveTime: 3,
    neighborhood: "Queen Anne",
    amenities: ["Closest to pickup", "Quick access", "Local favorite"],
    description: "Just 3 minutes from our pickup location! The closest tennis courts available, perfect for maximizing your ball machine rental time."
  },
  {
    id: "dp2919",
    slug: "dearborn-park",
    name: "Dearborn Park",
    address: "2919 S Brandon ST Seattle, WA 98126",
    driveTime: 20,
    neighborhood: "South Seattle",
    amenities: ["Public courts", "Free parking"],
    description: "Public tennis courts in the Dearborn Park area of South Seattle."
  },
  {
    id: "delp4458",
    slug: "delridge-playfield",
    name: "Delridge Playfield",
    address: "4458 Delridge WAY SW Seattle, WA 98106",
    driveTime: 13,
    neighborhood: "Delridge",
    amenities: ["Community courts", "Sports fields", "Playground"],
    description: "Community tennis courts in the Delridge neighborhood of West Seattle."
  },
  {
    id: "disp3801",
    slug: "discovery-park",
    name: "Discovery Park",
    address: "3801 Discovery Park BLVD Seattle, WA 98199",
    driveTime: 15,
    neighborhood: "Magnolia",
    amenities: ["Nature setting", "Hiking trails", "Beach access", "Lighthouse views"],
    description: "Tennis courts in Seattle's largest park with access to hiking trails, beaches, and stunning Puget Sound views."
  },
  {
    id: "fp7200",
    slug: "froula-playground",
    name: "Froula Playground",
    address: "7200 12th AVE NE Seattle, WA 98115",
    driveTime: 15,
    neighborhood: "Ravenna",
    amenities: ["Neighborhood courts", "Quiet setting"],
    description: "Neighborhood tennis courts in the Ravenna area of Northeast Seattle."
  },
  {
    id: "gp2323",
    slug: "garfield-playfield",
    name: "Garfield Playfield",
    address: "2323 E Cherry ST Seattle, WA 98122",
    driveTime: 20,
    neighborhood: "Central District",
    amenities: ["Community courts", "Central location"],
    description: "Community tennis courts in Seattle's Central District."
  },
  {
    id: "gilp923",
    slug: "gilman-playfield",
    name: "Gilman Playfield",
    address: "923 NW 54th ST Seattle, WA 98107",
    driveTime: 10,
    neighborhood: "Ballard",
    amenities: ["Multiple courts", "Well maintained", "Free parking"],
    description: "Well-maintained tennis courts in the Ballard neighborhood. Popular with local tennis players."
  },
  {
    id: "hp2700",
    slug: "hiawatha-playfield",
    name: "Hiawatha Playfield",
    address: "2700 SW California AVE SW Seattle, WA 98116",
    driveTime: 15,
    neighborhood: "West Seattle",
    amenities: ["Community courts", "Sports complex", "Playground"],
    description: "Tennis courts at the Hiawatha sports complex in West Seattle."
  },
  {
    id: "lp4544",
    slug: "laurelhurst-playfield",
    name: "Laurelhurst Playfield",
    address: "4544 NE 41st ST Seattle, WA 98105",
    driveTime: 21,
    neighborhood: "Laurelhurst",
    amenities: ["Upscale neighborhood", "Well maintained", "Quiet setting"],
    description: "Tennis courts in the beautiful Laurelhurst neighborhood near the University of Washington."
  },
  {
    id: "mpMadison",
    slug: "madison-park",
    name: "Madison Park",
    address: "E Madison St & E Howe ST Seattle, WA 98112",
    driveTime: 22,
    neighborhood: "Madison Park",
    amenities: ["Lakefront neighborhood", "Beach nearby", "Upscale area"],
    description: "Tennis courts in the charming Madison Park neighborhood near Lake Washington."
  },
  {
    id: "magp1461",
    slug: "magnolia-park",
    name: "Magnolia Park",
    address: "1461 Magnolia BLVD W Seattle, WA 98199",
    driveTime: 10,
    neighborhood: "Magnolia",
    amenities: ["Scenic views", "Puget Sound views", "Quiet setting"],
    description: "Tennis courts in Magnolia with stunning views of Puget Sound and the Olympic Mountains."
  },
  {
    id: "magpl2518",
    slug: "magnolia-playfield",
    name: "Magnolia Playfield",
    address: "2518 W 34th W Seattle, WA 98199",
    driveTime: 11,
    neighborhood: "Magnolia",
    amenities: ["Community center", "Multiple courts", "Parking"],
    description: "Community tennis courts at the Magnolia Playfield, popular with local players."
  },
  {
    id: "mbp10533",
    slug: "meadowbrook-playfield",
    name: "Meadowbrook Playfield",
    address: "10533 35th AVE NE Seattle, WA 98125",
    driveTime: 20,
    neighborhood: "Meadowbrook",
    amenities: ["Community center", "Pool nearby", "Sports fields"],
    description: "Tennis courts at the Meadowbrook Community Center complex in North Seattle."
  },
  {
    id: "millp300",
    slug: "miller-playfield",
    name: "Miller Playfield",
    address: "300 19th AVE E Seattle, WA 98112",
    driveTime: 18,
    neighborhood: "Capitol Hill",
    amenities: ["Community courts", "Central location", "Playground"],
    description: "Community tennis courts on Capitol Hill, conveniently located near the neighborhood center."
  },
  {
    id: "montp1618",
    slug: "montlake-playfield",
    name: "Montlake Playfield",
    address: "1618 E Calhoun ST Seattle, WA 98112",
    driveTime: 15,
    neighborhood: "Montlake",
    amenities: ["Near UW", "Quiet neighborhood", "Well maintained"],
    description: "Tennis courts in the Montlake neighborhood near the University of Washington and the Arboretum."
  },
  {
    id: "mtbp2521",
    slug: "mount-baker-park",
    name: "Mount Baker Park",
    address: "2521 Lake Park DR S Seattle, WA 98144",
    driveTime: 20,
    neighborhood: "Mount Baker",
    amenities: ["Lake views", "Beach access", "Scenic setting"],
    description: "Tennis courts with Lake Washington views in the beautiful Mount Baker neighborhood."
  },
  {
    id: "rbp8802",
    slug: "rainier-beach-playfield",
    name: "Rainier Beach Playfield",
    address: "8802 Rainier AVE S Seattle, WA 98118",
    driveTime: 24,
    neighborhood: "Rainier Beach",
    amenities: ["Community pool", "Sports complex", "Community center"],
    description: "Tennis courts at the Rainier Beach Community Center complex in South Seattle."
  },
  {
    id: "rp3700",
    slug: "rainier-playfield",
    name: "Rainier Playfield",
    address: "3700 S Alaska ST Seattle, WA 98118",
    driveTime: 21,
    neighborhood: "Columbia City",
    amenities: ["Community courts", "Near Columbia City", "Local favorite"],
    description: "Community tennis courts near the vibrant Columbia City neighborhood."
  },
  {
    id: "rivp7226",
    slug: "riverview-playfield",
    name: "Riverview Playfield",
    address: "7226 12th AVE SW Seattle, WA 98106",
    driveTime: 19,
    neighborhood: "Riverview",
    amenities: ["Public courts", "Free parking", "Quiet setting"],
    description: "Public tennis courts in the Riverview neighborhood of West Seattle."
  },
  {
    id: "rogpEastlake",
    slug: "rogers-eastlake-playfield",
    name: "Rogers Eastlake Playfield",
    address: "Eastlake AVE E & E Roanoke ST Seattle, WA 98112",
    driveTime: 14,
    neighborhood: "Eastlake",
    amenities: ["Near downtown", "Lake Union views", "Urban setting"],
    description: "Tennis courts in the Eastlake neighborhood with easy access to downtown Seattle and South Lake Union."
  },
  {
    id: "ssp1400",
    slug: "sam-smith-park",
    name: "Sam Smith Park (I-90 Lid)",
    address: "1400 Martin Luther King Jr WAY S Seattle, WA 98144",
    driveTime: 17,
    neighborhood: "Central District",
    amenities: ["Modern facility", "Multiple courts", "Near light rail"],
    description: "Modern tennis courts built on the I-90 lid, with convenient light rail access."
  },
  {
    id: "solp7400",
    slug: "solstice-park",
    name: "Solstice Park",
    address: "7400 Fauntleroy WAY SW Seattle, WA 98136",
    driveTime: 20,
    neighborhood: "West Seattle",
    amenities: ["Community park", "Nature setting", "Quiet area"],
    description: "Tennis courts at Solstice Park in West Seattle's Fauntleroy neighborhood."
  },
  {
    id: "soundp1590",
    slug: "soundview-playfield",
    name: "Soundview Playfield",
    address: "1590 NW 90th ST Seattle, WA 98117",
    driveTime: 15,
    neighborhood: "Crown Hill",
    amenities: ["Community courts", "Sports fields", "Free parking"],
    description: "Community tennis courts in the Crown Hill neighborhood of Northwest Seattle."
  },
  {
    id: "wallp4219",
    slug: "wallingford-playfield",
    name: "Wallingford Playfield",
    address: "4219 Wallingford AVE N Seattle, WA 98103",
    driveTime: 8,
    neighborhood: "Wallingford",
    amenities: ["Central location", "Well maintained", "Popular courts"],
    description: "Popular tennis courts in the heart of Wallingford, just 8 minutes from our pickup location."
  },
  {
    id: "whp6920",
    slug: "walt-hundley-playfield",
    name: "Walt Hundley Playfield",
    address: "6920 34th AVE SW Seattle, WA 98126",
    driveTime: 19,
    neighborhood: "West Seattle",
    amenities: ["Golf course nearby", "Sports complex", "Free parking"],
    description: "Tennis courts at the Walt Hundley sports complex in West Seattle."
  },
  {
    id: "madplay3211",
    slug: "madrona-playground",
    name: "Madrona Playground",
    address: "3211 E Spring ST Seattle, WA 98122",
    driveTime: 23,
    neighborhood: "Madrona",
    amenities: ["Lake views", "Beach nearby", "Scenic setting"],
    description: "Tennis courts in the beautiful Madrona neighborhood with nearby access to Madrona Beach on Lake Washington."
  },
]

export function getCourtBySlug(slug: string): CourtInfo | undefined {
  return courts.find(court => court.slug === slug)
}

export function getCourtsByNeighborhood(neighborhood: string): CourtInfo[] {
  return courts.filter(court =>
    court.neighborhood.toLowerCase().replace(/\s+/g, '-') === neighborhood.toLowerCase()
  )
}

export function getNearestCourts(limit: number = 5): CourtInfo[] {
  return [...courts].sort((a, b) => a.driveTime - b.driveTime).slice(0, limit)
}
