// -----------------------------------------------------------------------------
// app/rentalbooking/page.tsx  •  2025-05-23
// Payment-success & scheduling page + referral-source popup (cookie-based)
// -----------------------------------------------------------------------------
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { v4 as uuidv4 } from 'uuid'
import Cookies from 'js-cookie'
import { MapPin, Mail, Phone } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient<{
  Tables: {
    referral_sources: {
      id: string
      browser_id: string
      source: 'search_engine' | 'friend' | 'first_serve_seattle'
      inserted_at: string
    }
  }
}>()

const COOKIE_NAME = 'sbm_browser_id'

export default function SuccessPage() {
  const currentYear = new Date().getFullYear()

  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Ensure stable browser ID and show popup on mount
  useEffect(() => {
    let id = Cookies.get(COOKIE_NAME)
    if (!id) {
      id = uuidv4()
      Cookies.set(COOKIE_NAME, id, { sameSite: 'lax', expires: 365 })
    }
    setOpen(true)
  }, [])

  async function handleSelect(
    source: 'search_engine' | 'friend' | 'first_serve_seattle',
  ) {
    if (submitting) return
    setSubmitting(true)

    const browser_id = Cookies.get(COOKIE_NAME) as string
    await supabase.from('referral_sources').insert({ source, browser_id })

    setSubmitting(false)
    setOpen(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* ─────────── NAV ─────────── */}
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
              <Link href="#calendar">Schedule&nbsp;Now</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* ─────────── MAIN ─────────── */}
      <main className="flex-1">
        {/* Success hero */}
        <section className="w-full bg-green-600 py-12 md:py-20 lg:py-24">
          <div className="container px-4 text-center text-white md:px-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Payment&nbsp;Successful&nbsp;—&nbsp;Let&rsquo;s&nbsp;Book&nbsp;Your&nbsp;Session!
            </h1>
            <p className="mx-auto mt-4 max-w-[720px] text-lg text-white/90 md:text-xl">
              Choose your preferred time below. You&rsquo;ll also receive a
              confirmation email with these details.
            </p>
          </div>
        </section>

        {/* Pickup location */}
        <section id="pickup" className="w-full bg-white py-12 md:py-20 lg:py-24">
          <div className="container flex flex-col items-center gap-6 px-4 text-center md:px-6">
            <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-700">
              Pickup&nbsp;Location
            </div>
            <div className="flex flex-col items-center gap-4">
              <MapPin className="h-8 w-8 text-green-600" />
              <p className="text-xl font-semibold">
                2116&nbsp;4th&nbsp;Avenue&nbsp;West<br />
                Seattle,&nbsp;WA&nbsp;98119
              </p>
              <p className="max-w-[600px] text-gray-600">
                I will leave the machine and bucket of balls on the porch, please
                return them to the same spot!
              </p>
            </div>
          </div>
        </section>

        {/* Maintenance banner */}
        <section className="w-full bg-orange-100 py-4">
          <div className="container px-4 text-center md:px-6">
            <p className="text-orange-800 font-medium">
              ⚠️ Ball machine will be unavailable from 6/16 to 6/25 because it's getting a tune up from the manufacturer
            </p>
          </div>
        </section>

        {/* Booking calendar */}
        <section id="calendar" className="w-full bg-gray-50 py-12 md:py-20 lg:py-24">
          <div className="container px-4 text-center md:px-6">
            <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-700">
              Step&nbsp;1&nbsp;·&nbsp;Schedule&nbsp;Your&nbsp;Time
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tighter sm:text-5xl">
              Pick&nbsp;an&nbsp;Available&nbsp;Slot
            </h2>
            <p className="mx-auto mt-4 max-w-[750px] text-gray-600 md:text-lg">
              All bookings are for <strong>2-hour</strong> sessions and include
              75&nbsp;balls&nbsp;+ basket.
            </p>

            <div className="mx-auto mt-10 w-full max-w-4xl">
              <div
                className="calendly-inline-widget"
                data-url="https://calendly.com/seattletennis/twohours"
                style={{ minWidth: '320px', height: '700px' }}
              />
            </div>
            <Script
              src="https://assets.calendly.com/assets/external/widget.js"
              strategy="lazyOnload"
            />
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="w-full bg-white py-12 md:py-20 lg:py-24">
          <div className="container px-4 text-center md:px-6">
            <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-700">
              Step&nbsp;2&nbsp;·&nbsp;Watch&nbsp;Setup&nbsp;Guide
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tighter sm:text-5xl">
              How&nbsp;It&nbsp;Works
            </h2>
            <p className="mx-auto mt-4 max-w-[750px] text-gray-600 md:text-lg">
              Quick 1-minute walkthrough. Install the Proton Control app for easy
              management!
            </p>
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

        {/* Contact */}
        <section id="contact" className="w-full bg-gray-50 py-12 md:py-20 lg:py-24">
          <div className="container flex flex-col items-center gap-6 px-4 text-center md:px-6">
            <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-700">
              Need&nbsp;Help?
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              We&rsquo;re&nbsp;Here&nbsp;to&nbsp;Assist
            </h2>
            <p className="mx-auto max-w-[650px] text-gray-600 md:text-lg">
              Reach out any time with questions about pickup, scheduling or
              equipment.
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

      {/* Footer */}
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

      {/* Referral-source popup */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>How&nbsp;did you hear about us?</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            <Button
              disabled={submitting}
              className="w-full"
              onClick={() => handleSelect('search_engine')}
            >
              Search&nbsp;Engine
            </Button>
            <Button
              disabled={submitting}
              className="w-full"
              onClick={() => handleSelect('friend')}
            >
              Friend
            </Button>
            <Button
              disabled={submitting}
              className="w-full"
              onClick={() => handleSelect('first_serve_seattle')}
            >
              First&nbsp;Serve&nbsp;Seattle
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}