import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MapPin, Clock, CheckCircle, Star, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { neighborhoods, getNeighborhoodBySlug } from "@/lib/neighborhood-data"
import { courts, getCourtsByNeighborhood } from "@/lib/court-data"

interface PageProps {
  params: Promise<{ neighborhood: string }>
}

// Generate static params for all neighborhoods
export async function generateStaticParams() {
  return neighborhoods.map((neighborhood) => ({
    neighborhood: neighborhood.slug,
  }))
}

// Generate metadata for each neighborhood page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { neighborhood: slug } = await params
  const neighborhood = getNeighborhoodBySlug(slug)

  if (!neighborhood) {
    return {
      title: "Neighborhood Not Found | Seattle Ball Machine Rental",
    }
  }

  const formattedName = neighborhood.name

  return {
    title: `Tennis Ball Machine Rental ${formattedName} Seattle | Book Online`,
    description: `Rent a professional tennis ball machine in ${formattedName}, Seattle. 2-hour sessions from $30. Easy pickup in Queen Anne. Practice at local courts including ${getCourtsByNeighborhood(slug).slice(0, 2).map(c => c.name).join(", ") || "nearby locations"}.`,
    alternates: {
      canonical: `https://www.seattleballmachine.com/tennis-ball-machine-rental/${slug}`,
    },
    openGraph: {
      title: `Tennis Ball Machine Rental ${formattedName} Seattle`,
      description: `Professional ball machine rental for ${formattedName} tennis players. From $30/session with easy Queen Anne pickup.`,
      url: `https://www.seattleballmachine.com/tennis-ball-machine-rental/${slug}`,
      type: "website",
    },
  }
}

