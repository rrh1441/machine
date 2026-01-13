// -----------------------------------------------------------------------------
// app/guide/page.tsx  •  2025-01-13
// Post-booking guide for Seattle Ball Machine
// -----------------------------------------------------------------------------
'use client'

import Link from 'next/link'
import { MapPin, Mail, Phone } from 'lucide-react'

import { Button } from '@/components/ui/button'
import LiteYouTubeEmbed from 'react-lite-youtube-embed'
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'

export default function BookingGuidePage() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="flex min-h-screen flex-col bg-club-cream">
      {/* ───────────────────── NAV ───────────────────── */}
      <header className="w-full border-b-2 border-club-green bg-club-cream">
        <div className="container flex h-16 items-center justify-between px-4 md:px-[5%]">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-lg font-bold tracking-tight text-club-green uppercase md:text-xl">
              Seattle Ball Machine
            </span>
          </Link>
          <Button
            asChild
            size="sm"
            className="bg-club-green hover:bg-[#265c3a] text-white font-semibold rounded-sm px-6"
          >
            <Link href="/book">Book a Session</Link>
          </Button>
        </div>
      </header>

      {/* ───────────────────── MAIN ───────────────────── */}
      <main className="flex-1">
        {/* ───────────── Hero ───────────── */}
        <section className="w-full bg-club-cream py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-[5%] max-w-3xl mx-auto text-center">
            <span className="text-court-clay font-bold uppercase tracking-[2px] text-sm mb-4 block">
              You're All Set
            </span>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight text-club-green mb-4">
              Here's What to Know
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Review pickup details, watch the quick setup guide, and reach out if you have any questions.
            </p>
          </div>
        </section>

        {/* ───────────── Pickup + Video Grid ───────────── */}
        <section className="w-full bg-club-cream pb-16 md:pb-24">
          <div className="container px-4 md:px-[5%] max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">

              {/* Pickup Location */}
              <div className="bg-white border-2 border-club-green p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-6 w-6 text-club-green flex-shrink-0" />
                  <h2 className="font-serif text-xl md:text-2xl text-club-green">Pickup Location</h2>
                </div>
                <p className="text-lg font-semibold text-gray-800 mb-1">
                  2116 4th Avenue West
                </p>
                <p className="text-lg font-semibold text-gray-800 mb-4">
                  Seattle, WA 98119
                </p>
                <p className="text-gray-600 mb-6">
                  The machine and bucket of balls will be waiting on the porch. Please return them to the same spot when you're done.
                </p>
                <a
                  href="https://maps.google.com/?q=2116+4th+Avenue+West+Seattle+WA+98119"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-club-green font-semibold hover:underline"
                >
                  Open in Maps &rarr;
                </a>
              </div>

              {/* Video */}
              <div className="bg-white border-2 border-club-green p-6 md:p-8">
                <h2 className="font-serif text-xl md:text-2xl text-club-green mb-4">Setup Guide</h2>
                <p className="text-gray-600 mb-4">
                  A quick walkthrough of the Hydrogen Proton. We recommend installing the <strong>Proton Control</strong> app for easy session management.
                </p>
                <div className="relative aspect-[9/16] w-full max-w-[200px] mx-auto overflow-hidden rounded-sm border border-gray-200 bg-black">
                  <LiteYouTubeEmbed
                    id="Jt105BS5T24"
                    title="Seattle Ball Machine – How it Works"
                    wrapperClass="yt-lite absolute top-0 left-0 h-full w-full"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ───────────── Contact ───────────── */}
        <section className="w-full bg-white py-12 md:py-16">
          <div className="container px-4 md:px-[5%] max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-2xl md:text-3xl text-club-green mb-4">
              Need Help?
            </h2>
            <p className="text-gray-600 mb-6">
              Questions about pickup, return, or the machine? Get in touch.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <a
                href="mailto:support@firstserveseattle.com"
                className="flex items-center gap-2 text-gray-800 hover:text-club-green transition-colors"
              >
                <Mail className="h-5 w-5 text-club-green" />
                support@firstserveseattle.com
              </a>
              <a
                href="tel:+12532529577"
                className="flex items-center gap-2 text-gray-800 hover:text-club-green transition-colors"
              >
                <Phone className="h-5 w-5 text-club-green" />
                (253) 252-9577
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ─────────────── Footer ─────────────── */}
      <footer className="w-full border-t border-gray-200 bg-club-cream py-8">
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
