// -----------------------------------------------------------------------------
// app/page.tsx  •  2025-04-24
// Seattle Ball Machine landing page
// -----------------------------------------------------------------------------
'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  DollarSign,
  Gift,
  MapPin,
  Menu,
  Star,
  Users,
  Clock,
} from 'lucide-react'

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

  return (
    <div className="flex min-h-screen flex-col">
      {/* ──────────────────────  NAV  ────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block text-lg font-bold md:text-xl">
              Seattle&nbsp;Ball&nbsp;Machine
            </span>
          </Link>

          {/* Desktop */}
          <nav className="hidden items-center space-x-2 md:flex">
            <Button asChild variant="ghost">
              <Link href="#features">Features</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="#how-it-works">How&nbsp;It&nbsp;Works</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="#pickup">Pickup&nbsp;&amp;&nbsp;Nearby</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="#about">About</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="#pricing">Pricing</Link>
            </Button>
            <Button asChild>
              <Link href="#pricing">Book&nbsp;Now</Link>
            </Button>
          </nav>

          {/* Mobile */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[240px] sm:w-[300px]">
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
                      className="flex items-center border-b py-2 text-lg font-medium"
                    >
                      {label}
                    </Link>
                  ))}
                </nav>

                <a
                  href="#pricing"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-green-600 py-2 px-4 font-bold text-white hover:bg-green-700"
                >
                  Book&nbsp;Now
                </a>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* ───────────────── Promotion banner ──────────────── */}
      <div className="bg-yellow-500 py-2 px-4 text-black">
        <div className="container flex items-center justify-center gap-2 text-sm font-medium md:text-base">
          <Gift className="h-4 w-4" />
          <span>
            Limited&nbsp;Time: Free can of Penn tennis balls with your first
            session!
          </span>
        </div>
      </div>

      <main className="flex-1">
        {/* ───────────────────── Hero ───────────────────── */}
        {/* … UNCHANGED HERO SECTION … */}

        {/* ─────────────────── Features ─────────────────── */}
        {/* … UNCHANGED FEATURES SECTION … */}

        {/* ──────────────── How it works ────────────────── */}
        {/* … UNCHANGED HOW-IT-WORKS SECTION … */}

        {/* ─── Pickup + Nearby courts (merged single-column) */}
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
                Easily accessible near local courts in upper Queen Anne. Check
                drive times below.
              </p>
            </div>

            <div className="mx-auto flex max-w-3xl flex-col gap-12">
              {/* Pickup text */}
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-green-600" />
                  <h3 className="text-2xl font-bold">Pickup Location Details</h3>
                </div>
                <p className="mt-2 text-lg text-gray-600">
                  The pickup area is located in upper Queen Anne, near{' '}
                  <span className="font-medium">W McGraw St &amp; 4th Ave W</span>.
                </p>
                <p className="mt-2 text-lg text-gray-600">
                  Look for landmarks like{' '}
                  <span className="font-medium">Bar Miriam</span> and{' '}
                  <span className="font-medium">Five Corners Hardware</span>.
                </p>
                <p className="mt-2 rounded-md border border-green-200 bg-green-50 p-3 text-lg font-semibold text-green-800">
                  <AlertCircle className="mb-1 mr-2 inline-block h-5 w-5 text-green-700" />
                  Detailed pickup instructions will be provided in your booking
                  confirmation email.
                </p>
              </div>

              {/* Nearby courts accordion */}
              <NearbyCourtsMapWidget />
            </div>
          </div>
        </section>

        {/* ──────────────────── Video ───────────────────── */}
        {/* … UNCHANGED VIDEO SECTION … */}

        {/* ─────────────────── About ────────────────────── */}
        {/* … UNCHANGED ABOUT SECTION … */}

        {/* ─────────────────── Pricing ──────────────────── */}
        {/* External Stripe links must be plain <a> tags */}
        {/* Only the CardFooter sections shown here for brevity; rest unchanged */}
        {/* ------------------------------------------------ */}
        {/* Single Session */}
        {/* (repeat the same pattern for 3-Pack and 10-Pack) */}
        {/* ------------------------------------------------ */}

        {/* ───────────────────── CTA ────────────────────── */}
        {/* … UNCHANGED CTA SECTION … */}
      </main>

      {/* ───────────────────── Footer ───────────────────── */}
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