export default async function NeighborhoodPage({ params }: PageProps) {
  const { neighborhood: slug } = await params
  const neighborhood = getNeighborhoodBySlug(slug)

  if (!neighborhood) {
    notFound()
  }

  // Get courts in this neighborhood
  const neighborhoodCourts = getCourtsByNeighborhood(slug)

  // Get all courts sorted by drive time for fallback
  const allCourtsSorted = [...courts].sort((a, b) => a.driveTime - b.driveTime)
  const displayCourts = neighborhoodCourts.length > 0 ? neighborhoodCourts : allCourtsSorted.slice(0, 5)

  // LocalBusiness schema for the neighborhood
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Seattle Ball Machine Rental - ${neighborhood.name}`,
    "description": `Tennis ball machine rental service for ${neighborhood.name}, Seattle`,
    "url": `https://www.seattleballmachine.com/tennis-ball-machine-rental/${slug}`,
    "areaServed": {
      "@type": "City",
      "name": "Seattle",
      "containsPlace": {
        "@type": "Place",
        "name": neighborhood.name,
      },
    },
    "priceRange": "$30-$40",
    "serviceType": "Tennis Ball Machine Rental",
  }

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.seattleballmachine.com",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Locations",
        "item": "https://www.seattleballmachine.com/tennis-ball-machine-rental",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": neighborhood.name,
        "item": `https://www.seattleballmachine.com/tennis-ball-machine-rental/${slug}`,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block text-lg font-bold md:text-xl">
              Seattle Ball Machine
            </span>
          </Link>
          <nav className="flex items-center space-x-2">
            <Button asChild variant="ghost">
              <Link href="/">Home</Link>
            </Button>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/#pricing">Book Now</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="container max-w-4xl py-8 px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/tennis-ball-machine-rental" className="hover:text-foreground transition-colors">Locations</Link>
          <span>/</span>
          <span className="text-foreground">{neighborhood.name}</span>
        </nav>

        {/* Hero section */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium mb-2">
            <MapPin className="h-4 w-4" />
            Seattle, WA
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Tennis Ball Machine Rental in {neighborhood.name}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {neighborhood.description}
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm">
              <DollarSign className="h-4 w-4" />
              <span>From $30/session</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm">
              <Clock className="h-4 w-4" />
              <span>2-hour sessions</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm">
              <Star className="h-4 w-4" />
              <span>65 balls included</span>
            </div>
          </div>

          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
            <Link href="/#pricing">
              Book Your {neighborhood.name} Session
            </Link>
          </Button>
        </div>

        {/* Highlights */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Why Rent in {neighborhood.name}?</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {neighborhood.highlights.map((highlight, index) => (
              <li key={index} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Nearby Courts */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {neighborhoodCourts.length > 0
              ? `Tennis Courts in ${neighborhood.name}`
              : "Nearby Tennis Courts"}
          </h2>
          <div className="space-y-3">
            {displayCourts.map((court) => (
              <Link
                key={court.slug}
                href={`/courts/${court.slug}`}
                className="flex items-center justify-between p-4 border rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
              >
                <div>
                  <h3 className="font-semibold">{court.name}</h3>
                  <p className="text-sm text-gray-500">{court.address}</p>
                </div>
                <div className="flex items-center gap-1 text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  <Clock className="h-3 w-3" />
                  {court.driveTime} min
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/courts" className="text-green-600 hover:text-green-700 font-medium text-sm">
              View all {courts.length} Seattle tennis courts →
            </Link>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Pricing for {neighborhood.name} Residents</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg">Single Session</h3>
              <div className="text-3xl font-bold mt-2">$40</div>
              <p className="text-sm text-gray-500 mt-1">2 hours of play</p>
            </div>
            <div className="border-2 border-green-500 rounded-lg p-4 bg-green-50">
              <div className="text-xs font-bold text-green-600 mb-1">POPULAR</div>
              <h3 className="font-semibold text-lg">3-Pack</h3>
              <div className="text-3xl font-bold mt-2">$105</div>
              <p className="text-sm text-gray-500 mt-1">$35/session - Save $15</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg">10-Pack</h3>
              <div className="text-3xl font-bold mt-2">$300</div>
              <p className="text-sm text-gray-500 mt-1">$30/session - Save $100</p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">How It Works for {neighborhood.name} Players</h2>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold">1</div>
              <div>
                <h3 className="font-semibold">Book Online</h3>
                <p className="text-gray-600">Select your package and schedule your pickup time through our booking system.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold">2</div>
              <div>
                <h3 className="font-semibold">Pick Up in Queen Anne</h3>
                <p className="text-gray-600">Collect the Hydrogen Proton ball machine and 65 balls from our Queen Anne location.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold">3</div>
              <div>
                <h3 className="font-semibold">Head to {neighborhood.name}</h3>
                <p className="text-gray-600">Drive to your preferred court in {neighborhood.name} and set up in minutes.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold">4</div>
              <div>
                <h3 className="font-semibold">Practice & Return</h3>
                <p className="text-gray-600">Enjoy your 2-hour session, then return the equipment to our pickup location.</p>
              </div>
            </li>
          </ol>
        </div>

        {/* Other neighborhoods */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Also Serving These Seattle Neighborhoods</h2>
          <div className="flex flex-wrap gap-2">
            {neighborhoods
              .filter(n => n.slug !== slug)
              .map((n) => (
                <Link
                  key={n.slug}
                  href={`/tennis-ball-machine-rental/${n.slug}`}
                  className="px-3 py-2 bg-gray-100 hover:bg-green-100 rounded-lg text-sm transition-colors"
                >
                  {n.name}
                </Link>
              ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-green-600 rounded-xl p-6 md:p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Ready to Play Tennis in {neighborhood.name}?</h2>
          <p className="mb-6 text-green-100">
            Book your ball machine rental and start improving your game today.
          </p>
          <Button asChild size="lg" className="bg-yellow-500 text-black hover:bg-yellow-600 font-bold">
            <Link href="/#pricing">Book Now - From $30/session</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-white py-6 mt-12">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Seattle Ball Machine Rental. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/support" className="text-sm text-gray-500 hover:underline">Support</Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:underline">Terms of Service</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
