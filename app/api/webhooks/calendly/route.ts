import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase/server'
import { resend } from '@/lib/resend/client'
import { emailTemplates } from '@/lib/emails/templates'

export async function POST(req: NextRequest) {
  console.log('=== Calendly Webhook Received ===')
  console.log('Timestamp:', new Date().toISOString())
  
  const body = await req.text()
  const signature = headers().get('calendly-webhook-signature')
  
  console.log('Signature present:', !!signature)
  console.log('Signing key configured:', !!process.env.CALENDLY_WEBHOOK_SIGNING_KEY)
  
  // Calendly signature verification (optional but recommended)
  // Note: The signing_key should be provided when creating the webhook subscription
  // If you don't have it, you can still process webhooks but with reduced security
  if (process.env.CALENDLY_WEBHOOK_SIGNING_KEY && process.env.CALENDLY_WEBHOOK_SIGNING_KEY !== 'temporarily_disabled') {
    if (!signature) {
      console.error('No Calendly signature header found')
      return NextResponse.json({ error: 'No signature' }, { status: 401 })
    }
    
    const hmac = crypto.createHmac('sha256', process.env.CALENDLY_WEBHOOK_SIGNING_KEY)
    hmac.update(body)
    const expectedSignature = hmac.digest('base64')
    
    if (signature !== `v1=${expectedSignature}`) {
      console.error('Invalid Calendly webhook signature')
      console.error('Expected:', `v1=${expectedSignature}`)
      console.error('Received:', signature)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
    console.log('Calendly webhook signature verified')
  } else {
    console.log('Calendly webhook received - signature verification disabled')
  }

  const event = JSON.parse(body)
  console.log('Event type:', event.event)
  console.log('Event payload email:', event.payload?.email || 'not found')

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
    console.log('Processing invitee.created event')
    const invitee = event.payload
    const email = invitee.email
    console.log('Looking for customer with email:', email)

    // Find customer
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('email', email)
      .single()

    if (customerError || !customer) {
      console.error('Customer not found:', email)
      console.error('Error details:', customerError)
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }
    
    console.log('Found customer:', customer.id)

    // Check available sessions
    const { data: credits, error: creditsError } = await supabaseAdmin
      .from('session_credits')
      .select('sessions_remaining')
      .eq('customer_id', customer.id)
      .gt('sessions_remaining', 0)

    console.log('Credits query result:', credits)
    console.log('Credits query error:', creditsError)

    const totalSessions = credits?.reduce((sum, c) => sum + c.sessions_remaining, 0) || 0
    console.log('Total sessions available:', totalSessions)

    if (totalSessions === 0) {
      console.log('No sessions available for customer')
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
    const { data: oldestCredit, error: creditFetchError } = await supabaseAdmin
      .from('session_credits')
      .select('id, sessions_remaining')
      .eq('customer_id', customer.id)
      .gt('sessions_remaining', 0)
      .order('created_at', { ascending: true })
      .limit(1)
      .single()

    console.log('Oldest credit found:', oldestCredit)
    console.log('Credit fetch error:', creditFetchError)

    if (oldestCredit) {
      const { error: updateError } = await supabaseAdmin
        .from('session_credits')
        .update({ sessions_remaining: oldestCredit.sessions_remaining - 1 })
        .eq('id', oldestCredit.id)
      
      console.log('Credit update error:', updateError)
      console.log('Deducted 1 session from credit:', oldestCredit.id)

      const { error: usageError } = await supabaseAdmin
        .from('session_usage')
        .insert({
          booking_id: booking.id,
          session_credit_id: oldestCredit.id,
          sessions_used: 1,
        })
      
      console.log('Session usage tracking error:', usageError)
    } else {
      console.error('Could not find credit to deduct!')
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