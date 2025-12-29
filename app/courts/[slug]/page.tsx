import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, MapPin, Clock, CheckCircle, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { courts, getCourtBySlug, getNearestCourts } from "@/lib/court-data"

interface PageProps {
  params: Promise<{ slug: string }>
}

// Generate static params for all courts
export async function generateStaticParams() {
  return courts.map((court) => ({
    slug: court.slug,
  }))
}

// Generate metadata for each court page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const court = getCourtBySlug(slug)

  if (!court) {
    return {
      title: "Court Not Found | Seattle Ball Machine Rental",
    }
  }

  return {
    title: `${court.name} Tennis Courts | Ball Machine Rental Seattle`,
    description: `Rent a tennis ball machine for ${court.name} in ${court.neighborhood}, Seattle. Just ${court.driveTime} minutes from pickup. ${court.description}`,
    alternates: {
      canonical: `https://www.seattleballmachine.com/courts/${court.slug}`,
    },
    openGraph: {
      title: `${court.name} Tennis Courts | Ball Machine Rental`,
      description: `Practice tennis at ${court.name} with our professional ball machine rental. ${court.driveTime} min drive from Queen Anne pickup.`,
      url: `https://www.seattleballmachine.com/courts/${court.slug}`,
      type: "website",
    },
  }
}

export default async function CourtPage({ params }: PageProps) {
  const { slug } = await params
  const court = getCourtBySlug(slug)

  if (!court) {
    notFound()
  }

  // Get nearby courts (excluding current one)
  const nearbyCourts = getNearestCourts(6).filter(c => c.slug !== court.slug).slice(0, 3)

  // Court-specific JSON-LD schema
  const courtSchema = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "name": court.name,
    "description": court.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": court.address.split(" Seattle")[0],
      "addressLocality": "Seattle",
      "addressRegion": "WA",
      "addressCountry": "US",
    },
    "amenityFeature": court.amenities.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity,
    })),
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
        "name": "Tennis Courts",
        "item": "https://www.seattleballmachine.com/courts",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": court.name,
        "item": `https://www.seattleballmachine.com/courts/${court.slug}`,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courtSchema) }}
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
          <Link href="/courts" className="hover:text-foreground transition-colors">Courts</Link>
          <span>/</span>
          <span className="text-foreground">{court.name}</span>
        </nav>

        {/* Hero section */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium mb-2">
            <MapPin className="h-4 w-4" />
            {court.neighborhood}, Seattle
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {court.name} Tennis Courts
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {court.description}
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
              <Car className="h-5 w-5" />
              <span className="font-medium">{court.driveTime} min drive</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg">
              <MapPin className="h-5 w-5" />
              <span>{court.address}</span>
            </div>
          </div>

          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
            <Link href="/#pricing">
              Rent Ball Machine for {court.name}
            </Link>
          </Button>
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Court Amenities</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {court.amenities.map((amenity, index) => (
              <li key={index} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span>{amenity}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">How to Practice at {court.name}</h2>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold">1</div>
              <div>
                <h3 className="font-semibold">Book Your Session</h3>
                <p className="text-gray-600">Choose a single session ($40) or save with our 3-pack ($105) or 10-pack ($300).</p>
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
                <h3 className="font-semibold">Drive to {court.name}</h3>
                <p className="text-gray-600">Just {court.driveTime} minutes from pickup. The machine fits easily in any car.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold">4</div>
              <div>
                <h3 className="font-semibold">Practice & Improve</h3>
                <p className="text-gray-600">Enjoy 2 hours of focused practice with adjustable speed and spin settings.</p>
              </div>
            </li>
          </ol>
        </div>

        {/* Nearby courts */}
        {nearbyCourts.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Other Nearby Courts</h2>
            <div className="grid gap-4">
              {nearbyCourts.map((nearbyCourt) => (
                <Link
                  key={nearbyCourt.slug}
                  href={`/courts/${nearbyCourt.slug}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold">{nearbyCourt.name}</h3>
                    <p className="text-sm text-gray-500">{nearbyCourt.neighborhood}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {nearbyCourt.driveTime} min
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-green-600 rounded-xl p-6 md:p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Ready to Practice at {court.name}?</h2>
          <p className="mb-6 text-green-100">
            Book your ball machine rental and start improving your game today.
          </p>
          <Button asChild size="lg" className="bg-yellow-500 text-black hover:bg-yellow-600 font-bold">
            <Link href="/#pricing">Book Now</Link>
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
