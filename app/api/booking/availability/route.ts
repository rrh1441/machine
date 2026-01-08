import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createGoogleCalendarClient } from '@/lib/google-calendar/client';

const SLOT_DURATION_HOURS = 2;
const TIMEZONE = 'America/Los_Angeles';
const MIN_HOURS_IN_ADVANCE = 8; // Must book at least 8 hours ahead
const EARLIEST_START_HOUR = 7;  // 7:00 AM
const LATEST_START_HOUR = 18;   // 6:00 PM (session ends at 8:00 PM)

interface TimeSlot {
  start: string; // HH:MM format
  end: string;   // HH:MM format
  available: boolean;
}

interface AvailabilityResponse {
  date: string;
  dayOfWeek: number;
  businessHours: { start: string; end: string } | null;
  slots: TimeSlot[];
  error?: string;
}

/**
 * GET /api/booking/availability?date=2025-01-15
 * Returns available 2-hour slots for the given date
 */
export async function GET(req: NextRequest): Promise<NextResponse<AvailabilityResponse>> {
  const dateParam = req.nextUrl.searchParams.get('date');

  if (!dateParam) {
    return NextResponse.json({
      date: '',
      dayOfWeek: 0,
      businessHours: null,
      slots: [],
      error: 'Missing date parameter (format: YYYY-MM-DD)'
    }, { status: 400 });
  }

  // Parse and validate date
  const dateMatch = dateParam.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!dateMatch) {
    return NextResponse.json({
      date: dateParam,
      dayOfWeek: 0,
      businessHours: null,
      slots: [],
      error: 'Invalid date format (expected: YYYY-MM-DD)'
    }, { status: 400 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({
      date: dateParam,
      dayOfWeek: 0,
      businessHours: null,
      slots: [],
      error: 'Database not configured'
    }, { status: 500 });
  }

  try {
    // Create date in Seattle timezone
    const targetDate = new Date(`${dateParam}T00:00:00`);
    const dayOfWeek = getDayOfWeekInSeattle(dateParam);

    // 1. Get business hours for this day of week
    const { data: hoursData, error: hoursError } = await supabaseAdmin
      .from('business_hours')
      .select('start_time, end_time, is_available')
      .eq('day_of_week', dayOfWeek)
      .single();

    if (hoursError || !hoursData || !hoursData.is_available) {
      return NextResponse.json({
        date: dateParam,
        dayOfWeek,
        businessHours: null,
        slots: [],
        error: hoursError ? 'Failed to fetch business hours' : 'Not available on this day'
      });
    }

    // Override with enforced booking hours: 7am-8pm (last booking 6pm)
    const businessHours = {
      start: `${EARLIEST_START_HOUR.toString().padStart(2, '0')}:00`,
      end: `${(LATEST_START_HOUR + SLOT_DURATION_HOURS).toString().padStart(2, '0')}:00` // 8pm end
    };

    // 2. Generate all possible slots (7am to 6pm start times, ending by 8pm)
    const allSlots = generateSlots(businessHours.start, businessHours.end, SLOT_DURATION_HOURS);

    // 3. Get blocked times from database
    // Use proper Seattle timezone conversion for day boundaries
    const dayStart = parseSeattleTime(dateParam, '00:00');
    const dayEnd = parseSeattleTime(dateParam, '23:59');

    const { data: blockedTimes } = await supabaseAdmin
      .from('blocked_times')
      .select('start_datetime, end_datetime')
      .lt('start_datetime', dayEnd.toISOString())
      .gt('end_datetime', dayStart.toISOString());

    // 4. Get existing bookings
    const { data: bookings } = await supabaseAdmin
      .from('bookings')
      .select('booking_datetime, duration_hours')
      .eq('booking_date', dateParam)
      .eq('status', 'scheduled');

    // 5. Try to get Google Calendar busy times
    let googleBusyPeriods: Array<{ start: Date; end: Date }> = [];
    try {
      const calendarClient = createGoogleCalendarClient();
      if (calendarClient) {
        googleBusyPeriods = await calendarClient.getFreeBusy(dayStart, dayEnd);
      }
    } catch (calError) {
      console.error('Google Calendar error (continuing without it):', calError);
    }

    // 6. Mark slots as available/unavailable
    const slots = allSlots.map(slot => {
      const slotStart = parseSeattleTime(dateParam, slot.start);
      const slotEnd = parseSeattleTime(dateParam, slot.end);

      // Check if slot is at least 8 hours in the future
      const now = new Date();
      const minBookingTime = new Date(now.getTime() + MIN_HOURS_IN_ADVANCE * 60 * 60 * 1000);
      if (slotStart < minBookingTime) {
        return { ...slot, available: false };
      }

      // Check blocked times
      const isBlocked = (blockedTimes || []).some(block => {
        const blockStart = new Date(block.start_datetime);
        const blockEnd = new Date(block.end_datetime);
        return blockStart < slotEnd && blockEnd > slotStart;
      });
      if (isBlocked) {
        return { ...slot, available: false };
      }

      // Check existing bookings
      const hasBooking = (bookings || []).some(booking => {
        const bookingStart = new Date(booking.booking_datetime);
        const duration = booking.duration_hours || SLOT_DURATION_HOURS;
        const bookingEnd = new Date(bookingStart.getTime() + duration * 60 * 60 * 1000);
        return bookingStart < slotEnd && bookingEnd > slotStart;
      });
      if (hasBooking) {
        return { ...slot, available: false };
      }

      // Check Google Calendar busy periods
      const isGoogleBusy = googleBusyPeriods.some(busy => {
        return busy.start < slotEnd && busy.end > slotStart;
      });
      if (isGoogleBusy) {
        return { ...slot, available: false };
      }

      return { ...slot, available: true };
    });

    return NextResponse.json({
      date: dateParam,
      dayOfWeek,
      businessHours,
      slots
    });

  } catch (error) {
    console.error('Availability error:', error);
    return NextResponse.json({
      date: dateParam,
      dayOfWeek: 0,
      businessHours: null,
      slots: [],
      error: 'Failed to fetch availability'
    }, { status: 500 });
  }
}

/**
 * Generate slots with 30-minute increments between start and end times
 * Each slot represents a potential start time for a 2-hour session
 */
function generateSlots(startTime: string, endTime: string, durationHours: number): TimeSlot[] {
  const slots: TimeSlot[] = [];

  const [startHour, startMin = 0] = startTime.split(':').map(Number);
  const [endHour, endMin = 0] = endTime.split(':').map(Number);

  // Convert to minutes for easier calculation
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  const durationMinutes = durationHours * 60;
  const incrementMinutes = 30; // 30-minute increments for flexibility

  // Generate slots every 30 minutes
  // Last valid start time is when session would end at business hours end
  let currentMinutes = startMinutes;

  while (currentMinutes + durationMinutes <= endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const mins = currentMinutes % 60;
    const endTotalMinutes = currentMinutes + durationMinutes;
    const endHours = Math.floor(endTotalMinutes / 60);
    const endMins = endTotalMinutes % 60;

    const slotStart = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    const slotEnd = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;

    slots.push({
      start: slotStart,
      end: slotEnd,
      available: true // Will be updated later
    });

    currentMinutes += incrementMinutes;
  }

  return slots;
}

/**
 * Parse a time string into a Date in Seattle timezone (returns UTC Date)
 */
function parseSeattleTime(dateStr: string, timeStr: string): Date {
  // Get the UTC offset for Seattle on this specific date
  // This properly handles DST transitions
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);

  // Create a date formatter for Seattle timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  // Create a rough UTC date first, then calculate the offset
  const roughDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));

  // Get what time it would be in Seattle for this UTC time
  const parts = formatter.formatToParts(roughDate);
  const getPart = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0');

  const seattleHour = getPart('hour');
  const seattleDay = getPart('day');

  // Calculate offset: if Seattle shows different hour/day, adjust
  // Seattle is behind UTC, so UTC hour > Seattle hour
  let offsetHours = hours - seattleHour;
  if (seattleDay < day) offsetHours -= 24;
  if (seattleDay > day) offsetHours += 24;

  // Now create the correct UTC time for the Seattle local time
  // If user wants 10:30 Seattle time, and offset is -8, we need 18:30 UTC
  const utcDate = new Date(Date.UTC(year, month - 1, day, hours + offsetHours, minutes, 0));

  return utcDate;
}

/**
 * Get day of week for a date in Seattle timezone
 */
function getDayOfWeekInSeattle(dateStr: string): number {
  const date = new Date(`${dateStr}T12:00:00`); // Use noon to avoid DST edge cases
  return date.getDay();
}
