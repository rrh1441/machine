import { Metadata } from "next"
import Link from "next/link"
import { MapPin, Clock, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { courts } from "@/lib/court-data"

export const metadata: Metadata = {
  title: "Seattle Tennis Courts | Ball Machine Rental Locations",
  description: "Find the best tennis courts in Seattle for ball machine practice. Browse 38+ public courts with drive times from our Queen Anne pickup location.",
  alternates: {
    canonical: "https://www.seattleballmachine.com/courts",
  },
  openGraph: {
    title: "Seattle Tennis Courts | Ball Machine Rental Locations",
    description: "Find the best tennis courts in Seattle for ball machine practice. 38+ courts with drive times from Queen Anne.",
    url: "https://www.seattleballmachine.com/courts",
  },
}

export default function CourtsIndexPage() {
  // Group courts by drive time
  const courts5min = courts.filter(c => c.driveTime <= 5).sort((a, b) => a.driveTime - b.driveTime)
  const courts10min = courts.filter(c => c.driveTime > 5 && c.driveTime <= 10).sort((a, b) => a.driveTime - b.driveTime)
  const courts15min = courts.filter(c => c.driveTime > 10 && c.driveTime <= 15).sort((a, b) => a.driveTime - b.driveTime)
  const courts20min = courts.filter(c => c.driveTime > 15 && c.driveTime <= 20).sort((a, b) => a.driveTime - b.driveTime)
  const courtsOver20 = courts.filter(c => c.driveTime > 20).sort((a, b) => a.driveTime - b.driveTime)

  const CourtCard = ({ court }: { court: typeof courts[0] }) => (
    <Link
      href={`/courts/${court.slug}`}
      className="block p-4 bg-white rounded-lg border hover:border-green-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{court.name}</h3>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3" />
            {court.neighborhood}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-sm bg-green-50 text-green-700 px-2 py-1 rounded">
            <Clock className="h-3 w-3" />
            {court.driveTime} min
          </span>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </Link>
  )

  const CourtsSection = ({ title, courtList }: { title: string; courtList: typeof courts }) => (
    courtList.length > 0 && (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">{title} ({courtList.length} courts)</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {courtList.map(court => (
            <CourtCard key={court.slug} court={court} />
          ))}
        </div>
      </div>
    )
  )

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
          <span className="text-foreground">Tennis Courts</span>
        </nav>

        {/* Hero */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Seattle Tennis Courts
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Find the perfect tennis court for your ball machine practice session. All drive times are calculated from our Queen Anne pickup location.
          </p>
          <p className="text-gray-500">
            <strong>{courts.length}</strong> public tennis courts across Seattle, organized by drive time from pickup.
          </p>
        </div>

        {/* Courts by drive time */}
        <CourtsSection title="Within 5 Minutes" courtList={courts5min} />
        <CourtsSection title="6-10 Minutes" courtList={courts10min} />
        <CourtsSection title="11-15 Minutes" courtList={courts15min} />
        <CourtsSection title="16-20 Minutes" courtList={courts20min} />
        <CourtsSection title="Over 20 Minutes" courtList={courtsOver20} />

        {/* CTA */}
        <div className="bg-green-600 rounded-xl p-6 md:p-8 text-center text-white mt-8">
          <h2 className="text-2xl font-bold mb-2">Ready to Practice?</h2>
          <p className="mb-6 text-green-100">
            Book your ball machine rental and practice at any of these Seattle courts.
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
