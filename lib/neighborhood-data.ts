// Neighborhood data for programmatic SEO landing pages
export interface NeighborhoodInfo {
  slug: string
  name: string
  description: string
  highlights: string[]
  nearbyAttractions: string[]
}

export const neighborhoods: NeighborhoodInfo[] = [
  {
    slug: "queen-anne",
    name: "Queen Anne",
    description: "Our home base! Queen Anne is where you'll pick up the ball machine, making it the most convenient neighborhood for rentals. With several nearby courts including Observatory Courts and David Rodgers Park just minutes away, you can maximize your practice time.",
    highlights: [
      "Pickup location in upper Queen Anne",
      "Multiple courts within 5 minutes",
      "Easy parking and access",
      "Scenic neighborhood with great views",
    ],
    nearbyAttractions: ["Kerry Park", "Seattle Center", "Queen Anne Hill"],
  },
  {
    slug: "capitol-hill",
    name: "Capitol Hill",
    description: "Capitol Hill offers excellent tennis courts at Volunteer Park and Miller Playfield. Just 15-20 minutes from our Queen Anne pickup location, you can combine your practice session with exploring one of Seattle's most vibrant neighborhoods.",
    highlights: [
      "Historic courts at Volunteer Park",
      "Central Seattle location",
      "Great coffee shops nearby",
      "Vibrant neighborhood atmosphere",
    ],
    nearbyAttractions: ["Volunteer Park Conservatory", "Cal Anderson Park", "Pike/Pine corridor"],
  },
  {
    slug: "ballard",
    name: "Ballard",
    description: "Ballard's Gilman Playfield offers well-maintained courts just 10 minutes from pickup. The neighborhood's Scandinavian heritage and thriving brewery scene make it a great destination to explore after your practice session.",
    highlights: [
      "Well-maintained courts at Gilman Playfield",
      "Only 10 minutes from pickup",
      "Great restaurants and breweries nearby",
      "Family-friendly neighborhood",
    ],
    nearbyAttractions: ["Ballard Locks", "Golden Gardens", "Ballard Farmers Market"],
  },
  {
    slug: "fremont",
    name: "Fremont",
    description: "Known as the 'Center of the Universe,' Fremont offers quirky charm and easy access to Lower Woodland courts. Just 7-9 minutes from our pickup location, it's one of the closest options for ball machine practice.",
    highlights: [
      "Close proximity to pickup location",
      "Access to Woodland Park courts",
      "Quirky neighborhood character",
      "Great food and shops",
    ],
    nearbyAttractions: ["Fremont Troll", "Woodland Park Zoo", "Fremont Sunday Market"],
  },
  {
    slug: "wallingford",
    name: "Wallingford",
    description: "Wallingford Playfield is just 8 minutes from our pickup location, making it one of the most convenient options. This family-friendly neighborhood offers great courts and plenty of nearby amenities.",
    highlights: [
      "Popular courts at Wallingford Playfield",
      "Only 8 minutes from pickup",
      "Family-friendly neighborhood",
      "Close to Gas Works Park",
    ],
    nearbyAttractions: ["Gas Works Park", "Lake Union", "Wallingford Center"],
  },
  {
    slug: "green-lake",
    name: "Green Lake",
    description: "Green Lake Park offers beautiful lakeside tennis courts about 13 minutes from pickup. Combine your ball machine session with a walk or run around the iconic 2.8-mile lake loop.",
    highlights: [
      "Scenic lakeside courts",
      "Multiple courts available",
      "Popular recreation destination",
      "Running and walking paths",
    ],
    nearbyAttractions: ["Green Lake", "Woodland Park", "Green Lake Community Center"],
  },
  {
    slug: "university-district",
    name: "University District",
    description: "The U-District offers several court options near the University of Washington campus. Courts at Laurelhurst and Ravenna are about 15-20 minutes from pickup, perfect for students and faculty.",
    highlights: [
      "Near University of Washington",
      "Multiple court options",
      "Student-friendly area",
      "Affordable dining options",
    ],
    nearbyAttractions: ["University of Washington", "University Village", "Burke Museum"],
  },
  {
    slug: "magnolia",
    name: "Magnolia",
    description: "Magnolia offers scenic courts with Puget Sound views at Magnolia Park, just 10 minutes from pickup. Discovery Park's courts provide a nature-focused tennis experience.",
    highlights: [
      "Stunning Puget Sound views",
      "Close to pickup location",
      "Access to Discovery Park",
      "Quiet residential setting",
    ],
    nearbyAttractions: ["Discovery Park", "Magnolia Village", "West Point Lighthouse"],
  },
  {
    slug: "west-seattle",
    name: "West Seattle",
    description: "West Seattle offers multiple court options including Alki Playfield and Hiawatha Playfield. About 15-20 minutes from pickup, you can combine tennis with a beach visit at Alki.",
    highlights: [
      "Beach-adjacent courts at Alki",
      "Multiple venue options",
      "Great views of downtown Seattle",
      "Family-friendly beaches",
    ],
    nearbyAttractions: ["Alki Beach", "Lincoln Park", "West Seattle Junction"],
  },
  {
    slug: "beacon-hill",
    name: "Beacon Hill",
    description: "Beacon Hill offers courts at Jefferson Park with stunning city views, and Beacon Hill Playfield for community-style play. About 16 minutes from pickup with easy light rail access.",
    highlights: [
      "Spectacular city views at Jefferson Park",
      "Light rail accessible",
      "Diverse dining options",
      "Community-focused atmosphere",
    ],
    nearbyAttractions: ["Jefferson Park Golf Course", "Beacon Hill Light Rail", "El Centro de la Raza"],
  },
]

export function getNeighborhoodBySlug(slug: string): NeighborhoodInfo | undefined {
  return neighborhoods.find(n => n.slug === slug)
}
