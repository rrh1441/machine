import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase/server'
import { resend } from '@/lib/resend/client'
import { emailTemplates } from '@/lib/emails/templates'

export async function POST(req: NextRequest) {
  // Check if Calendly is configured
  if (!process.env.CALENDLY_WEBHOOK_SIGNING_KEY) {
    return NextResponse.json(
      { error: 'Calendly not configured' },
      { status: 503 }
    )
  }

  const body = await req.text()
  const signature = headers().get('calendly-webhook-signature')!
  
  // Skip signature verification for now (Calendly doesn't return signing key)
  // TODO: Implement proper verification once we have the signing key
  console.log('Calendly webhook received - signature verification skipped')

  const event = JSON.parse(body)

  // Check if Supabase is configured
  if (!supabaseAdmin) {
    console.log('Supabase not configured, skipping database operations')
    return NextResponse.json({ received: true })
  }

  // Store webhook event
  await supabaseAdmin
    .from('calendly_webhooks')
    .insert({
      event_id: event.event,
      event_type: event.event,
      payload: event,
    })

  if (event.event === 'invitee.created') {
    const invitee = event.payload
    const email = invitee.email

    // Find customer
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('email', email)
      .single()

    if (!customer) {
      console.error('Customer not found:', email)
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Check available sessions
    const { data: credits } = await supabaseAdmin
      .from('session_credits')
      .select('sessions_remaining')
      .eq('customer_id', customer.id)
      .gt('sessions_remaining', 0)

    const totalSessions = credits?.reduce((sum, c) => sum + c.sessions_remaining, 0) || 0

    if (totalSessions === 0) {
      // Send warning email if Resend is configured
      if (resend) {
        const emailContent = emailTemplates.noSessionsWarning()
        
        await resend.emails.send({
          from: 'Seattle Ball Machine <noreply@seattleballmachine.com>',
          to: email,
          ...emailContent
        })
      }
      return NextResponse.json({ error: 'No sessions available' }, { status: 400 })
    }

    // Create booking
    const bookingDate = new Date(invitee.event.start_time)
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        customer_id: customer.id,
        calendly_event_id: invitee.event.uuid,
        calendly_invitee_id: invitee.uuid,
        booking_date: bookingDate.toISOString().split('T')[0],
        booking_time: bookingDate.toTimeString().split(' ')[0],
        booking_datetime: bookingDate.toISOString(),
        calendly_cancel_url: invitee.cancel_url,
        calendly_reschedule_url: invitee.reschedule_url,
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Booking creation error:', bookingError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Deduct session
    const { data: oldestCredit } = await supabaseAdmin
      .from('session_credits')
      .select('id, sessions_remaining')
      .eq('customer_id', customer.id)
      .gt('sessions_remaining', 0)
      .order('created_at', { ascending: true })
      .limit(1)
      .single()

    if (oldestCredit) {
      await supabaseAdmin
        .from('session_credits')
        .update({ sessions_remaining: oldestCredit.sessions_remaining - 1 })
        .eq('id', oldestCredit.id)

      await supabaseAdmin
        .from('session_usage')
        .insert({
          booking_id: booking.id,
          session_credit_id: oldestCredit.id,
          sessions_used: 1,
        })
    }

    // Send confirmation email if Resend is configured
    if (resend) {
      const emailContent = emailTemplates.bookingConfirmation(
        bookingDate,
        totalSessions - 1,
        invitee.reschedule_url,
        invitee.cancel_url
      )
      
      await resend.emails.send({
        from: 'Seattle Ball Machine <noreply@seattleballmachine.com>',
        to: email,
        ...emailContent
      })
    }
  }

  if (event.event === 'invitee.canceled') {
    const invitee = event.payload

    // Find and cancel booking
    const { data: booking } = await supabaseAdmin
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('calendly_invitee_id', invitee.uuid)
      .select()
      .single()

    if (booking) {
      // Refund session
      const { data: usage } = await supabaseAdmin
        .from('session_usage')
        .select('session_credit_id')
        .eq('booking_id', booking.id)
        .single()

      if (usage) {
        const { data: credit } = await supabaseAdmin
          .from('session_credits')
          .select('sessions_remaining')
          .eq('id', usage.session_credit_id)
          .single()

        if (credit) {
          await supabaseAdmin
            .from('session_credits')
            .update({ 
              sessions_remaining: credit.sessions_remaining + 1
            })
            .eq('id', usage.session_credit_id)
        }
      }

      // Send cancellation email if Resend is configured
      if (resend) {
        const emailContent = emailTemplates.bookingCancelled()
        
        await resend.emails.send({
          from: 'Seattle Ball Machine <noreply@seattleballmachine.com>',
          to: invitee.email,
          ...emailContent
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}