'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AlertCircle, CheckCircle, ChevronRight, DollarSign, Gift, MapPin, Menu, Star, Users, Timer } from "lucide-react"

export default function LandingPage() {
  // Get the current year for the footer
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation - Improved for Mobile */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold text-lg md:text-xl">Seattle Ball Machine</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <Button asChild variant="ghost">
                <Link href="#features">Features</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="#how-it-works">How It Works</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="#pickup">Pickup</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="#about">About</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="#pricing">Pricing</Link>
              </Button>
              <Button asChild>
                <Link href="#pricing">Book Now</Link>
              </Button>
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link href="#features" className="flex items-center py-2 text-lg font-medium border-b">
                      Features
                    </Link>
                    <Link href="#how-it-works" className="flex items-center py-2 text-lg font-medium border-b">
                      How It Works
                    </Link>
                    <Link href="#pickup" className="flex items-center py-2 text-lg font-medium border-b">
                      Pickup
                    </Link>
                    <Link href="#about" className="flex items-center py-2 text-lg font-medium border-b">
                      About
                    </Link>
                    <Link href="#pricing" className="flex items-center py-2 text-lg font-medium border-b">
                      Pricing
                    </Link>
                    <Button asChild className="mt-4">
                      <Link href="#pricing">Book Now</Link>
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Promotion Banner */}
      <div className="bg-yellow-500 text-black py-2 px-4">
        <div className="container flex items-center justify-center gap-2 text-sm md:text-base font-medium">
          <Gift className="h-4 w-4" />
          <span>Limited Time: Free can of Penn tennis balls with your first session!</span>
        </div>
      </div>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/tennis-ball-hero.png"
              alt="Tennis ball on dark court background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-950/30 to-green-900/20" />
          </div>
          <div className="container relative z-10 px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-white text-shadow-lg">
                  Elevate Your Tennis Game
                </h1>
                <p className="mx-auto max-w-[700px] text-white text-xl md:text-2xl text-shadow-md">
                  Rent a Professional Ball Machine in Queen Anne, Seattle
                </p>
              </div>
              <p className="mx-auto max-w-[700px] text-white md:text-xl text-shadow-sm">
                Perfect your strokes with solo practice sessions on your schedule. The Hydrogen Proton ball machine
                delivers consistent, customizable drills.
              </p>
              <div className="space-x-4 pt-2">
                <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold shadow-lg">
                  <Link href="#pricing">
                    Check Availability &amp; Book
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Features &amp; Benefits</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl lg:text-base xl:text-xl">
                  The Hydrogen Proton ball machine offers professional-grade training for players of all levels
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <Image
                src="/action.png"
                width={500}
                height={500}
                alt="Hydrogen Proton ball machine in action on a court"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full"
              />
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Practice Solo Anytime</h3>
                      <p className="text-gray-500">
                        No need for a hitting partner. Perfect your strokes on your own schedule.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
                      <Star className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Improve Consistency</h3>
                      <p className="text-gray-500">
                        Repetitive drills help build muscle memory and improve your technique.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Try Before You Buy</h3>
                      <p className="text-gray-500">
                        Experience the $1700 Hydrogen Proton before making a purchase decision.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl lg:text-base xl:text-xl">
                  Renting a ball machine has never been easier
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center h-full">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <span className="text-2xl font-bold text-green-600">1</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Select Your Time</h3>
                  <p className="text-gray-500">Choose a single session or purchase a package for multiple rentals.</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center h-full">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Easy Payment</h3>
                  <p className="text-gray-500">Secure online payment via Stripe with instant confirmation.</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center h-full">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Pick Up &amp; Play</h3>
                  <p className="text-gray-500">Pick up the machine in Queen Anne, Seattle. Balls and basket included.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pick Up Location Section */}
        <section id="pickup" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-700">
                  Pickup
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Convenient Queen Anne Pickup
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl lg:text-base xl:text-xl">
                  Easy access right in the neighborhood, close to local courts.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="flex justify-center items-center">
                <Image
                  src="/courts.png"
                  width={450}
                  height={550}
                  alt="Map showing pickup location in Queen Anne, Seattle near David Rodgers Park"
                  className="overflow-hidden rounded-xl object-contain shadow-lg border"
                />
              </div>
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <h3 className="text-2xl font-bold">Location Details</h3>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    The general pickup area is located in upper Queen Anne, Seattle, near the corner of
                    <span className="font-medium"> W McGraw St &amp; 4th Ave W</span>.
                  </p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    You'll find us close to local landmarks like <span className="font-medium">Bar Miriam</span> and <span className="font-medium">Five Corners Hardware</span>.
                  </p>
                  <p className="text-gray-600 text-lg leading-relaxed font-semibold text-green-800 bg-green-50 p-3 rounded-md border border-green-200">
                    <AlertCircle className="inline-block h-5 w-5 mr-2 mb-1 text-green-700" />
                    For privacy, the exact street address and detailed pickup instructions will be provided in your booking confirmation email after payment.
                  </p>
                </div>
                <div className="pt-2">
                  <Button asChild>
                    <Link href="#pricing">Book Now</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Demonstration Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  See It In Action
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl lg:text-base xl:text-xl">
                  Watch how easy it is to set up and use the Hydrogen Proton ball machine
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-12 py-12 md:grid-cols-2 items-center">
              <div className="flex flex-col space-y-4">
                <h3 className="text-2xl font-bold">
                  Professional Training at Your Fingertips
                </h3>
                <p className="text-gray-500">
                  The Hydrogen Proton ball machine offers a variety of drills and settings to help you improve your game. Watch as our demonstration shows how simple it is to:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>Set up different shot patterns and trajectories</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>Adjust ball speed and frequency</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>Practice both groundstrokes and volleys</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>Easily transport the lightweight machine</span>
                  </li>
                </ul>
                <div className="pt-4">
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link href="#pricing">Book Your Session Now</Link>
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-[280px] h-[500px] bg-black rounded-xl overflow-hidden border-4 border-gray-800 shadow-xl p-1">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src="https://www.youtube.com/embed/FhzlDpDv3nM"
                    title="Seattle Ball Machine Rental Demo (Vertical)"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Me Section */}
        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">About Me</h2>
              <Image
                src="/aboutme.png"
                alt="Photo of the site owner"
                width={128}
                height={128}
                className="rounded-full object-cover border-4 border-white shadow-md"
              />
              <div className="max-w-3xl mx-auto space-y-4">
                <p className="text-gray-600 md:text-xl">
                  When I started playing tennis in New York, a local spot had a ball machine for quick sessions before work. After moving to Seattle, finding time for practice became much harder, especially with a young family. That's when I purchased this Hydrogen Proton ball machine.
                </p>
                <p className="text-gray-600 md:text-xl font-medium">
                  Since I only use it occasionally, I'm making it available to the Seattle tennis community so others can benefit from consistent, quality practice. My hope is that it helps you improve your game just as it has helped mine!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Rental Options</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl lg:text-base xl:text-xl">
                  Choose the option that works best for your schedule and budget
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
              {/* Single Session Card */}
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
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>2 Hours of play time</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>75 balls included</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Pickup basket included</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">Free Penn tennis balls (first session)</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                    <Link href="https://buy.stripe.com/bIY17w7UF9wzaqc8wx" legacyBehavior>
                      <a>Book Single Session</a>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              {/* 3-Pack Card */}
              <Card className="flex flex-col border-green-200 bg-green-50">
                <CardHeader>
                  <div className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-2">
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
                    <div className="text-sm text-green-600 font-medium">$35 per session (Save $15)</div>
                    <ul className="grid gap-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>3 sessions of 2 hours each</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>75 balls included each time</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Flexible scheduling</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">Free Penn tennis balls (first session)</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                    <Link href="https://buy.stripe.com/fZe6rQ7UF8svgOA7sx" legacyBehavior>
                      <a>Buy 3-Pack</a>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              {/* 10-Pack Card */}
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
                    <div className="text-sm text-green-600 font-medium">$30 per session (Save $100)</div>
                    <ul className="grid gap-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>10 sessions of 2 hours each</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>75 balls included each time</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Best value for regular players</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">Free Penn tennis balls (first session)</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                    <Link href="https://buy.stripe.com/eVa03sdeZaADaqcfZ4" legacyBehavior>
                      <a>Buy 10-Pack</a>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="text-center text-gray-500 mt-4">
              All rentals include 75 balls &amp; pickup basket. After successful payment, check your Stripe confirmation message for the Calendly link to book your session.
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Improve Your Game?
                </h2>
                <p className="mx-auto max-w-[700px] md:text-xl">
                  Book your ball machine rental today and take your tennis to the next level.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                  <Link href="#pricing">Book Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-white py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
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
  );
}