'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Mail, Phone, Menu, Calendar as CalendarIcon, Clock, CheckCircle, AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addDays, isBefore, startOfDay } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface TimeSlot {
  start: string
  end: string
  available: boolean
}

interface AvailabilityResponse {
  date: string
  dayOfWeek: number
  businessHours: { start: string; end: string } | null
  slots: TimeSlot[]
  error?: string
}

interface BookingResult {
  success: boolean
  booking?: {
    id: string
    date: string
    time: string
    cancelUrl: string
    rescheduleUrl: string
  }
  sessionsRemaining?: number
  error?: string
}

type Step = 'email' | 'date' | 'time' | 'confirm' | 'success'

export default function BookPage() {
  const currentYear = new Date().getFullYear()

  // Form state
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)

  // Loading/error state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [sessionsAvailable, setSessionsAvailable] = useState<number | null>(null)

  // Booking result
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null)

  // Fetch availability when date is selected
  useEffect(() => {
    if (selectedDate) {
      fetchAvailability(selectedDate)
    }
  }, [selectedDate])

  async function fetchAvailability(date: Date) {
    setLoading(true)
    setError(null)
    setSlots([])
    setSelectedSlot(null)

    try {
      const dateStr = format(date, 'yyyy-MM-dd')
      const res = await fetch(`/api/booking/availability?date=${dateStr}`)
      const data: AvailabilityResponse = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        setSlots(data.slots)
        if (data.slots.length === 0) {
          setError('No available slots for this date')
        }
      }
    } catch {
      setError('Failed to fetch availability')
    } finally {
      setLoading(false)
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setError(null)

    // For now, we'll validate the customer exists when they try to book
    // Just move to date selection
    setStep('date')
    setLoading(false)
  }

  function handleDateSelect(date: Date | undefined) {
    setSelectedDate(date)
    if (date) {
      setStep('time')
    }
  }

  function handleSlotSelect(slot: TimeSlot) {
    if (!slot.available) return
    setSelectedSlot(slot)
    setStep('confirm')
  }

  function handlePreviousDay() {
    if (!selectedDate) return
    const prevDay = addDays(selectedDate, -1)
    const today = startOfDay(new Date())
    if (!isBefore(prevDay, today)) {
      setSelectedDate(prevDay)
    }
  }

  function handleNextDay() {
    if (!selectedDate) return
    const nextDay = addDays(selectedDate, 1)
    const maxDate = addDays(startOfDay(new Date()), 30)
    if (!isBefore(maxDate, nextDay)) {
      setSelectedDate(nextDay)
    }
  }

  // Check if we can navigate to prev/next day
  const canGoPrevious = selectedDate && !isBefore(addDays(selectedDate, -1), startOfDay(new Date()))
  const canGoNext = selectedDate && !isBefore(addDays(startOfDay(new Date()), 30), addDays(selectedDate, 1))

  async function handleConfirmBooking() {
    if (!selectedDate || !selectedSlot) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/booking/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          date: format(selectedDate, 'yyyy-MM-dd'),
          startTime: selectedSlot.start
        })
      })

      const data: BookingResult = await res.json()

      if (data.success) {
        setBookingResult(data)
        setSessionsAvailable(data.sessionsRemaining ?? null)
        setStep('success')
      } else {
        setError(data.error || 'Failed to create booking')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setStep('email')
    setEmail('')
    setSelectedDate(undefined)
    setSelectedSlot(null)
    setError(null)
    setSlots([])
    setBookingResult(null)
  }

  // Disable past dates and dates more than 30 days out
  const disabledDays = (date: Date) => {
    const today = startOfDay(new Date())
    const maxDate = addDays(today, 30)
    return isBefore(date, today) || isBefore(maxDate, date)
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b-2 border-club-green bg-club-cream">
        <div className="container flex h-16 items-center justify-between px-4 md:px-[5%]">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-lg font-bold tracking-tight text-club-green uppercase md:text-xl">
              Seattle Ball Machine
            </span>
          </Link>
          <nav className="hidden items-center space-x-2 md:flex">
            <Button asChild variant="ghost" size="sm" className="text-club-green hover:bg-club-green/10">
              <Link href="/">Home</Link>
            </Button>
          </nav>

          {/* Mobile nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-club-green">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-club-cream">
                <nav className="mt-8 flex flex-col gap-4">
                  <Link href="/" className="flex items-center border-b border-club-green/20 py-3 text-lg font-medium text-club-green">
                    Home
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-club-cream">
        <section className="w-full bg-club-green py-10 md:py-14">
          <div className="container px-4 text-center text-club-cream md:px-[5%]">
            <span className="text-court-clay font-bold uppercase tracking-[2px] text-sm mb-3 block">
              Schedule Your Time
            </span>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl">
              Book Your Session
            </h1>
            <p className="mx-auto mt-3 max-w-[600px] text-club-cream/80 md:text-lg">
              2-hour ball machine rental sessions
            </p>
          </div>
        </section>

        <section className="w-full py-10 md:py-14">
          <div className="container px-4 md:px-[5%]">
            <div className="mx-auto max-w-2xl">

              {/* Progress indicator */}
              <div className="mb-10 flex justify-center gap-2">
                {(['email', 'date', 'time', 'confirm'] as const).map((s, i) => (
                  <div
                    key={s}
                    className={`h-1.5 w-14 ${
                      step === s || (step === 'success' && i <= 3)
                        ? 'bg-club-green'
                        : ['email', 'date', 'time', 'confirm', 'success'].indexOf(step) > i
                        ? 'bg-club-green'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Step 1: Email */}
              {step === 'email' && (
                <Card className="border-2 border-club-green bg-white shadow-[8px_8px_0_#1a472a]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-serif text-xl text-club-green">
                      <Mail className="h-5 w-5" />
                      Enter Your Email
                    </CardTitle>
                    <CardDescription>
                      Use the email address from your session purchase
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="border-club-green/30 focus:border-club-green"
                        />
                      </div>
                      <Button type="submit" className="w-full bg-club-green hover:bg-[#265c3a] rounded-none" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Continue'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Date Selection */}
              {step === 'date' && (
                <Card className="border-2 border-club-green bg-white shadow-[8px_8px_0_#1a472a]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-serif text-xl text-club-green">
                      <CalendarIcon className="h-5 w-5" />
                      Select a Date
                    </CardTitle>
                    <CardDescription>
                      Choose your preferred day (next 30 days)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={disabledDays}
                      className="border-2 border-club-green/20"
                    />
                  </CardContent>
                  <div className="px-6 pb-6">
                    <Button variant="outline" onClick={() => setStep('email')} className="w-full border-club-green text-club-green hover:bg-club-green/10 rounded-none">
                      Back
                    </Button>
                  </div>
                </Card>
              )}

              {/* Step 3: Time Selection */}
              {step === 'time' && (
                <Card className="border-2 border-club-green bg-white shadow-[8px_8px_0_#1a472a]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-serif text-xl text-club-green">
                      <Clock className="h-5 w-5" />
                      Select a Start Time
                    </CardTitle>
                    <CardDescription className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handlePreviousDay}
                          disabled={!canGoPrevious || loading}
                          className="h-8 w-8 text-club-green hover:bg-club-green/10 disabled:opacity-30"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <span className="font-medium text-club-green min-w-[200px] text-center">
                          {selectedDate && format(selectedDate, 'EEE, MMM d, yyyy')}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleNextDay}
                          disabled={!canGoNext || loading}
                          className="h-8 w-8 text-club-green hover:bg-club-green/10 disabled:opacity-30"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </div>
                      <span className="block text-court-clay font-medium">2-hour session</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-club-green" />
                      </div>
                    ) : slots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                        {slots.map((slot) => (
                          <Button
                            key={slot.start}
                            variant={slot.available ? 'outline' : 'ghost'}
                            className={`h-12 text-sm font-medium ${
                              slot.available
                                ? 'border-club-green/40 hover:bg-club-green hover:text-white hover:border-club-green'
                                : 'opacity-40 cursor-not-allowed text-gray-400'
                            }`}
                            disabled={!slot.available}
                            onClick={() => handleSlotSelect(slot)}
                          >
                            {slot.start}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">
                        No available times for this date
                      </p>
                    )}
                  </CardContent>
                  <div className="px-6 pb-6">
                    <Button variant="outline" onClick={() => setStep('date')} className="w-full border-club-green text-club-green hover:bg-club-green/10 rounded-none">
                      Back - Choose Different Date
                    </Button>
                  </div>
                </Card>
              )}

              {/* Step 4: Confirmation */}
              {step === 'confirm' && selectedDate && selectedSlot && (
                <Card className="border-2 border-club-green bg-white shadow-[8px_8px_0_#1a472a]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-serif text-xl text-club-green">
                      <CheckCircle className="h-5 w-5 text-club-green" />
                      Confirm Your Booking
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-club-green/20 bg-club-cream p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date</span>
                        <span className="font-medium text-club-green">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time</span>
                        <span className="font-medium text-club-green">{selectedSlot.start} - {selectedSlot.end}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-medium text-club-green">2 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email</span>
                        <span className="font-medium text-club-green">{email}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 border-2 border-club-green/20 bg-club-cream p-4">
                      <MapPin className="h-5 w-5 text-court-clay mt-0.5" />
                      <div>
                        <p className="font-medium text-club-green">Pickup Location</p>
                        <p className="text-sm text-gray-600">2116 4th Avenue West, Seattle, WA 98119</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setStep('time')} className="flex-1 border-club-green text-club-green hover:bg-club-green/10 rounded-none">
                        Back
                      </Button>
                      <Button
                        onClick={handleConfirmBooking}
                        className="flex-1 bg-club-green hover:bg-[#265c3a] rounded-none"
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Booking'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 5: Success */}
              {step === 'success' && bookingResult?.booking && (
                <div className="space-y-6">
                  <Card className="border-2 border-club-green bg-white shadow-[8px_8px_0_#1a472a]">
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-club-green">
                        <CheckCircle className="h-10 w-10 text-white" />
                      </div>
                      <CardTitle className="font-serif text-2xl text-club-green">Booking Confirmed!</CardTitle>
                      <CardDescription>
                        A confirmation email has been sent to {email}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border-2 border-club-green/20 bg-club-cream p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date</span>
                          <span className="font-medium text-club-green">
                            {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time</span>
                          <span className="font-medium text-club-green">
                            {selectedSlot?.start} - {selectedSlot?.end}
                          </span>
                        </div>
                        {sessionsAvailable !== null && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Sessions Remaining</span>
                            <span className="font-medium text-club-green">{sessionsAvailable}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-start gap-3 border-2 border-club-green/20 bg-club-cream p-4">
                        <MapPin className="h-5 w-5 text-court-clay mt-0.5" />
                        <div>
                          <p className="font-medium text-club-green">Pickup Location</p>
                          <p className="text-sm text-gray-600">2116 4th Avenue West, Seattle, WA 98119</p>
                          <p className="text-xs text-gray-500 mt-1">Machine and balls will be on the porch</p>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button asChild variant="outline" className="flex-1 border-club-green text-club-green hover:bg-club-green/10 rounded-none">
                          <Link href={bookingResult.booking.rescheduleUrl}>Reschedule</Link>
                        </Button>
                        <Button asChild variant="outline" className="flex-1 border-club-green text-club-green hover:bg-club-green/10 rounded-none">
                          <Link href={bookingResult.booking.cancelUrl}>Cancel</Link>
                        </Button>
                      </div>
                      <p className="text-xs text-center text-gray-500">Changes must be made at least 2 hours before your session</p>

                      <Button onClick={resetForm} className="w-full bg-club-green hover:bg-[#265c3a] rounded-none">
                        Book Another Session
                      </Button>
                    </CardContent>
                  </Card>

                  {/* How It Works Video */}
                  <Card className="border-2 border-club-green bg-white">
                    <CardHeader className="text-center pb-2">
                      <span className="text-court-clay font-bold uppercase tracking-[2px] text-xs mb-1 block">
                        Setup Guide
                      </span>
                      <CardTitle className="font-serif text-xl text-club-green">How It Works</CardTitle>
                      <CardDescription>
                        Quick 1-minute walkthrough before your session
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative aspect-video w-full overflow-hidden border-2 border-club-green/20">
                        <iframe
                          src="https://www.loom.com/embed/ce70d3812a404ec1af3bbabde67a7ad6?sid=981b366e-a2d2-4c64-81d3-eb26163d3b7a"
                          title="Seattle Ball Machine – How it Works"
                          frameBorder={0}
                          allowFullScreen
                          className="absolute inset-0 h-full w-full"
                        />
                      </div>
                      <p className="text-sm text-gray-600 text-center mt-3">
                        Install the <strong>Proton Control</strong> app for easy management
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

            </div>
          </div>
        </section>

        {/* Contact section */}
        <section className="w-full bg-club-cream border-t-2 border-club-green/20 py-10 md:py-14">
          <div className="container flex flex-col items-center gap-4 px-4 text-center md:px-[5%]">
            <h2 className="font-serif text-xl text-club-green">Need Help?</h2>
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
              <a href="mailto:support@firstserveseattle.com" className="flex items-center gap-2 text-gray-600 hover:text-club-green transition-colors">
                <Mail className="h-4 w-4" />
                support@firstserveseattle.com
              </a>
              <a href="tel:+12532529577" className="flex items-center gap-2 text-gray-600 hover:text-club-green transition-colors">
                <Phone className="h-4 w-4" />
                (253) 252-9577
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 bg-club-cream py-10">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-[5%]">
          <div className="text-center md:text-left">
            <p className="font-serif text-lg text-club-green font-bold">Seattle Ball Machine</p>
            <p className="text-sm text-gray-500 mt-1">
              &copy; {currentYear}. Keep your eye on the ball.
            </p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/support" className="text-sm text-gray-500 hover:text-club-green transition-colors">Support</Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-club-green transition-colors">Privacy</Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-club-green transition-colors">Terms</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
