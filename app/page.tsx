// -----------------------------------------------------------------------------
// app/page.tsx  •  2025-04-24
// Seattle Ball Machine landing page
// -----------------------------------------------------------------------------
'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  AlertCircle,
  CheckCircle,
  DollarSign,
  Gift,
  MapPin,
  Menu,
  Star,
  Users,
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
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

          {/* Desktop nav */}
          <nav className="hidden items-center space-x-1 lg:space-x-2 md:flex">
            <Button asChild variant="ghost" size="sm"><Link href="#features">Features</Link></Button>
            <Button asChild variant="ghost" size="sm"><Link href="#how-it-works">How&nbsp;It&nbsp;Works</Link></Button>
            <Button asChild variant="ghost" size="sm"><Link href="#pickup">Pickup&nbsp;&amp;&nbsp;Nearby</Link></Button>
            <Button asChild variant="ghost" size="sm"><Link href="#about">About</Link></Button>
            <Button asChild variant="ghost" size="sm"><Link href="#pricing">Pricing</Link></Button>
            <Button 
              asChild 
              size="sm"
              onClick={() => track('nav_book_now_clicked')}
            >
              <Link href="#pricing">Book&nbsp;Now</Link>
            </Button>
          </nav>

          {/* Mobile nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild><Button variant="ghost" size="icon"><Menu className="h-4 w-4" /><span className="sr-only">Toggle menu</span></Button></SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <nav className="mt-8 flex flex-col gap-4">
                  {[
                    ['#features', 'Features'],
                    ['#how-it-works', 'How It Works'],
                    ['#pickup', 'Pickup & Nearby'],
                    ['#about', 'About'],
                    ['#pricing', 'Pricing'],
                  ].map(([href, label]) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center border-b py-3 text-lg font-medium"
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
                <Button 
                  asChild 
                  className="mt-6 w-full bg-green-600 hover:bg-green-700"
                  onClick={() => track('mobile_nav_book_now_clicked')}
                >
                  <Link href="#pricing">Book&nbsp;Now</Link>
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* ───────────── Promotion banner ───────────── */}
      <div className="bg-yellow-500 py-2 px-4 text-black">
        <div className="container flex items-center justify-center gap-2 text-xs sm:text-sm font-medium md:text-base">
          <Gift className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="text-center">
            Limited&nbsp;Time:&nbsp;Free can of Penn tennis balls with purchase of 3 or 10 pack!
          </span>
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
            <div className="absolute inset-0 bg-gradient-to-r from-green-950/30 to-green-900/20" />
          </div>
          <div className="relative z-10 container px-4 text-center md:px-6">
            <h1 className="text-3xl font-bold tracking-tighter text-white text-shadow-lg sm:text-4xl md:text-5xl lg:text-6xl">
              Elevate&nbsp;Your&nbsp;Tennis&nbsp;Game
            </h1>
            <p className="mx-auto mt-4 max-w-[700px] text-xl text-white text-shadow-md md:text-2xl">
              Seattle tennis ball machine rental in Queen Anne, Seattle
            </p>
            <p className="mx-auto mt-2 max-w-[700px] text-white text-shadow-sm md:text-xl">
              Perfect your strokes with solo practice sessions on your schedule.
            </p>
            <div className="mt-4 space-x-4">
              <Button 
                asChild 
                size="lg" 
                className="bg-yellow-500 font-bold text-black shadow-lg hover:bg-yellow-600"
                onClick={() => track('hero_book_now_clicked')}
              >
                <Link href="#pricing">Book&nbsp;Now</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ─────────────── Features ─────────────── */}
        <section id="features" className="w-full bg-white py-12 md:py-24 lg:py-32">
          <div className="container px-4 text-center md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Features&nbsp;&amp;&nbsp;Benefits
            </h2>
            <p className="mx-auto mt-4 max-w-[900px] text-gray-500 md:text-xl">
              The Hydrogen Proton ball machine Seattle offers professional-grade training
              for Queen Anne tennis practice and players of all levels.
            </p>
            <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-2">
              <Image
                src="/action.png"
                width={500}
                height={500}
                alt="Hydrogen Proton ball machine in action on Seattle tennis court"
                className="aspect-square overflow-hidden rounded-xl object-cover"
              />
              <ul className="flex flex-col justify-center space-y-6">
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Practice&nbsp;Solo&nbsp;Anytime</h3>
                    <p className="text-gray-500">
                      No need for a hitting partner. Perfect your strokes
                      independently.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Improve&nbsp;Consistency</h3>
                    <p className="text-gray-500">
                      Repetitive drills help build muscle memory and perfect your
                      technique.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Try&nbsp;Before&nbsp;You&nbsp;Buy</h3>
                    <p className="text-gray-500">
                      Experience our professional ball machine before making your
                      purchase decision.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ─────────────── How it works ─────────────── */}
        <section id="how-it-works" className="w-full bg-gray-50 py-12 md:py-24 lg:py-32">
          <div className="container px-4 text-center md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              How&nbsp;It&nbsp;Works
            </h2>
            <p className="mx-auto mt-4 max-w-[900px] text-gray-500 md:text-xl">
              Renting a ball machine has never been easier
            </p>
            <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
              {[
                ['1', 'Select Your Time', 'Choose a session or package that fits your schedule.'],
                ['2', 'Easy Payment', 'Secure Stripe checkout with instant confirmation.'],
                ['3', 'Pick Up & Play', 'Collect the machine in Queen Anne, Seattle. Balls and basket included.'],
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
          </div>
        </section>

        {/* ─── Pickup + Nearby courts (merged) ─── */}
        <section id="pickup" className="w-full bg-white py-12 md:py-24 lg:py-32">
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
        <section className="w-full bg-gray-50 py-12 md:py-24 lg:py-32">
          <div className="container px-4 text-center md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              See&nbsp;It&nbsp;In&nbsp;Action
            </h2>
            <p className="mx-auto mt-4 max-w-[900px] text-gray-500 md:text-xl">
              Watch how the Hydrogen Proton ball machine operates.
            </p>
            <div className="mx-auto mt-12 grid max-w-5xl gap-12 items-center md:grid-cols-2">
              <div className="flex flex-col space-y-4">
                <h3 className="text-2xl font-bold">
                  Professional&nbsp;Training&nbsp;at&nbsp;Your&nbsp;Fingertips
                </h3>
                <p className="text-gray-500">
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
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
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
                    <Link href="#pricing">Book&nbsp;Your&nbsp;Session&nbsp;Now</Link>
                  </Button>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="relative h-[500px] w-[280px] overflow-hidden rounded-xl border-4 border-gray-800 bg-black p-1 shadow-xl">
                  <LiteYouTubeEmbed
                    id="FhzlDpDv3nM"
                    title="Seattle Ball Machine Rental Demo (Vertical)"
                    wrapperClass="yt-lite absolute top-0 left-0 h-full w-full rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── About section ─────────────── */}
        <section id="about" className="w-full bg-white py-12 md:py-24 lg:py-32">
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
        <section id="pricing" className="w-full bg-gray-50 py-12 md:py-24 lg:py-32">
          <div className="container px-4 text-center md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Rental&nbsp;Options
            </h2>
            <p className="mx-auto mt-4 max-w-[900px] text-gray-500 md:text-xl">
              Choose the option that works best for your schedule and budget.
            </p>
            <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
              {/* Single session */}
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Single Session</CardTitle>
                  <CardDescription>Perfect for occasional players</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">$40</span>
                      <span className="text-gray-500">/session</span>
                    </div>
                    <ul className="grid gap-2">
                      {[
                        '2 Hours of play time',
                        '75 balls included',
                        'Pickup basket included',
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <a
                    href="https://buy.stripe.com/bIY17w7UF9wzaqc8wx"
                    className="inline-flex w-full items-center justify-center rounded-md bg-green-600 py-2 px-4 font-bold text-white hover:bg-green-700"
                    onClick={() => track('stripe_checkout_clicked', {
                      package_type: 'single_session',
                      price: '$40'
                    })}
                  >
                    Book&nbsp;Single&nbsp;Session
                  </a>
                </CardFooter>
              </Card>

              {/* 3-pack */}
              <Card className="flex flex-col border-green-200 bg-green-50">
                <CardHeader>
                  <div className="mb-2 inline-block rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">
                    POPULAR
                  </div>
                  <CardTitle>3-Pack</CardTitle>
                  <CardDescription>Three 2-Hour Sessions</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">$105</span>
                      <span className="text-gray-500">total</span>
                    </div>
                    <p className="text-sm font-medium text-green-600">
                      $35 per session (Save $15)
                    </p>
                    <ul className="grid gap-2">
                      {[
                        '3 sessions of 2 hours each',
                        '75 balls included each session',
                        'Flexible scheduling',
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                      <li className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">
                          Free Penn tennis balls
                        </span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <a
                    href="https://buy.stripe.com/fZe6rQ7UF8svgOA7sx"
                    className="inline-flex w-full items-center justify-center rounded-md bg-green-600 py-2 px-4 font-bold text-white hover:bg-green-700"
                    onClick={() => track('stripe_checkout_clicked', {
                      package_type: '3_pack',
                      price: '$105'
                    })}
                  >
                    Buy&nbsp;3-Pack
                  </a>
                </CardFooter>
              </Card>

              {/* 10-pack */}
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>10-Pack</CardTitle>
                  <CardDescription>Ten 2-Hour Sessions</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">$300</span>
                      <span className="text-gray-500">total</span>
                    </div>
                    <p className="text-sm font-medium text-green-600">
                      $30 per session (Save $100)
                    </p>
                    <ul className="grid gap-2">
                      {[
                        '10 sessions of 2 hours each',
                        '75 balls included each session',
                        'Best value for regular players',
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                      <li className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">
                          Free Penn tennis balls
                        </span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <a
                    href="https://buy.stripe.com/eVa03sdeZaADaqcfZ4"
                    className="inline-flex w-full items-center justify-center rounded-md bg-green-600 py-2 px-4 font-bold text-white hover:bg-green-700"
                    onClick={() => track('stripe_checkout_clicked', {
                      package_type: '10_pack',
                      price: '$300'
                    })}
                  >
                    Buy&nbsp;10-Pack
                  </a>
                </CardFooter>
              </Card>
            </div>
            <p className="mt-4 text-center text-gray-500">
              All rentals include 75 balls &amp; a pickup basket. After successful
              payment, your Stripe confirmation will include the Calendly link for
              scheduling your session.
            </p>
          </div>
        </section>

        {/* ────────────── ─ CTA secti on ─────────────── */}
        <section className="w-full bg-green-600 py-12 md:py-24 lg:py-32">
          <div className="container px-4 text-center text-white md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready&nbsp;to&nbsp;Improve&nbsp;Your&nbsp;Game?
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] md:text-xl">
              Book your ball machine rental today and elevate your tennis practice.
            </p>
            <div className="mt-6">
              <Button 
                asChild 
                size="lg" 
                className="bg-yellow-500 font-bold text-black hover:bg-yellow-600"
                onClick={() => track('cta_section_book_now_clicked')}
              >
                <Link href="#pricing">Book&nbsp;Now</Link>
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
