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
  Gift,
  MapPin,
  Quote,
} from 'lucide-react'
import { track } from '@vercel/analytics'

import { Button } from '@/components/ui/button'
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
      <header className="w-full border-b-2 border-club-green bg-club-cream">
        <div className="container flex h-16 items-center justify-between px-4 md:px-[5%]">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-lg font-bold tracking-tight text-club-green uppercase md:text-xl">
              Seattle Ball Machine
            </span>
          </Link>

          {/* Book Now button */}
          <Button
            asChild
            size="sm"
            className="bg-club-green hover:bg-[#265c3a] text-white font-semibold rounded-sm px-6"
            onClick={() => track('nav_book_now_clicked')}
          >
            <Link href="#pricing">Reserve Court Time</Link>
          </Button>
        </div>
      </header>


      <main className="flex-1 bg-club-cream">
        {/* ───────────────── Hero ───────────────── */}
        <section className="relative w-full py-16 md:py-20 lg:py-24 bg-club-cream">
          <div className="container px-4 md:px-[5%]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center max-w-[1200px] mx-auto">
              {/* Hero Text */}
              <div className="text-center md:text-left">
                <span className="text-court-clay font-bold uppercase tracking-[2px] text-sm mb-4 block">
                  Serving Queen Anne & Seattle
                </span>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-club-green mb-6">
                  Your Perfect Hitting Partner.
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-[450px] mx-auto md:mx-0">
                  Always on time. Never judges your backhand. Ready when you are.
                  Experience the best practice session of your life.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-club-green hover:bg-transparent hover:text-club-green border-2 border-club-green text-white font-semibold text-lg px-10 py-6 rounded-none transition-all hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[3px_3px_0_rgba(26,71,42,0.2)]"
                  onClick={() => track('hero_book_now_clicked')}
                >
                  <Link href="#pricing">Book Your Session</Link>
                </Button>
                <p className="mt-5 text-sm text-gray-500 italic">
                  *Fits in the passenger seat of any car.
                </p>
              </div>

              {/* Hero Image with Retro Shadow */}
              <div className="relative">
                <div
                  className="w-full h-[300px] md:h-[450px] lg:h-[550px] bg-cover bg-center border border-rich-black shadow-[15px_15px_0_#1a472a]"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2070&auto=format&fit=crop')"
                  }}
                  role="img"
                  aria-label="Tennis player practicing on court"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── Why Rent? ─────────────── */}
        <section id="features" className="w-full bg-club-cream py-16 md:py-24 lg:py-28">
          <div className="container px-4 md:px-[5%] max-w-[1000px] mx-auto text-center">
            <span className="text-court-clay font-bold uppercase tracking-[2px] text-sm mb-4 block">
              Why Rent?
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-club-green mb-12 md:mb-16">
              Less Hassle. More Tennis.
            </h2>

            <div className="grid gap-10 md:gap-12 md:grid-cols-3 text-left">
              {/* Benefit Card 1 */}
              <div>
                <h3 className="font-serif text-2xl md:text-[1.8rem] mb-4 pb-4 relative">
                  The "Flake" Factor
                  <span className="absolute bottom-0 left-0 w-10 h-[3px] bg-court-clay" />
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Partners cancel. Traffic happens. The machine is always ready to go.
                  Find a court, pick it up, and hit 500 balls in an hour.
                </p>
              </div>

              {/* Benefit Card 2 */}
              <div>
                <h3 className="font-serif text-2xl md:text-[1.8rem] mb-4 pb-4 relative">
                  Groove Your Stroke
                  <span className="absolute bottom-0 left-0 w-10 h-[3px] bg-court-clay" />
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  You can't fix a backhand hitting one every 5 minutes. You need repetition.
                  Set the drill, lock in, and build muscle memory.
                </p>
              </div>

              {/* Benefit Card 3 */}
              <div>
                <h3 className="font-serif text-2xl md:text-[1.8rem] mb-4 pb-4 relative">
                  A Cardio Beast
                  <span className="absolute bottom-0 left-0 w-10 h-[3px] bg-court-clay" />
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Want to sweat? Set the "Sweeps" drill. It runs you corner to corner
                  until you drop. Better than a treadmill, way more fun.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── How it works (Green Strip) ─────────────── */}
        <section id="how-it-works" className="w-full bg-club-green text-club-cream py-16 md:py-20">
          <div className="container px-4 md:px-[5%]">
            <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between gap-10 md:gap-8">
              {/* Step 1 */}
              <div className="flex-1 border-t md:border-t-0 md:border-l border-white/20 pt-5 md:pt-0 md:pl-6">
                <span className="font-serif text-6xl md:text-7xl opacity-30 leading-none block mb-3">01</span>
                <h4 className="text-xl md:text-[1.4rem] font-semibold mb-2">Book Online</h4>
                <p className="text-club-cream/80">
                  Select your time slot. No phone calls, no membership fees required.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex-1 border-t md:border-t-0 md:border-l border-white/20 pt-5 md:pt-0 md:pl-6">
                <span className="font-serif text-6xl md:text-7xl opacity-30 leading-none block mb-3">02</span>
                <h4 className="text-xl md:text-[1.4rem] font-semibold mb-2">Pickup</h4>
                <p className="text-club-cream/80">
                  Grab the machine from our Queen Anne location. It's lightweight and portable.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex-1 border-t md:border-t-0 md:border-l border-white/20 pt-5 md:pt-0 md:pl-6">
                <span className="font-serif text-6xl md:text-7xl opacity-30 leading-none block mb-3">03</span>
                <h4 className="text-xl md:text-[1.4rem] font-semibold mb-2">Play</h4>
                <p className="text-club-cream/80">
                  Control everything from your phone. Spin, speed, and drills at a tap.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Pickup + Nearby courts (merged) ─── */}
        <section id="pickup" className="w-full bg-club-cream py-16 md:py-24 lg:py-28">
          <div className="container px-4 md:px-[5%]">
            <div className="mb-12 text-center">
              <span className="text-court-clay font-bold uppercase tracking-[2px] text-sm mb-4 block">
                Pickup & Nearby
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-club-green">
                Queen Anne Pickup & Nearby Courts
              </h2>
              <p className="mx-auto mt-4 max-w-[900px] text-lg text-gray-600 md:text-xl">
                Our Seattle tennis ball machine rental is easily accessible in upper Queen Anne (near W McGraw St & 4th Ave W).
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
                  className="bg-club-green hover:bg-[#265c3a] font-semibold rounded-sm"
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
                    See Today&rsquo;s Open Courts
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── Video section ─────────────── */}
        <section className="w-full bg-white py-16 md:py-24 lg:py-28 overflow-hidden">
          <div className="container px-4 md:px-[5%] text-center">
            <span className="text-court-clay font-bold uppercase tracking-[2px] text-sm mb-4 block">
              See It In Action
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-club-green">
              Watch the Machine Work
            </h2>
            <p className="mx-auto mt-4 max-w-[900px] text-gray-600 text-base md:text-xl">
              See how the Hydrogen Proton ball machine operates.
            </p>
            <div className="mx-auto mt-10 md:mt-14 grid max-w-5xl gap-10 md:gap-14 items-center md:grid-cols-2">
              {/* Video first on mobile, second on desktop */}
              <div className="flex justify-center order-1 md:order-2">
                <div className="relative h-[400px] w-[225px] sm:h-[500px] sm:w-[280px] overflow-hidden rounded-sm border-2 border-club-green bg-black p-1 shadow-[10px_10px_0_#1a472a]">
                  <LiteYouTubeEmbed
                    id="FhzlDpDv3nM"
                    title="Seattle Ball Machine Rental Demo (Vertical)"
                    wrapperClass="yt-lite absolute top-0 left-0 h-full w-full rounded-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-4 text-center md:text-left order-2 md:order-1">
                <h3 className="font-serif text-2xl md:text-3xl text-club-green">
                  Professional Training at Your Fingertips
                </h3>
                <p className="text-gray-600 text-base md:text-lg">
                  With a variety of drills and settings, practice your strokes and
                  improve your game.
                </p>
                <ul className="mt-4 space-y-3 inline-block mx-auto md:mx-0">
                  {[
                    'Set up various shot patterns',
                    'Adjust ball speed and frequency',
                    'Practice groundstrokes and volleys',
                    'Lightweight and easy to transport',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-base text-left">
                      <CheckCircle className="h-5 w-5 text-club-green flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Button
                    asChild
                    className="bg-club-green hover:bg-transparent hover:text-club-green border-2 border-club-green text-white font-semibold rounded-none transition-all"
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
        <section id="about" className="w-full bg-club-cream py-16 md:py-24 lg:py-28">
          <div className="container px-4 md:px-[5%] text-center">
            <span className="text-court-clay font-bold uppercase tracking-[2px] text-sm mb-4 block">
              About Me
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-club-green">
              The Story Behind the Machine
            </h2>
            <div className="mt-8 flex flex-col items-center space-y-6">
              <Image
                src="/aboutme.png"
                alt="Seattle Ball Machine Rental owner and tennis enthusiast"
                width={128}
                height={128}
                className="rounded-full object-cover border-4 border-club-green shadow-md"
              />
              <div className="max-w-3xl space-y-4">
                <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
                  When I started playing tennis in New York, a local spot had a
                  ball machine for quick sessions before work. After moving to
                  Seattle, finding time for practice was a challenge—until I
                  purchased the Hydrogen Proton.
                </p>
                <p className="font-medium text-gray-700 text-lg md:text-xl leading-relaxed">
                  I now rent the machine to help the Seattle tennis community
                  improve their game with consistent, quality practice.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── Pricing section ─────────────── */}
        <section id="pricing" className="w-full bg-white py-16 md:py-24 lg:py-28">
          <div className="container px-4 md:px-[5%] text-center">
            <span className="text-court-clay font-bold uppercase tracking-[2px] text-sm mb-4 block">
              Pricing
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-club-green mb-12">
              Simple, Transparent Pricing
            </h2>
            <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
              {/* Single session */}
              <div className="relative bg-white border-2 border-club-green p-8 md:p-10">
                <div className="absolute top-2.5 left-2.5 right-2.5 bottom-2.5 border border-gray-200 pointer-events-none" />
                <h3 className="font-serif text-xl mb-2">Single Session</h3>
                <p className="text-gray-500 text-sm mb-4">Cheaper than a one-hour private lesson</p>
                <div className="font-serif text-5xl text-club-green my-5">
                  $40 <span className="text-base font-sans text-gray-500">/ session</span>
                </div>
                <ul className="space-y-2 text-left mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-club-green flex-shrink-0" />
                    <span>2 hours of play time</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-club-green flex-shrink-0" />
                    <span>Perfect for first-timers</span>
                  </li>
                </ul>
                <a
                  href="https://buy.stripe.com/dRm7sN3Ou7RVgK696PgIo00?client_reference_id=single&metadata[package_type]=single&metadata[sessions_count]=1"
                  className="block w-full bg-club-green text-white py-3 px-4 font-semibold text-center hover:bg-[#265c3a] transition-colors"
                  onClick={() => track('stripe_checkout_clicked', {
                    package_type: 'single_session',
                    price: '$40'
                  })}
                >
                  Book Single Session
                </a>
              </div>

              {/* 3-pack */}
              <div className="relative bg-white border-2 border-club-green p-8 md:p-10 shadow-[8px_8px_0_#1a472a]">
                <div className="absolute top-2.5 left-2.5 right-2.5 bottom-2.5 border border-gray-200 pointer-events-none" />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-club-green text-white text-xs font-bold px-4 py-1">
                  MOST POPULAR
                </div>
                <h3 className="font-serif text-xl mb-2 mt-2">3-Pack</h3>
                <p className="text-gray-500 text-sm mb-4">Buy two, get third half off</p>
                <div className="font-serif text-5xl text-club-green my-5">
                  $105 <span className="text-base font-sans text-gray-500">total</span>
                </div>
                <p className="text-sm font-medium text-club-green mb-4">$35 per session</p>
                <ul className="space-y-2 text-left mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-club-green flex-shrink-0" />
                    <span>3 sessions of 2 hours each</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-club-green flex-shrink-0" />
                    <span>Flexible scheduling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-court-clay flex-shrink-0" />
                    <span className="font-medium">Free Penn tennis balls</span>
                  </li>
                </ul>
                <a
                  href="https://buy.stripe.com/fZubJ3bgWfkn0L8cj1gIo01?client_reference_id=3_pack&metadata[package_type]=3_pack&metadata[sessions_count]=3"
                  className="block w-full bg-club-green text-white py-3 px-4 font-semibold text-center hover:bg-[#265c3a] transition-colors"
                  onClick={() => track('stripe_checkout_clicked', {
                    package_type: '3_pack',
                    price: '$105'
                  })}
                >
                  Buy 3-Pack
                </a>
              </div>

              {/* 10-pack */}
              <div className="relative bg-white border-2 border-club-green p-8 md:p-10">
                <div className="absolute top-2.5 left-2.5 right-2.5 bottom-2.5 border border-gray-200 pointer-events-none" />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-600 text-white text-xs font-bold px-4 py-1">
                  BEST VALUE
                </div>
                <h3 className="font-serif text-xl mb-2 mt-2">10-Pack</h3>
                <p className="text-gray-500 text-sm mb-4">Lowest per-session cost</p>
                <div className="font-serif text-5xl text-club-green my-5">
                  $300 <span className="text-base font-sans text-gray-500">total</span>
                </div>
                <p className="text-sm font-medium text-club-green mb-4">$30 per session</p>
                <ul className="space-y-2 text-left mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-club-green flex-shrink-0" />
                    <span>10 sessions of 2 hours each</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-club-green flex-shrink-0" />
                    <span>Best for regular players</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-court-clay flex-shrink-0" />
                    <span className="font-medium">Free Penn tennis balls</span>
                  </li>
                </ul>
                <a
                  href="https://buy.stripe.com/6oU3cxfxc5JN8dA82LgIo02?client_reference_id=10_pack&metadata[package_type]=10_pack&metadata[sessions_count]=10"
                  className="block w-full bg-club-green text-white py-3 px-4 font-semibold text-center hover:bg-[#265c3a] transition-colors"
                  onClick={() => track('stripe_checkout_clicked', {
                    package_type: '10_pack',
                    price: '$300'
                  })}
                >
                  Buy 10-Pack
                </a>
              </div>
            </div>

            {/* What's Included */}
            <div className="mx-auto mt-16 max-w-3xl">
              <h3 className="font-serif text-2xl text-club-green mb-6">What&apos;s Included</h3>
              <div className="bg-club-cream border-2 border-club-green p-8 text-left">
                <p className="text-gray-600 mb-4">Before you book, here&apos;s exactly what you get:</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-club-green flex-shrink-0" />
                    <span>Hydrogen Proton ball machine (fully charged)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-club-green flex-shrink-0" />
                    <span>65 tennis balls</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-club-green flex-shrink-0" />
                    <span>Ball hopper / pickup basket</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-club-green flex-shrink-0" />
                    <span>App-based remote control</span>
                  </li>
                </ul>
                <p className="mt-4 text-gray-700 font-medium">Everything you need to train immediately.</p>
              </div>
            </div>

            {/* SwingStick Add-on */}
            <div className="mx-auto mt-12 max-w-4xl">
              <div className="border-2 border-club-green bg-white p-6 md:p-8">
                <div className="flex flex-col items-center gap-6 md:flex-row">
                  <div className="relative h-48 w-48 flex-shrink-0 overflow-hidden border border-club-green bg-gray-100">
                    <Image
                      src="/swingstick.JPG"
                      alt="SwingStick sensor for tracking tennis stats"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 192px, 192px"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-court-clay font-bold uppercase tracking-[2px] text-xs mb-2 block">
                      Optional Add-On
                    </span>
                    <h3 className="font-serif text-2xl text-club-green">Track Your Stats Like a Pro</h3>
                    <p className="mt-2 text-gray-600">
                      Want data with your reps? Add the SwingStick sensor to measure swing speed, track contact patterns, and monitor consistency over time.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-club-green mt-0.5 flex-shrink-0" />
                        <span>Works with SwingVision app on your iPhone</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-club-green mt-0.5 flex-shrink-0" />
                        <span>Pairs easily with your session</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-club-green mt-0.5 flex-shrink-0" />
                        <span>Ideal for players focused on measurable improvement</span>
                      </li>
                    </ul>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-baseline gap-1">
                        <span className="font-serif text-3xl text-club-green">$10</span>
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
        <section className="w-full bg-club-cream py-16 md:py-24 lg:py-28">
          <div className="container px-4 md:px-[5%]">
            <span className="text-court-clay font-bold uppercase tracking-[2px] text-sm mb-4 block text-center">
              Testimonials
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-club-green text-center">
              What Players Are Saying
            </h2>
            <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
              <div className="bg-white border-2 border-club-green p-8">
                <Quote className="h-8 w-8 text-club-green mb-4" />
                <p className="font-serif text-lg text-gray-700 italic leading-relaxed">
                  &ldquo;Finally fixed my backhand. Having consistent feeds made a huge difference.&rdquo;
                </p>
                <p className="mt-6 font-semibold text-club-green">— Sarah T., Queen Anne</p>
              </div>
              <div className="bg-white border-2 border-club-green p-8">
                <Quote className="h-8 w-8 text-club-green mb-4" />
                <p className="font-serif text-lg text-gray-700 italic leading-relaxed">
                  &ldquo;Way more productive than just hitting around. Super easy pickup and setup.&rdquo;
                </p>
                <p className="mt-6 font-semibold text-club-green">— Mark L., Seattle</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── FAQ ─────────────── */}
        <section className="w-full bg-white py-16 md:py-24 lg:py-28">
          <div className="container px-4 md:px-[5%]">
            <span className="text-court-clay font-bold uppercase tracking-[2px] text-sm mb-4 block text-center">
              FAQ
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-club-green text-center">
              Common Questions
            </h2>
            <div className="mx-auto mt-12 max-w-3xl">
              <Accordion type="single" collapsible className="w-full border-t border-club-green">
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
                    No problem. Easy cancellation with full refund or rescheduling for any weather-related issues.
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
        <section className="w-full bg-club-green py-16 md:py-24 lg:py-28">
          <div className="container px-4 md:px-[5%] text-center text-club-cream">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
              Ready to Train?
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] md:text-xl text-club-cream/80">
              Stop waiting for partners or open clinics. Get focused reps and real improvement on your schedule.
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="bg-tennis-yellow font-bold text-black hover:bg-[#d4f545] text-lg px-8 py-6 rounded-none"
                onClick={() => track('cta_section_book_now_clicked')}
              >
                <Link href="#pricing">Reserve Your Session</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* ─────────────── Footer ─────────────── */}
      <footer className="w-full border-t border-gray-200 bg-club-cream py-10">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-[5%]">
          <div className="text-center md:text-left">
            <p className="font-serif text-lg text-club-green font-bold">Seattle Ball Machine</p>
            <p className="text-sm text-gray-500 mt-1">
              © {currentYear}. Keep your eye on the ball.
            </p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/support" className="text-sm text-gray-500 hover:text-club-green transition-colors">
              Support
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-club-green transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-club-green transition-colors">
              Terms of Service
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
