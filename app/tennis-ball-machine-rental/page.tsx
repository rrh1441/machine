import { Metadata } from "next"
import Link from "next/link"
import { MapPin, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { neighborhoods } from "@/lib/neighborhood-data"
import { courts } from "@/lib/court-data"

export const metadata: Metadata = {
  title: "Tennis Ball Machine Rental Seattle Neighborhoods | All Locations",
  description: "Rent a tennis ball machine in any Seattle neighborhood. Serving Queen Anne, Capitol Hill, Ballard, Fremont, West Seattle, and more. Pickup in Queen Anne.",
  alternates: {
    canonical: "https://www.seattleballmachine.com/tennis-ball-machine-rental",
  },
  openGraph: {
    title: "Tennis Ball Machine Rental - All Seattle Neighborhoods",
    description: "Professional ball machine rental serving all Seattle neighborhoods. Easy pickup in Queen Anne.",
    url: "https://www.seattleballmachine.com/tennis-ball-machine-rental",
  },
}

export default function LocationsIndexPage() {
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
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

      <main className="container max-w-5xl py-8 px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Locations</span>
        </nav>

        {/* Hero */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Tennis Ball Machine Rental Across Seattle
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            We serve tennis players throughout Seattle. Pick up the ball machine in Queen Anne and practice at any of the {courts.length} public tennis courts across the city.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span><strong>{neighborhoods.length}</strong> neighborhoods served</span>
            <span><strong>{courts.length}</strong> tennis courts</span>
            <span><strong>1</strong> convenient pickup location</span>
          </div>
        </div>

        {/* Neighborhoods grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Seattle Neighborhoods We Serve</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {neighborhoods.map((neighborhood) => (
              <Link
                key={neighborhood.slug}
                href={`/tennis-ball-machine-rental/${neighborhood.slug}`}
                className="block p-5 bg-white rounded-xl border hover:border-green-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <h3 className="font-semibold text-lg">{neighborhood.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {neighborhood.description.slice(0, 120)}...
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {neighborhood.highlights.slice(0, 2).map((highlight, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Popular Destinations</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/courts" className="flex items-center gap-2 p-3 border rounded-lg hover:border-green-300 transition-colors">
              <span className="font-medium">All Tennis Courts</span>
              <span className="text-sm text-gray-500">({courts.length} locations)</span>
            </Link>
            <Link href="/courts/observatory-courts" className="flex items-center gap-2 p-3 border rounded-lg hover:border-green-300 transition-colors">
              <span className="font-medium">Observatory Courts</span>
              <span className="text-sm text-gray-500">(5 min away)</span>
            </Link>
            <Link href="/courts/david-rodgers-park" className="flex items-center gap-2 p-3 border rounded-lg hover:border-green-300 transition-colors">
              <span className="font-medium">David Rodgers Park</span>
              <span className="text-sm text-gray-500">(3 min away)</span>
            </Link>
            <Link href="/courts/wallingford-playfield" className="flex items-center gap-2 p-3 border rounded-lg hover:border-green-300 transition-colors">
              <span className="font-medium">Wallingford Playfield</span>
              <span className="text-sm text-gray-500">(8 min away)</span>
            </Link>
            <Link href="/courts/green-lake-park" className="flex items-center gap-2 p-3 border rounded-lg hover:border-green-300 transition-colors">
              <span className="font-medium">Green Lake Park</span>
              <span className="text-sm text-gray-500">(13 min away)</span>
            </Link>
            <Link href="/courts/volunteer-park" className="flex items-center gap-2 p-3 border rounded-lg hover:border-green-300 transition-colors">
              <span className="font-medium">Volunteer Park</span>
              <span className="text-sm text-gray-500">(17 min away)</span>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-green-600 rounded-xl p-6 md:p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Ready to Play Tennis?</h2>
          <p className="mb-6 text-green-100">
            Book your ball machine rental and practice at any Seattle court.
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
