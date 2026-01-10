/**
 * Timezone utilities for Seattle-based booking operations
 */

import { BOOKING_CONSTANTS } from './constants';

const { TIMEZONE } = BOOKING_CONSTANTS;

/**
 * Parse a time string into a Date in Seattle timezone (returns UTC Date)
 * @param dateStr - Date in YYYY-MM-DD format
 * @param timeStr - Time in HH:MM format
 * @returns UTC Date representing the Seattle local time
 */
export function parseSeattleTime(dateStr: string, timeStr: string): Date {
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
  let offsetHours = hours - seattleHour;
  if (seattleDay < day) offsetHours -= 24;
  if (seattleDay > day) offsetHours += 24;

  // Now create the correct UTC time for the Seattle local time
  return new Date(Date.UTC(year, month - 1, day, hours + offsetHours, minutes, 0));
}

/**
 * Get day of week for a date in Seattle timezone
 * @param dateStr - Date in YYYY-MM-DD format
 * @returns Day of week (0 = Sunday, 6 = Saturday)
 */
export function getDayOfWeekInSeattle(dateStr: string): number {
  // Use noon to avoid DST edge cases
  const date = new Date(`${dateStr}T12:00:00`);
  return date.getDay();
}

/**
 * Format a Date to Seattle local time string
 * @param date - Date object
 * @returns Formatted time string (e.g., "10:00 AM")
 */
export function formatSeattleTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    timeZone: TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Format a Date to Seattle local date string
 * @param date - Date object
 * @returns Formatted date string (e.g., "January 9, 2026")
 */
export function formatSeattleDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
