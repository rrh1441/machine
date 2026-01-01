import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createGoogleCalendarClient } from '@/lib/google-calendar/client';
import { gmail } from '@/lib/gmail/email-service';
import { emailTemplates } from '@/lib/emails/templates';

interface BookingRequest {
  email: string;
  date: string;      // YYYY-MM-DD
  startTime: string; // HH:MM
}

interface BookingResponse {
  success: boolean;
  booking?: {
    id: string;
    date: string;
    time: string;
    cancelUrl: string;
    rescheduleUrl: string;
  };
  sessionsRemaining?: number;
  error?: string;
}

const SLOT_DURATION_HOURS = 2;
const PICKUP_LOCATION = '2116 4th Avenue West, Seattle, WA 98119';

/**
 * POST /api/booking/book
 * Create a new booking
 */
export async function POST(req: NextRequest): Promise<NextResponse<BookingResponse>> {
  if (!supabaseAdmin) {
    return NextResponse.json({
      success: false,
      error: 'Database not configured'
    }, { status: 500 });
  }

  let body: BookingRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({
      success: false,
      error: 'Invalid JSON body'
    }, { status: 400 });
  }

  const { email, date, startTime } = body;

  if (!email || !date || !startTime) {
    return NextResponse.json({
      success: false,
      error: 'Missing required fields: email, date, startTime'
    }, { status: 400 });
  }

  try {
    // 1. Find customer by email
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('id, name')
      .eq('email', email.toLowerCase())
      .single();

    if (customerError || !customer) {
      return NextResponse.json({
        success: false,
        error: 'Customer not found. Please purchase a session pack first.'
      }, { status: 404 });
    }

    // 2. Check available sessions
    const { data: credits } = await supabaseAdmin
      .from('session_credits')
      .select('sessions_remaining')
      .eq('customer_id', customer.id)
      .gt('sessions_remaining', 0)
      .gt('expires_at', new Date().toISOString());

    const totalSessions = credits?.reduce((sum, c) => sum + c.sessions_remaining, 0) || 0;

    if (totalSessions === 0) {
      return NextResponse.json({
        success: false,
        error: 'No sessions available. Please purchase more sessions.'
      }, { status: 400 });
    }

    // 3. Create booking datetime
    const bookingDatetime = new Date(`${date}T${startTime}:00`);
    const endTime = new Date(bookingDatetime.getTime() + SLOT_DURATION_HOURS * 60 * 60 * 1000);

    // 4. Verify slot is still available (double-check)
    const { data: existingBooking } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('booking_date', date)
      .eq('status', 'scheduled')
      .gte('booking_datetime', new Date(`${date}T00:00:00`).toISOString())
      .lte('booking_datetime', new Date(`${date}T23:59:59`).toISOString());

    const hasConflict = (existingBooking || []).some(booking => {
      // This is a simplified check - in production you'd check actual time overlaps
      return true; // We'd need the actual times to check properly
    });

    // For now, check using a more specific query
    const { data: conflictCheck } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('booking_date', date)
      .eq('booking_time', `${startTime}:00`)
      .eq('status', 'scheduled');

    if (conflictCheck && conflictCheck.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'This time slot is no longer available'
      }, { status: 409 });
    }

    // 5. Create Google Calendar event (if configured)
    let googleEventId: string | null = null;
    const calendarClient = createGoogleCalendarClient();

    if (calendarClient) {
      try {
        const event = await calendarClient.createEvent({
          summary: `Ball Machine Rental - ${customer.name || email}`,
          description: `2-hour ball machine rental session.\n\nCustomer: ${customer.name || 'N/A'}\nEmail: ${email}`,
          startTime: bookingDatetime,
          endTime: endTime,
          attendeeEmail: email,
          location: PICKUP_LOCATION
        });
        googleEventId = event.id || null;
        console.log('Created Google Calendar event:', googleEventId);
      } catch (calError) {
        console.error('Failed to create Google Calendar event:', calError);
        // Continue without calendar event - we can add it manually later
      }
    }

    // 6. Create booking in database
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        customer_id: customer.id,
        booking_date: date,
        booking_time: `${startTime}:00`,
        booking_datetime: bookingDatetime.toISOString(),
        duration_hours: SLOT_DURATION_HOURS,
        status: 'scheduled',
        booking_source: 'native',
        google_calendar_event_id: googleEventId
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Booking creation error:', bookingError);
      // If we created a calendar event, try to delete it
      if (googleEventId && calendarClient) {
        try {
          await calendarClient.deleteEvent(googleEventId);
        } catch {
          console.error('Failed to rollback calendar event');
        }
      }
      return NextResponse.json({
        success: false,
        error: 'Failed to create booking'
      }, { status: 500 });
    }

    // 7. Deduct session (FIFO - oldest credit first)
    const { data: oldestCredit } = await supabaseAdmin
      .from('session_credits')
      .select('id, sessions_remaining')
      .eq('customer_id', customer.id)
      .gt('sessions_remaining', 0)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (oldestCredit) {
      await supabaseAdmin
        .from('session_credits')
        .update({ sessions_remaining: oldestCredit.sessions_remaining - 1 })
        .eq('id', oldestCredit.id);

      await supabaseAdmin
        .from('session_usage')
        .insert({
          booking_id: booking.id,
          session_credit_id: oldestCredit.id,
          sessions_used: 1
        });
    }

    // 8. Generate cancel/reschedule URLs
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://www.seattleballmachine.com';
    const cancelUrl = `${baseUrl}/book/cancel?id=${booking.id}`;
    const rescheduleUrl = `${baseUrl}/book/reschedule?id=${booking.id}`;

    // 9. Send confirmation email
    try {
      const emailContent = emailTemplates.bookingConfirmation(
        bookingDatetime,
        totalSessions - 1,
        rescheduleUrl,
        cancelUrl
      );

      await gmail.emails.send({
        from: 'Seattle Ball Machine <ryan@firstserveseattle.com>',
        to: email,
        ...emailContent
      });
      console.log('Sent booking confirmation email to:', email);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the booking if email fails
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        date: date,
        time: startTime,
        cancelUrl,
        rescheduleUrl
      },
      sessionsRemaining: totalSessions - 1
    });

  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({
      success: false,
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
}
