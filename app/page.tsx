// -----------------------------------------------------------------------------
// app/page.tsx  •  2025-04-24
// Seattle Ball Machine landing page
// -----------------------------------------------------------------------------
'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  CheckCircle,
  Clock,
  Gift,
  MapPin,
  Quote,
  Repeat,
  Settings,
  Smartphone,
  Target,
  Zap,
} from 'lucide-react'
import { track } from '@vercel/analytics'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import LiteYouTubeEmbed from 'react-lite-youtube-embed'
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'

import { NearbyCourtsMapWidget } from './components/local/nearby-courts-map'

// ─────────────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const currentYear = new Date().getFullYear()

  // Track page view
  useEffect(() => {
    track('landing_page_viewed', {
      timestamp: new Date().toISOString(),
      page: 'home'
    })
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      {/* ───────────────────── NAV ───────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 sm:h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block text-base font-bold sm:text-lg md:text-xl">
              Seattle&nbsp;Ball&nbsp;Machine
            </span>
          </Link>

          {/* Book Now button */}
          <Button
            asChild
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => track('nav_book_now_clicked')}
          >
            <Link href="#pricing">Book&nbsp;Now</Link>
          </Button>
        </div>
      </header>

      {/* ───────────── Promotion banner ───────────── */}
      <div className="bg-yellow-500 py-2 px-4 text-black">
        <div className="container flex items-center justify-center text-xs sm:text-sm font-medium md:text-base">
          <div className="flex items-center gap-2">
            <Gift className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-center">
              Limited&nbsp;Time:&nbsp;Free can of Penn tennis balls with purchase of 3 or 10 pack!
            </span>
          </div>
        </div>
      </div>


      <main className="flex-1">
        {/* ───────────────── Hero ───────────────── */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/tennis-ball-hero.png"
              alt="Professional tennis ball machine on Queen Anne court for rental"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-950/50 to-green-900/40" />
          </div>
          <div className="relative z-10 container px-4 text-center md:px-6">
            <h1 className="text-3xl font-bold tracking-tighter text-white text-shadow-lg sm:text-4xl md:text-5xl lg:text-6xl">
              Practice Smarter. Play Better.
              <span className="block mt-2">On Your Schedule.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[700px] text-lg text-white/90 text-shadow-md md:text-xl">
              Rent a professional-grade tennis ball machine in Queen Anne, Seattle.
              Train solo at nearby courts — no partner required, no club membership.
              Just focused, repeatable practice when it works for you.
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="bg-yellow-500 font-bold text-black shadow-lg hover:bg-yellow-600 text-lg px-8 py-6"
                onClick={() => track('hero_book_now_clicked')}
              >
                <Link href="#pricing">Book a Session</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ─────────────── Why Rent a Ball Machine? ─────────────── */}
        <section id="features" className="w-full bg-white py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">
                Why Rent a Ball Machine?
              </h2>
              <p className="mt-4 text-xl text-gray-600 text-center">
                Most players don't need more matches — they need better reps.
              </p>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Groove strokes with consistent feeds</h3>
                    <p className="mt-1 text-gray-500">
                      Get the same ball, same spot, until you own the shot.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
                    <Zap className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Isolate weaknesses without pressure</h3>
                    <p className="mt-1 text-gray-500">
                      Work on that backhand without worrying about points.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Train on your own time</h3>
                    <p className="mt-1 text-gray-500">
                      No coordinating schedules with partners.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
                    <Repeat className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">More meaningful practice in less time</h3>
                    <p className="mt-1 text-gray-500">
                      100+ quality reps in a single session.
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-10 text-center text-gray-600">
                This service exists to make high-quality solo training simple and accessible for Seattle players.
              </p>
            </div>
          </div>
        </section>

        {/* ─────────────── What You Get ─────────────── */}
        <section className="w-full bg-gray-50 py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">
              What You Get
            </h2>
            <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                  <Settings className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">Professional-Grade Machine</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Adjustable speed, spin, depth, and oscillation for realistic drills.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                  <Clock className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">Solo Practice, Anytime</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Practice when courts are open — early mornings, mid-day, or evenings.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                  <Repeat className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">Repeatable Reps</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Build muscle memory through structured, consistent feeds.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">No Commitment</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Rent when you want. Packages available if you train regularly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── How it works ─────────────── */}
        <section id="how-it-works" className="w-full bg-white py-12 md:py-24 lg:py-32">
          <div className="container px-4 text-center md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              How It Works
            </h2>
            <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3">
              {[
                ['1', 'Book Online', 'Choose your session or package and pay securely.'],
                ['2', 'Get Pickup Details', 'You\'ll receive clear instructions after booking.'],
                ['3', 'Pick Up & Play', 'Grab the machine, head to nearby courts, and start training.'],
              ].map(([num, title, desc]) => (
                <div key={num} className="flex flex-col items-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <span className="text-2xl font-bold text-green-600">{num}</span>
                  </div>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-8 text-gray-500">
              Fast, straightforward, and designed to stay out of your way.
            </p>
          </div>
        </section>

        {/* ─── Pickup + Nearby courts (merged) ─── */}
        <section id="pickup" className="w-full bg-gray-50 py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mb-12 text-center">
              <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-700">
                Pickup&nbsp;&amp;&nbsp;Nearby
              </div>
              <h2 className="mt-2 text-3xl font-bold tracking-tighter sm:text-5xl">
                Queen&nbsp;Anne&nbsp;Pickup&nbsp;&amp;&nbsp;Nearby&nbsp;Courts
              </h2>
              <p className="mx-auto mt-4 max-w-[900px] text-xl text-gray-500 md:text-xl">
                Our Seattle tennis ball machine rental is easily accessible in upper Queen Anne (near&nbsp;W McGraw St &amp; 4th Ave W).
                Check drive times below. Detailed pickup instructions will be sent
                in your booking confirmation email.
              </p>
            </div>

            {/* ▼ wrapper */}
            <div className="mx-auto flex max-w-3xl flex-col gap-12">
              <NearbyCourtsMapWidget />

              {/* New CTA button */}
              <div className="flex justify-center">
                <Button 
                  asChild 
                  className="bg-green-600 font-bold hover:bg-green-700"
                  onClick={() => track('external_link_clicked', { 
                    url: 'https://firstserveseattle.com',
                    link_text: 'See Today\'s Open Courts'
                  })}
                >
                  <Link
                    href="https://firstserveseattle.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    See&nbsp;Today&rsquo;s&nbsp;Open&nbsp;Courts
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── Video section ─────────────── */}
        <section className="w-full bg-white py-12 md:py-24 lg:py-32 overflow-hidden">
          <div className="container px-4 text-center md:px-6">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-5xl">
              See It In Action
            </h2>
            <p className="mx-auto mt-4 max-w-[900px] text-gray-500 text-sm sm:text-base md:text-xl">
              Watch how the Hydrogen Proton ball machine operates.
            </p>
            <div className="mx-auto mt-8 md:mt-12 grid max-w-5xl gap-8 md:gap-12 items-center md:grid-cols-2">
              {/* Video first on mobile, second on desktop */}
              <div className="flex justify-center order-1 md:order-2">
                <div className="relative h-[400px] w-[225px] sm:h-[500px] sm:w-[280px] overflow-hidden rounded-xl border-4 border-gray-800 bg-black p-1 shadow-xl">
                  <LiteYouTubeEmbed
                    id="FhzlDpDv3nM"
                    title="Seattle Ball Machine Rental Demo (Vertical)"
                    wrapperClass="yt-lite absolute top-0 left-0 h-full w-full rounded-lg"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-4 text-left order-2 md:order-1">
                <h3 className="text-xl sm:text-2xl font-bold">
                  Professional Training at Your Fingertips
                </h3>
                <p className="text-gray-500 text-sm sm:text-base">
                  With a variety of drills and settings, practice your strokes and
                  improve your game.
                </p>
                <ul className="mt-4 space-y-2">
                  {[
                    'Set up various shot patterns',
                    'Adjust ball speed and frequency',
                    'Practice groundstrokes and volleys',
                    'Lightweight and easy to transport',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm sm:text-base">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <Button
                    asChild
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => track('video_section_book_now_clicked')}
                  >
                    <Link href="#pricing">Book Your Session Now</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── About section ─────────────── */}
        <section id="about" className="w-full bg-gray-50 py-12 md:py-24 lg:py-32">
          <div className="container px-4 text-center md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              About&nbsp;Me
            </h2>
            <div className="mt-6 flex flex-col items-center space-y-4">
              <Image
                src="/aboutme.png"
                alt="Seattle Ball Machine Rental owner and tennis enthusiast"
                width={128}
                height={128}
                className="rounded-full object-cover border-4 border-white shadow-md"
              />
              <div className="max-w-3xl space-y-4">
                <p className="text-gray-600 md:text-xl">
                  When I started playing tennis in New York, a local spot had a
                  ball machine for quick sessions before work. After moving to
                  Seattle, finding time for practice was a challenge—until I
                  purchased the Hydrogen Proton.
                </p>
                <p className="font-medium text-gray-600 md:text-xl">
                  I now rent the machine to help the Seattle tennis community
                  improve their game with consistent, quality practice.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── Pricing section ─────────────── */}
        <section id="pricing" className="w-full bg-white py-12 md:py-24 lg:py-32">
          <div className="container px-4 text-center md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Pricing & Rental Options
            </h2>
            <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
              {/* Single session */}
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Single Session</CardTitle>
                  <CardDescription>Cheaper than a one-hour private lesson</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">$40</span>
                      <span className="text-gray-500">/session</span>
                    </div>
                    <ul className="grid gap-2 text-left">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>2 hours of play time</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>Perfect for first-timers</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <a
                    href="https://buy.stripe.com/dRm7sN3Ou7RVgK696PgIo00?client_reference_id=single&metadata[package_type]=single&metadata[sessions_count]=1"
                    className="inline-flex w-full items-center justify-center rounded-md bg-green-600 py-2 px-4 font-bold text-white hover:bg-green-700"
                    onClick={() => track('stripe_checkout_clicked', {
                      package_type: 'single_session',
                      price: '$40'
                    })}
                  >
                    Book Single Session
                  </a>
                </CardFooter>
              </Card>

              {/* 3-pack */}
              <Card className="flex flex-col border-green-200 bg-green-50">
                <CardHeader>
                  <div className="mb-2 inline-block rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">
                    MOST POPULAR
                  </div>
                  <CardTitle>3-Pack</CardTitle>
                  <CardDescription>Buy two, get third half off</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">$105</span>
                      <span className="text-gray-500">total</span>
                    </div>
                    <p className="text-sm font-medium text-green-600">
                      $35 per session
                    </p>
                    <ul className="grid gap-2 text-left">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>3 sessions of 2 hours each</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>Flexible scheduling</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                        <span className="font-medium">Free Penn tennis balls</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <a
                    href="https://buy.stripe.com/fZubJ3bgWfkn0L8cj1gIo01?client_reference_id=3_pack&metadata[package_type]=3_pack&metadata[sessions_count]=3"
                    className="inline-flex w-full items-center justify-center rounded-md bg-green-600 py-2 px-4 font-bold text-white hover:bg-green-700"
                    onClick={() => track('stripe_checkout_clicked', {
                      package_type: '3_pack',
                      price: '$105'
                    })}
                  >
                    Buy 3-Pack
                  </a>
                </CardFooter>
              </Card>

              {/* 10-pack */}
              <Card className="flex flex-col">
                <CardHeader>
                  <div className="mb-2 inline-block rounded-full bg-gray-600 px-3 py-1 text-xs font-bold text-white">
                    BEST VALUE
                  </div>
                  <CardTitle>10-Pack</CardTitle>
                  <CardDescription>Lowest per-session cost</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">$300</span>
                      <span className="text-gray-500">total</span>
                    </div>
                    <p className="text-sm font-medium text-green-600">
                      $30 per session
                    </p>
                    <ul className="grid gap-2 text-left">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>10 sessions of 2 hours each</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>Best for regular players</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                        <span className="font-medium">Free Penn tennis balls</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <a
                    href="https://buy.stripe.com/6oU3cxfxc5JN8dA82LgIo02?client_reference_id=10_pack&metadata[package_type]=10_pack&metadata[sessions_count]=10"
                    className="inline-flex w-full items-center justify-center rounded-md bg-green-600 py-2 px-4 font-bold text-white hover:bg-green-700"
                    onClick={() => track('stripe_checkout_clicked', {
                      package_type: '10_pack',
                      price: '$300'
                    })}
                  >
                    Buy 10-Pack
                  </a>
                </CardFooter>
              </Card>
            </div>

            {/* What's Included */}
            <div className="mx-auto mt-16 max-w-3xl">
              <h3 className="text-2xl font-bold mb-6">What's Included</h3>
              <div className="bg-white rounded-lg border p-6 text-left">
                <p className="text-gray-600 mb-4">Before you book, here's exactly what you get:</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>Hydrogen Proton ball machine (fully charged)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>65 tennis balls</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>Ball hopper / pickup basket</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>App-based remote control</span>
                  </li>
                </ul>
                <p className="mt-4 text-gray-600 font-medium">Everything you need to train immediately.</p>
              </div>
            </div>

            {/* SwingStick Add-on */}
            <div className="mx-auto mt-12 max-w-4xl">
              <div className="rounded-lg border-2 border-gray-200 bg-white p-4 sm:p-6 md:p-8">
                <div className="flex flex-col items-center gap-6 md:flex-row">
                  <div className="relative h-48 w-48 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src="/swingstick.JPG"
                      alt="SwingStick sensor for tracking tennis stats"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 192px, 192px"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="mb-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                      OPTIONAL ADD-ON
                    </div>
                    <h3 className="text-2xl font-bold">Track Your Stats Like a Pro</h3>
                    <p className="mt-2 text-gray-600">
                      Want data with your reps? Add the SwingStick sensor to measure swing speed, track contact patterns, and monitor consistency over time.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Works with SwingVision app on your iPhone</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Pairs easily with your session</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Ideal for players focused on measurable improvement</span>
                      </li>
                    </ul>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">$10</span>
                        <span className="text-gray-500">/rental</span>
                      </div>
                      <span className="text-sm text-gray-500">iOS required</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── Testimonials ─────────────── */}
        <section className="w-full bg-gray-50 py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">
              What Players Are Saying
            </h2>
            <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <Quote className="h-8 w-8 text-green-600 mb-4" />
                <p className="text-gray-700 italic">
                  "Finally fixed my backhand. Having consistent feeds made a huge difference."
                </p>
                <p className="mt-4 font-semibold text-gray-900">— Sarah T., Queen Anne</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <Quote className="h-8 w-8 text-green-600 mb-4" />
                <p className="text-gray-700 italic">
                  "Way more productive than just hitting around. Super easy pickup and setup."
                </p>
                <p className="mt-4 font-semibold text-gray-900">— Mark L., Seattle</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── FAQ ─────────────── */}
        <section className="w-full bg-white py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">
              FAQ
            </h2>
            <div className="mx-auto mt-12 max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How long is each rental?</AccordionTrigger>
                  <AccordionContent>
                    Each session is 2 hours, with a 15-minute grace period for return.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>What's included with the rental?</AccordionTrigger>
                  <AccordionContent>
                    The ball machine, 65 balls, and a pickup basket are included. Lost balls are charged at $2 per ball.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Does the machine fit in a sedan?</AccordionTrigger>
                  <AccordionContent>
                    Yes. The machine weighs less than 20 pounds and is compact enough to fit in any trunk or on a back seat.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Do I need an app?</AccordionTrigger>
                  <AccordionContent>
                    Yes. The machine is controlled via a mobile app. You'll receive setup instructions after booking.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>What happens if it rains?</AccordionTrigger>
                  <AccordionContent>
                    Cancellations made more than 24 hours in advance receive a full refund. Weather-related cancellations within 24 hours may be rescheduled.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger>Can other people use the machine?</AccordionTrigger>
                  <AccordionContent>
                    Yes, as long as you are present the entire rental. You're responsible for the equipment during the session.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7">
                  <AccordionTrigger>What if the machine is damaged?</AccordionTrigger>
                  <AccordionContent>
                    Please inspect the machine at pickup and report any issues immediately. You are responsible for damage or loss during your rental period.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* ─────────────── Final CTA ─────────────── */}
        <section className="w-full bg-green-600 py-12 md:py-24 lg:py-32">
          <div className="container px-4 text-center text-white md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Train?
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] md:text-xl text-green-100">
              Stop waiting for partners or open clinics. Get focused reps and real improvement on your schedule.
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="bg-yellow-500 font-bold text-black hover:bg-yellow-600 text-lg px-8 py-6"
                onClick={() => track('cta_section_book_now_clicked')}
              >
                <Link href="#pricing">Reserve Your Session</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* ─────────────── Footer ─────────────── */}
      <footer className="w-full border-t bg-white py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
          <p className="text-sm text-gray-500">
            © {currentYear} Seattle Ball Machine Rental. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/support" className="text-sm text-gray-500 hover:underline">
              Support
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:underline">
              Terms of Service
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
