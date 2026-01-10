import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { gmail as resend } from '@/lib/gmail/email-service'
import { emailTemplates } from '@/lib/emails/templates'

export async function GET(request: NextRequest) {
  // SECURITY: Verify cron secret in production (Vercel sets this header)
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (process.env.NODE_ENV === 'production') {
    if (!cronSecret) {
      console.error('CRON_SECRET not configured')
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }
    if (authHeader !== `Bearer ${cronSecret}`) {
      console.error('Invalid cron authorization')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // Check if Supabase is configured
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  // Get bookings for tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const { data: bookings } = await supabaseAdmin
    .from('bookings')
    .select('*, customers(*)')
    .eq('booking_date', tomorrow.toISOString().split('T')[0])
    .eq('status', 'scheduled')

  for (const booking of bookings || []) {
    // Send reminder email if Resend is configured
    if (resend) {
      const emailContent = emailTemplates.bookingReminder(
        new Date(booking.booking_datetime),
        booking.booking_time
      )
      
      await resend.emails.send({
        from: 'Seattle Ball Machine <noreply@seattleballmachine.com>',
        to: booking.customers.email,
        ...emailContent
      })

      await supabaseAdmin
        .from('email_logs')
        .insert({
          customer_id: booking.customer_id,
          booking_id: booking.id,
          email_type: 'booking_reminder',
          sent_to: booking.customers.email,
          subject: 'Reminder: Your ball machine rental is tomorrow!',
          status: 'sent',
          sent_at: new Date().toISOString()
        })
    }
  }

  return NextResponse.json({ sent: bookings?.length || 0 })
}