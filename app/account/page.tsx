'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AccountPage() {
  const [customer, setCustomer] = useState<any>(null)
  const [sessions, setSessions] = useState(0)
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get customer data from email in URL params
    const email = new URLSearchParams(window.location.search).get('email')
    if (email) {
      loadCustomerData(email)
    } else {
      setLoading(false)
    }
  }, [])

  const loadCustomerData = async (email: string) => {
    try {
      const { data: customer } = await supabase
        .from('customers')
        .select('*, session_credits(*), bookings(*)')
        .eq('email', email)
        .single()

      if (customer) {
        setCustomer(customer)
        const totalSessions = customer.session_credits.reduce(
          (sum: number, credit: any) => sum + credit.sessions_remaining, 0
        )
        setSessions(totalSessions)
        setBookings(customer.bookings)
      }
    } catch (error) {
      console.error('Error loading customer data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <p>Loading...</p>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>
        <p>Please provide your email to view your account.</p>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Session Credits</h2>
          <p className="text-3xl font-bold">{sessions}</p>
          <p className="text-gray-600">sessions remaining</p>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Contact Info</h2>
          <p className="font-semibold">{customer.name}</p>
          <p className="text-gray-600">{customer.email}</p>
          {customer.phone && <p className="text-gray-600">{customer.phone}</p>}
        </div>

        <div className="rounded-lg border p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
          {bookings.filter(b => b.status === 'scheduled' && new Date(b.booking_datetime) > new Date()).length === 0 ? (
            <p className="text-gray-600">No upcoming bookings</p>
          ) : (
            <div className="space-y-3">
              {bookings
                .filter(b => b.status === 'scheduled' && new Date(b.booking_datetime) > new Date())
                .sort((a, b) => new Date(a.booking_datetime).getTime() - new Date(b.booking_datetime).getTime())
                .map(booking => (
                  <div key={booking.id} className="border-l-4 border-green-600 pl-4 py-2">
                    <p className="font-semibold">
                      {new Date(booking.booking_datetime).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-gray-600">
                      {new Date(booking.booking_datetime).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                    {booking.calendly_reschedule_url && (
                      <div className="mt-2 space-x-3">
                        <a href={booking.calendly_reschedule_url} className="text-blue-600 hover:underline text-sm">
                          Reschedule
                        </a>
                        <a href={booking.calendly_cancel_url} className="text-red-600 hover:underline text-sm">
                          Cancel
                        </a>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Past Bookings</h2>
          {bookings.filter(b => b.status === 'scheduled' && new Date(b.booking_datetime) <= new Date()).length === 0 ? (
            <p className="text-gray-600">No past bookings</p>
          ) : (
            <div className="space-y-2">
              {bookings
                .filter(b => b.status === 'scheduled' && new Date(b.booking_datetime) <= new Date())
                .sort((a, b) => new Date(b.booking_datetime).getTime() - new Date(a.booking_datetime).getTime())
                .map(booking => (
                  <div key={booking.id} className="flex justify-between py-2 border-b">
                    <span>
                      {new Date(booking.booking_datetime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="text-gray-600">
                      {new Date(booking.booking_datetime).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}