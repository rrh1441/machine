'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { format, addDays, isBefore, startOfDay } from 'date-fns'
import { Calendar as CalendarIcon, CheckCircle, Clock, Loader2, XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { AlertCircle } from 'lucide-react'

interface TimeSlot {
  start: string
  end: string
  available: boolean
}

type Step = 'email' | 'date' | 'time' | 'success'

function ReschedulePageContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('id')

  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        setSlots(data.slots)
      }
    } catch {
      setError('Failed to fetch availability')
    } finally {
      setLoading(false)
    }
  }

  async function handleReschedule() {
    if (!bookingId || !selectedDate || !selectedSlot) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/booking/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          email: email.toLowerCase().trim(),
          newDate: format(selectedDate, 'yyyy-MM-dd'),
          newStartTime: selectedSlot.start
        })
      })

      const data = await res.json()

      if (data.success) {
        setStep('success')
      } else {
        setError(data.error || 'Failed to reschedule')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const disabledDays = (date: Date) => {
    const today = startOfDay(new Date())
    const maxDate = addDays(today, 30)
    return isBefore(date, today) || isBefore(maxDate, date)
  }

  if (!bookingId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <CardTitle>Invalid Link</CardTitle>
            <CardDescription>No booking ID was provided in the URL.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/book">Book a New Session</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle>Booking Rescheduled!</CardTitle>
            <CardDescription>
              Your booking has been updated. A confirmation email has been sent.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">New Date</span>
                <span className="font-medium">
                  {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New Time</span>
                <span className="font-medium">{selectedSlot?.start} - {selectedSlot?.end}</span>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link href="/">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 'email' && (
          <Card>
            <CardHeader>
              <CardTitle>Reschedule Booking</CardTitle>
              <CardDescription>Enter your email to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); setStep('date'); }} className="space-y-4">
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
                <Button type="submit" className="w-full">
                  Continue
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/">Cancel</Link>
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'date' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Select New Date
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date)
                  if (date) setStep('time')
                }}
                disabled={disabledDays}
                className="rounded-md border"
              />
              <Button variant="outline" onClick={() => setStep('email')} className="mt-4 w-full">
                Back
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'time' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Select New Time
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
                <div className="grid grid-cols-2 gap-3">
                  {slots.map((slot) => (
                    <Button
                      key={slot.start}
                      variant={selectedSlot?.start === slot.start ? 'default' : 'outline'}
                      className={`h-14 ${
                        slot.available
                          ? selectedSlot?.start === slot.start
                            ? 'bg-green-600'
                            : 'hover:bg-green-50 hover:border-green-500'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot.start} - {slot.end}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No available times</p>
              )}

              <div className="mt-4 flex gap-3">
                <Button variant="outline" onClick={() => setStep('date')} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleReschedule}
                  disabled={!selectedSlot || loading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function ReschedulePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <ReschedulePageContent />
    </Suspense>
  )
}
