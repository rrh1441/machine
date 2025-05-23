// -----------------------------------------------------------------------------
// app/guide/page.tsx  •  2025-05-23
// Post-booking guide for Seattle Ball Machine
// -----------------------------------------------------------------------------
'use client'

import Link from 'next/link'
import { MapPin, PlayCircle, Mail, Phone } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function BookingGuidePage() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="flex min-h-screen flex-col">
      {/* ───────────────────── NAV ───────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block text-lg font-bold md:text-xl">
              Seattle&nbsp;Ball&nbsp;Machine
            </span>
          </Link>
          <nav className="hidden items-center space-x-2 md:flex">
            <Button asChild variant="ghost">
              <Link href="/">Home</Link>
            </Button>
            <Button asChild>
              <Link href="/#pricing">Book&nbsp;Another</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* ───────────────────── MAIN ───────────────────── */}
      <main className="flex-1">
        {/* ───────────── Confirmation hero ───────────── */}
        <section className="w-full bg-green-600 py-12 md:py-20 lg:py-24">
          <div className="container px-4 text-center text-white md:px-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Booking&nbsp;Confirmed&nbsp;—&nbsp;Here&rsquo;s&nbsp;What&nbsp;to&nbsp;Know
            </h1>
            <p className="mx-auto mt-4 max-w-[720px] text-lg text-white/90 md:text-xl">
              Review pickup details, watch the quick setup guide, and reach out if
              you have any questions.
            </p>
          </div>
        </section>

        {/* ───────────── Pickup location ───────────── */}
        <section
          id="pickup"
          className="w-full bg-white py-12 md:py-20 lg:py-24"
        >
          <div className="container flex flex-col items-center gap-6 px-4 text-center md:px-6">
            <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-700">
              Step&nbsp;1&nbsp;·&nbsp;Pickup&nbsp;Location
            </div>
            <div className="flex flex-col items-center gap-4">
              <MapPin className="h-8 w-8 text-green-600" />
              <p className="text-xl font-semibold">
                2116&nbsp;4th&nbsp;Avenue&nbsp;West<br />
                Seattle,&nbsp;WA&nbsp;98119
              </p>
              <p className="max-w-[600px] text-gray-600">
                The machine and bucket of balls will be waiting on the porch.
                Please return them to the same spot when you&rsquo;re done.
              </p>
            </div>
          </div>
        </section>

        {/* ───────────── How it works ───────────── */}
        <section
          id="how-it-works"
          className="w-full bg-gray-50 py-12 md:py-20 lg:py-24"
        >
          <div className="container px-4 text-center md:px-6">
            <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-700">
              Step&nbsp;2&nbsp;·&nbsp;Watch&nbsp;Setup&nbsp;Guide
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tighter sm:text-5xl">
              How&nbsp;It&nbsp;Works
            </h2>
            <p className="mx-auto mt-4 max-w-[750px] text-gray-600 md:text-lg">
              A quick 1-minute walkthrough of the Hydrogen&nbsp;Proton. We
              recommend installing the Proton&nbsp;Control app from Hydrogen
              Sports for easy session management.
            </p>

            {/* Video embed */}
            <div className="relative mx-auto mt-10 aspect-video w-full max-w-4xl overflow-hidden rounded-xl shadow-lg">
              <iframe
                src="https://www.loom.com/embed/ce70d3812a404ec1af3bbabde67a7ad6?sid=981b366e-a2d2-4c64-81d3-eb26163d3b7a"
                title="Seattle Ball Machine – How it Works"
                frameBorder={0}
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </section>

        {/* ───────────── Contact ───────────── */}
        <section
          id="contact"
          className="w-full bg-white py-12 md:py-20 lg:py-24"
        >
          <div className="container flex flex-col items-center gap-6 px-4 text-center md:px-6">
            <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-700">
              Need&nbsp;Help?
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              We&rsquo;re&nbsp;Here&nbsp;to&nbsp;Assist
            </h2>
            <p className="mx-auto max-w-[650px] text-gray-600 md:text-lg">
              Questions about pickup, return, or the machine? Get in touch.
            </p>
            <div className="flex flex-col items-center gap-4">
              <p className="flex items-center gap-2 text-lg font-medium">
                <Mail className="h-5 w-5 text-green-600" />
                <a
                  href="mailto:support@firstserveseattle.com"
                  className="hover:underline"
                >
                  support@firstserveseattle.com
                </a>
              </p>
              <p className="flex items-center gap-2 text-lg font-medium">
                <Phone className="h-5 w-5 text-green-600" />
                <a href="tel:+12532529577" className="hover:underline">
                  (253)&nbsp;252-9577
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ───────────── Footer ───────────── */}
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