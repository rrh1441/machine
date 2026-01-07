import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createGoogleCalendarClient } from '@/lib/google-calendar/client';
import { gmail } from '@/lib/gmail/email-service';
import { emailTemplates } from '@/lib/emails/templates';

interface CancelRequest {
  bookingId: string;
  email?: string; // Optional verification
}

interface CancelResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const MIN_CANCEL_NOTICE_HOURS = 2; // Must cancel at least 2 hours before booking

/**
 * POST /api/booking/cancel
 * Cancel an existing booking
 */
export async function POST(req: NextRequest): Promise<NextResponse<CancelResponse>> {
  if (!supabaseAdmin) {
    return NextResponse.json({
      success: false,
      error: 'Database not configured'
    }, { status: 500 });
  }

  let body: CancelRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({
      success: false,
      error: 'Invalid JSON body'
    }, { status: 400 });
  }

  const { bookingId, email } = body;

  if (!bookingId) {
    return NextResponse.json({
      success: false,
      error: 'Missing bookingId'
    }, { status: 400 });
  }

  try {
    // 1. Find the booking
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select(`
        id,
        customer_id,
        booking_datetime,
        status,
        google_calendar_event_id,
        booking_source,
        customers (
          email,
          name
        )
      `)
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({
        success: false,
        error: 'Booking not found'
      }, { status: 404 });
    }

    // Type assertion for the joined customer data
    const customerData = booking.customers as unknown as { email: string; name: string } | null;

    // 2. Verify email matches (if provided)
    if (email && customerData?.email?.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({
        success: false,
        error: 'Email does not match booking'
      }, { status: 403 });
    }

    // 3. Check if already cancelled
    if (booking.status === 'cancelled') {
      return NextResponse.json({
        success: false,
        error: 'Booking is already cancelled'
      }, { status: 400 });
    }

    // 4. Check if booking is in the past or within notice period
    const bookingDate = new Date(booking.booking_datetime);
    const now = new Date();
    const minCancelTime = new Date(now.getTime() + MIN_CANCEL_NOTICE_HOURS * 60 * 60 * 1000);

    if (bookingDate < now) {
      return NextResponse.json({
        success: false,
        error: 'Cannot cancel past bookings'
      }, { status: 400 });
    }

    if (bookingDate < minCancelTime) {
      return NextResponse.json({
        success: false,
        error: `Cannot cancel with less than ${MIN_CANCEL_NOTICE_HOURS} hours notice`
      }, { status: 400 });
    }

    // 5. Delete Google Calendar event (if exists and is native booking)
    if (booking.google_calendar_event_id && booking.booking_source === 'native') {
      const calendarClient = createGoogleCalendarClient();
      if (calendarClient) {
        try {
          await calendarClient.deleteEvent(booking.google_calendar_event_id);
          console.log('Deleted Google Calendar event:', booking.google_calendar_event_id);
        } catch (calError) {
          console.error('Failed to delete Google Calendar event:', calError);
          // Continue with cancellation even if calendar delete fails
        }
      }
    }

    // 6. Update booking status
    const { error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Failed to update booking status:', updateError);
      return NextResponse.json({
        success: false,
        error: 'Failed to cancel booking'
      }, { status: 500 });
    }

    // 7. Refund the session credit
    const { data: usage } = await supabaseAdmin
      .from('session_usage')
      .select('session_credit_id')
      .eq('booking_id', bookingId)
      .single();

    if (usage) {
      const { data: credit } = await supabaseAdmin
        .from('session_credits')
        .select('sessions_remaining')
        .eq('id', usage.session_credit_id)
        .single();

      if (credit) {
        await supabaseAdmin
          .from('session_credits')
          .update({ sessions_remaining: credit.sessions_remaining + 1 })
          .eq('id', usage.session_credit_id);

        console.log('Refunded session credit:', usage.session_credit_id);
      }
    }

    // 8. Send cancellation email
    if (customerData?.email) {
      try {
        const emailContent = emailTemplates.bookingCancelled();

        await gmail.emails.send({
          from: 'Seattle Ball Machine <ryan@firstserveseattle.com>',
          to: customerData.email,
          ...emailContent
        });
        console.log('Sent cancellation email to:', customerData.email);
      } catch (emailError) {
        console.error('Failed to send cancellation email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully. Your session credit has been restored.'
    });

  } catch (error) {
    console.error('Cancel error:', error);
    return NextResponse.json({
      success: false,
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
}
