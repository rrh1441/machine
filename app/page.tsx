import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, ChevronRight, DollarSign, Gift, Star, Users } from "lucide-react" // Removed PlayCircle as it's no longer used

export default function LandingPage() {
  // Get the current year for the footer
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold text-xl">Seattle Ball Machine Rental</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Button asChild variant="ghost">
                <Link href="#features">Features</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="#how-it-works">How It Works</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="#pricing">Pricing</Link>
              </Button>
              <Button asChild>
                <Link href="/booking">Book Now</Link> {/* Ensure /booking route exists or update link */}
              </Button>
            </nav>
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
              src="/images/tennis-ball-hero.png" // Correct path as confirmed
              alt="Tennis ball on dark court background" // Slightly improved alt text
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-950/30 to-green-900/20" />
          </div>
          <div className="container relative z-10 px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white text-shadow-lg">
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
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold shadow-lg">
                  Check Availability & Book
                  <ChevronRight className="ml-2 h-4 w-4" />
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
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Features & Benefits</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The Hydrogen Proton ball machine offers professional-grade training for players of all levels
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <Image
                src="/action.jpg" // Image updated as discussed
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
            {/* Removed the horizontal video placeholder div that was here */}
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
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
                  <h3 className="text-xl font-bold">Pick Up & Play</h3>
                  <p className="text-gray-500">Pick up the machine in Queen Anne. Balls and basket included.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Demonstration Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">See It In Action</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Watch how easy it is to set up and use the Hydrogen Proton ball machine
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-12 py-12 md:grid-cols-2 items-center">
              <div className="flex flex-col space-y-4">
                <h3 className="text-2xl font-bold">Professional Training at Your Fingertips</h3>
                <p className="text-gray-500">
                  The Hydrogen Proton ball machine offers a variety of drills and settings to help you improve your
                  game. Watch as our demonstration shows how simple it is to:
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
                  <Button className="bg-green-600 hover:bg-green-700">Book Your Session Now</Button>
                </div>
              </div>
              <div className="flex justify-center">
                {/* YouTube Short embed within the phone frame */}
                <div className="relative w-[280px] h-[500px] bg-black rounded-xl overflow-hidden border-4 border-gray-800 shadow-xl p-1">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src="https://www.youtube.com/embed/VIDEO_ID2" // Your Short's Video ID
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

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Rental Options</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the option that works best for your schedule and budget
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
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
                  <Button className="w-full bg-green-600 hover:bg-green-700">Book Single Session</Button>
                </CardFooter>
              </Card>
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
                  <Button className="w-full bg-green-600 hover:bg-green-700">Buy 3-Pack & Schedule Later</Button>
                </CardFooter>
              </Card>
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
                  <Button className="w-full bg-green-600 hover:bg-green-700">Buy 10-Pack & Schedule Later</Button>
                </CardFooter>
              </Card>
            </div>
            <div className="text-center text-gray-500 mt-4">All rentals include 75 balls & pickup basket</div>

            {/* No-Hassle Guarantee */}
            <div className="max-w-3xl mx-auto mt-12 bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <AlertCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-800">Our No-Hassle Guarantee</h3>
                  <p className="text-green-700">
                    If something doesn't work with the machine or your plans change, we guarantee a full refund or free
                    reschedule. No questions asked. We want your experience to be perfect.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Customers Say</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Don't just take our word for it - hear from tennis players who've used our service
                </p>
              </div>
            </div>
            {/* Testimonials with avatars removed */}
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-500">
                      "The ball machine was perfect for my practice sessions. Easy pickup and return process, and the
                      machine worked flawlessly."
                    </p>
                    {/* Avatar Removed */}
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">Sarah T.</p>
                        <p className="text-sm text-gray-500">USTA 4.0 Player</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-500">
                      "I bought the 10-pack and it's been a game changer for my training. The variety of drills you can
                      set up is impressive."
                    </p>
                    {/* Avatar Removed */}
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">Michael R.</p>
                        <p className="text-sm text-gray-500">Club Player</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-500">
                      "Great service! I was considering buying this machine and renting it first helped me make my
                      decision. Highly recommend."
                    </p>
                    {/* Avatar Removed */}
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">Jennifer L.</p>
                        <p className="text-sm text-gray-500">Tennis Coach</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                  Check Availability & Book Now
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
            <Link href="#" className="text-sm text-gray-500 hover:underline"> {/* <-- Update link */}
              Support
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:underline"> {/* <-- Update link */}
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:underline"> {/* <-- Update link */}
              Terms of Service
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}