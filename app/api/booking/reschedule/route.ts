import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createGoogleCalendarClient } from '@/lib/google-calendar/client';
import { gmail } from '@/lib/gmail/email-service';
import { emailTemplates } from '@/lib/emails/templates';

interface RescheduleRequest {
  bookingId: string;
  newDate: string;      // YYYY-MM-DD
  newStartTime: string; // HH:MM
  email?: string;       // Optional verification
}

interface RescheduleResponse {
  success: boolean;
  booking?: {
    id: string;
    date: string;
    time: string;
    cancelUrl: string;
    rescheduleUrl: string;
  };
  error?: string;
}

const SLOT_DURATION_HOURS = 2;
const PICKUP_LOCATION = '2116 4th Avenue West, Seattle, WA 98119';
const MIN_RESCHEDULE_NOTICE_HOURS = 2; // Must reschedule at least 2 hours before booking

/**
 * POST /api/booking/reschedule
 * Reschedule an existing booking to a new date/time
 */
export async function POST(req: NextRequest): Promise<NextResponse<RescheduleResponse>> {
  if (!supabaseAdmin) {
    return NextResponse.json({
      success: false,
      error: 'Database not configured'
    }, { status: 500 });
  }

  let body: RescheduleRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({
      success: false,
      error: 'Invalid JSON body'
    }, { status: 400 });
  }

  const { bookingId, newDate, newStartTime, email } = body;

  if (!bookingId || !newDate || !newStartTime) {
    return NextResponse.json({
      success: false,
      error: 'Missing required fields: bookingId, newDate, newStartTime'
    }, { status: 400 });
  }

  try {
    // 1. Find the existing booking
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
          id,
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
    const customerData = booking.customers as unknown as { id: string; email: string; name: string } | null;

    // 2. Verify email matches (if provided)
    if (email && customerData?.email?.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({
        success: false,
        error: 'Email does not match booking'
      }, { status: 403 });
    }

    // 3. Check if booking can be rescheduled
    if (booking.status === 'cancelled') {
      return NextResponse.json({
        success: false,
        error: 'Cannot reschedule a cancelled booking'
      }, { status: 400 });
    }

    const originalDate = new Date(booking.booking_datetime);
    const now = new Date();
    const minRescheduleTime = new Date(now.getTime() + MIN_RESCHEDULE_NOTICE_HOURS * 60 * 60 * 1000);

    if (originalDate < now) {
      return NextResponse.json({
        success: false,
        error: 'Cannot reschedule past bookings'
      }, { status: 400 });
    }

    if (originalDate < minRescheduleTime) {
      return NextResponse.json({
        success: false,
        error: `Cannot reschedule with less than ${MIN_RESCHEDULE_NOTICE_HOURS} hours notice`
      }, { status: 400 });
    }

    // 4. Create new booking datetime
    const newBookingDatetime = new Date(`${newDate}T${newStartTime}:00`);
    const newEndTime = new Date(newBookingDatetime.getTime() + SLOT_DURATION_HOURS * 60 * 60 * 1000);

    // 5. Verify new slot is available
    const { data: conflictCheck } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('booking_date', newDate)
      .eq('booking_time', `${newStartTime}:00`)
      .eq('status', 'scheduled')
      .neq('id', bookingId); // Exclude current booking

    if (conflictCheck && conflictCheck.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'The new time slot is not available'
      }, { status: 409 });
    }

    // 6. Update Google Calendar event (if exists)
    const calendarClient = createGoogleCalendarClient();

    if (booking.google_calendar_event_id && calendarClient) {
      try {
        await calendarClient.updateEvent(booking.google_calendar_event_id, {
          summary: `Ball Machine Rental - ${customerData?.name || customerData?.email}`,
          startTime: newBookingDatetime,
          endTime: newEndTime,
          location: PICKUP_LOCATION
        });
        console.log('Updated Google Calendar event:', booking.google_calendar_event_id);
      } catch (calError) {
        console.error('Failed to update Google Calendar event:', calError);
        // Continue with reschedule even if calendar update fails
      }
    }

    // 7. Update booking in database
    const { error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({
        booking_date: newDate,
        booking_time: `${newStartTime}:00`,
        booking_datetime: newBookingDatetime.toISOString()
      })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Failed to update booking:', updateError);
      return NextResponse.json({
        success: false,
        error: 'Failed to reschedule booking'
      }, { status: 500 });
    }

    // 8. Generate URLs
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://www.seattleballmachine.com';
    const cancelUrl = `${baseUrl}/book/cancel?id=${bookingId}`;
    const rescheduleUrl = `${baseUrl}/book/reschedule?id=${bookingId}`;

    // 9. Get remaining sessions for email
    const { data: credits } = await supabaseAdmin
      .from('session_credits')
      .select('sessions_remaining')
      .eq('customer_id', booking.customer_id)
      .gt('sessions_remaining', 0);

    const sessionsRemaining = credits?.reduce((sum, c) => sum + c.sessions_remaining, 0) || 0;

    // 10. Send confirmation email
    if (customerData?.email) {
      try {
        const emailContent = emailTemplates.bookingConfirmation(
          newBookingDatetime,
          sessionsRemaining,
          rescheduleUrl,
          cancelUrl
        );

        await gmail.emails.send({
          from: 'Seattle Ball Machine <ryan@firstserveseattle.com>',
          to: customerData.email,
          ...emailContent
        });
        console.log('Sent reschedule confirmation email to:', customerData.email);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: bookingId,
        date: newDate,
        time: newStartTime,
        cancelUrl,
        rescheduleUrl
      }
    });

  } catch (error) {
    console.error('Reschedule error:', error);
    return NextResponse.json({
      success: false,
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
}
