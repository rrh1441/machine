/**
 * Shared constants for booking system
 */

export const BOOKING_CONSTANTS = {
  /** Duration of each booking slot in hours */
  SLOT_DURATION_HOURS: 2,

  /** Time increments for slot generation in minutes */
  SLOT_INCREMENT_MINUTES: 30,

  /** Timezone for all Seattle operations */
  TIMEZONE: 'America/Los_Angeles',

  /** Physical pickup location */
  PICKUP_LOCATION: '2116 4th Avenue West, Seattle, WA 98119',

  /** Minimum hours in advance a booking must be made */
  MIN_HOURS_IN_ADVANCE: 8,

  /** Minimum hours notice required to cancel */
  MIN_CANCEL_NOTICE_HOURS: 2,

  /** Minimum hours notice required to reschedule */
  MIN_RESCHEDULE_NOTICE_HOURS: 2,

  /** Earliest allowed start hour (7 AM) */
  EARLIEST_START_HOUR: 7,

  /** Latest allowed start hour (6 PM, session ends at 8 PM) */
  LATEST_START_HOUR: 18,
} as const;

export type BookingConstants = typeof BOOKING_CONSTANTS;
