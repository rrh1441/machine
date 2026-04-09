'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format, addDays, startOfDay, isBefore, isWithinInterval, parseISO } from 'date-fns'
import { Loader2, Clock, CalendarIcon } from 'lucide-react'
import { track } from '@vercel/analytics'

import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { BLOCKED_DATE_RANGES } from '@/lib/booking/constants'

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

export function AvailabilityPreview() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    // Default to tomorrow to avoid booking cutoff issues
    return addDays(startOfDay(new Date()), 1)
  })
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch availability when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailability(selectedDate)
    }
  }, [selectedDate])

  async function fetchAvailability(date: Date) {
    setLoading(true)
    setError(null)
    setSlots([])

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

  function handleDateSelect(date: Date | undefined) {
    if (date) {
      setSelectedDate(date)
      track('availability_preview_date_selected', {
        date: format(date, 'yyyy-MM-dd')
      })
    }
  }

  // Disable past dates, dates more than 30 days out, and blocked date ranges
  const disabledDays = (date: Date) => {
    const today = startOfDay(new Date())
    const maxDate = addDays(today, 30)

    // Check if date is in the past or too far in the future
    if (isBefore(date, today) || isBefore(maxDate, date)) {
      return true
    }

    // Check if date falls within a blocked date range
    const dateStr = format(date, 'yyyy-MM-dd')
    const isBlocked = BLOCKED_DATE_RANGES.some(range => {
      const rangeStart = parseISO(range.start)
      const rangeEnd = parseISO(range.end)
      const checkDate = parseISO(dateStr)
      return isWithinInterval(checkDate, { start: rangeStart, end: rangeEnd })
    })

    return isBlocked
  }

  const availableCount = slots.filter(s => s.available).length
  const bookedCount = slots.filter(s => !s.available).length

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      {/* Calendar */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4 text-club-green">
          <CalendarIcon className="h-5 w-5" />
          <span className="font-medium">Select a Date</span>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={disabledDays}
          className="border-2 border-club-green/20 bg-white"
        />
      </div>

      {/* Time Slots Preview */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-4 text-club-green">
          <Clock className="h-5 w-5" />
          <span className="font-medium">
            {selectedDate ? format(selectedDate, 'EEEE, MMMM d') : 'Available Times'}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-12 bg-white border-2 border-club-green/20">
            <Loader2 className="h-8 w-8 animate-spin text-club-green" />
          </div>
        ) : error ? (
          <div className="py-12 text-center bg-white border-2 border-club-green/20">
            <p className="text-gray-500">{error}</p>
          </div>
        ) : slots.length > 0 ? (
          <div className="bg-white border-2 border-club-green/20 p-4">
            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 border-2 border-club-green bg-club-green/10" />
                <span className="text-gray-600">Available ({availableCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 border-2 border-gray-300 bg-gray-100" />
                <span className="text-gray-600">Booked ({bookedCount})</span>
              </div>
            </div>

            {/* Slots Grid - Read Only */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((slot) => (
                <div
                  key={slot.start}
                  className={`h-10 flex items-center justify-center text-sm font-medium border-2 ${
                    slot.available
                      ? 'border-club-green/40 text-club-green bg-club-green/5'
                      : 'border-gray-300 text-gray-400 bg-gray-100'
                  }`}
                >
                  {slot.start}
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-gray-500 mt-4">
              Each session is 2 hours
            </p>
          </div>
        ) : (
          <div className="py-12 text-center bg-white border-2 border-club-green/20">
            <p className="text-gray-500">Select a date to view availability</p>
          </div>
        )}

        {/* CTA Button */}
        <div className="mt-6">
          <Button
            asChild
            size="lg"
            className="w-full bg-club-green hover:bg-[#265c3a] text-white font-semibold rounded-none"
          >
            <Link
              href="/book"
              onClick={() => track('availability_preview_book_clicked', {
                selectedDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null
              })}
            >
              Book Your Session
            </Link>
          </Button>
          <p className="text-center text-sm text-gray-500 mt-3">
            Purchase credits first, then book your time slot
          </p>
        </div>
      </div>
    </div>
  )
}
