'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Mail, Phone, Menu, Calendar as CalendarIcon, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
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
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 sm:h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block text-base font-bold sm:text-lg md:text-xl">
              Seattle&nbsp;Ball&nbsp;Machine
            </span>
          </Link>
          <nav className="hidden items-center space-x-2 md:flex">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">Home</Link>
            </Button>
          </nav>

          {/* Mobile nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <nav className="mt-8 flex flex-col gap-4">
                  <Link href="/" className="flex items-center border-b py-3 text-lg font-medium">
                    Home
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <section className="w-full bg-green-600 py-8 md:py-12">
          <div className="container px-4 text-center text-white md:px-6">
            <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
              Book Your Session
            </h1>
            <p className="mx-auto mt-2 max-w-[600px] text-white/90 md:text-lg">
              2-hour ball machine rental sessions
            </p>
          </div>
        </section>

        <section className="w-full py-8 md:py-12">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-2xl">

              {/* Progress indicator */}
              <div className="mb-8 flex justify-center gap-2">
                {(['email', 'date', 'time', 'confirm'] as const).map((s, i) => (
                  <div
                    key={s}
                    className={`h-2 w-12 rounded-full ${
                      step === s || (step === 'success' && i <= 3)
                        ? 'bg-green-600'
                        : ['email', 'date', 'time', 'confirm', 'success'].indexOf(step) > i
                        ? 'bg-green-600'
                        : 'bg-gray-200'
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
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
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
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Continue'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Date Selection */}
              {step === 'date' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
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
                      className="rounded-md border"
                    />
                  </CardContent>
                  <div className="px-6 pb-6">
                    <Button variant="outline" onClick={() => setStep('email')} className="w-full">
                      Back
                    </Button>
                  </div>
                </Card>
              )}

              {/* Step 3: Time Selection */}
              {step === 'time' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Select a Time
                    </CardTitle>
                    <CardDescription>
                      {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                      </div>
                    ) : slots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {slots.map((slot) => (
                          <Button
                            key={slot.start}
                            variant={slot.available ? 'outline' : 'ghost'}
                            className={`h-14 ${
                              slot.available
                                ? 'hover:bg-green-50 hover:border-green-500'
                                : 'opacity-50 cursor-not-allowed line-through'
                            }`}
                            disabled={!slot.available}
                            onClick={() => handleSlotSelect(slot)}
                          >
                            {slot.start} - {slot.end}
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
                    <Button variant="outline" onClick={() => setStep('date')} className="w-full">
                      Back - Choose Different Date
                    </Button>
                  </div>
                </Card>
              )}

              {/* Step 4: Confirmation */}
              {step === 'confirm' && selectedDate && selectedSlot && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Confirm Your Booking
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg bg-gray-50 p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date</span>
                        <span className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time</span>
                        <span className="font-medium">{selectedSlot.start} - {selectedSlot.end}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-medium">2 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email</span>
                        <span className="font-medium">{email}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-4">
                      <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Pickup Location</p>
                        <p className="text-sm text-gray-600">2116 4th Avenue West, Seattle, WA 98119</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setStep('time')} className="flex-1">
                        Back
                      </Button>
                      <Button
                        onClick={handleConfirmBooking}
                        className="flex-1 bg-green-600 hover:bg-green-700"
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
                <Card>
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
                    <CardDescription>
                      A confirmation email has been sent to {email}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg bg-gray-50 p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date</span>
                        <span className="font-medium">
                          {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time</span>
                        <span className="font-medium">
                          {selectedSlot?.start} - {selectedSlot?.end}
                        </span>
                      </div>
                      {sessionsAvailable !== null && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sessions Remaining</span>
                          <span className="font-medium">{sessionsAvailable}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-4">
                      <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Pickup Location</p>
                        <p className="text-sm text-gray-600">2116 4th Avenue West, Seattle, WA 98119</p>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button asChild variant="outline" className="flex-1">
                        <Link href={bookingResult.booking.rescheduleUrl}>Reschedule</Link>
                      </Button>
                      <Button asChild variant="outline" className="flex-1">
                        <Link href={bookingResult.booking.cancelUrl}>Cancel</Link>
                      </Button>
                    </div>

                    <Button onClick={resetForm} className="w-full">
                      Book Another Session
                    </Button>
                  </CardContent>
                </Card>
              )}

            </div>
          </div>
        </section>

        {/* Contact section */}
        <section className="w-full bg-gray-50 py-8 md:py-12">
          <div className="container flex flex-col items-center gap-4 px-4 text-center md:px-6">
            <h2 className="text-xl font-bold">Need Help?</h2>
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
              <a href="mailto:support@firstserveseattle.com" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <Mail className="h-4 w-4" />
                support@firstserveseattle.com
              </a>
              <a href="tel:+12532529577" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <Phone className="h-4 w-4" />
                (253) 252-9577
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-white py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} Seattle Ball Machine Rental. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/support" className="text-sm text-gray-500 hover:underline">Support</Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:underline">Privacy</Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:underline">Terms</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
