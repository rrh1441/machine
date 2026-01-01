/**
 * Google Calendar API Client
 *
 * Wrapper around Google Calendar API for availability checking and event management.
 * Uses same OAuth2 credentials as Gmail.
 */

import { google, calendar_v3, Auth } from 'googleapis';

export interface GoogleCalendarConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken?: string;
  calendarId?: string;
}

export interface TimeSlot {
  start: string; // HH:MM format
  end: string;   // HH:MM format
  available: boolean;
}

export interface BusyPeriod {
  start: Date;
  end: Date;
}

export class GoogleCalendarClient {
  private oauth2Client: Auth.OAuth2Client;
  private calendar: calendar_v3.Calendar;
  private calendarId: string;

  constructor(config: GoogleCalendarConfig) {
    this.oauth2Client = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret,
      config.redirectUri
    );

    if (config.refreshToken) {
      this.oauth2Client.setCredentials({
        refresh_token: config.refreshToken
      });
    }

    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
    this.calendarId = config.calendarId || 'primary';
  }

  /**
   * Get busy periods for a date range
   */
  async getFreeBusy(timeMin: Date, timeMax: Date): Promise<BusyPeriod[]> {
    const response = await this.calendar.freebusy.query({
      requestBody: {
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        items: [{ id: this.calendarId }]
      }
    });

    const busyPeriods = response.data.calendars?.[this.calendarId]?.busy || [];

    return busyPeriods.map(period => ({
      start: new Date(period.start!),
      end: new Date(period.end!)
    }));
  }

  /**
   * Create a calendar event for a booking
   */
  async createEvent(options: {
    summary: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    attendeeEmail?: string;
    location?: string;
  }): Promise<calendar_v3.Schema$Event> {
    const event: calendar_v3.Schema$Event = {
      summary: options.summary,
      description: options.description,
      location: options.location,
      start: {
        dateTime: options.startTime.toISOString(),
        timeZone: 'America/Los_Angeles'
      },
      end: {
        dateTime: options.endTime.toISOString(),
        timeZone: 'America/Los_Angeles'
      }
    };

    if (options.attendeeEmail) {
      event.attendees = [{ email: options.attendeeEmail }];
    }

    const response = await this.calendar.events.insert({
      calendarId: this.calendarId,
      requestBody: event,
      sendUpdates: options.attendeeEmail ? 'all' : 'none'
    });

    return response.data;
  }

  /**
   * Delete a calendar event (for cancellation)
   */
  async deleteEvent(eventId: string): Promise<void> {
    await this.calendar.events.delete({
      calendarId: this.calendarId,
      eventId,
      sendUpdates: 'all'
    });
  }

  /**
   * Update a calendar event (for rescheduling)
   */
  async updateEvent(eventId: string, options: {
    summary?: string;
    description?: string;
    startTime?: Date;
    endTime?: Date;
    location?: string;
  }): Promise<calendar_v3.Schema$Event> {
    const updateData: calendar_v3.Schema$Event = {};

    if (options.summary) updateData.summary = options.summary;
    if (options.description) updateData.description = options.description;
    if (options.location) updateData.location = options.location;

    if (options.startTime) {
      updateData.start = {
        dateTime: options.startTime.toISOString(),
        timeZone: 'America/Los_Angeles'
      };
    }

    if (options.endTime) {
      updateData.end = {
        dateTime: options.endTime.toISOString(),
        timeZone: 'America/Los_Angeles'
      };
    }

    const response = await this.calendar.events.patch({
      calendarId: this.calendarId,
      eventId,
      requestBody: updateData,
      sendUpdates: 'all'
    });

    return response.data;
  }

  /**
   * List events in a date range (for syncing blocks)
   */
  async listEvents(timeMin: Date, timeMax: Date): Promise<calendar_v3.Schema$Event[]> {
    const response = await this.calendar.events.list({
      calendarId: this.calendarId,
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    });

    return response.data.items || [];
  }
}

/**
 * Create Google Calendar client from environment variables
 * Uses same credentials as Gmail
 */
export function createGoogleCalendarClient(): GoogleCalendarClient | null {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  if (!clientId || !clientSecret) {
    console.error('Google Calendar client not configured - missing GMAIL_CLIENT_ID or GMAIL_CLIENT_SECRET');
    return null;
  }

  if (!refreshToken) {
    console.error('Google Calendar client not configured - missing GMAIL_REFRESH_TOKEN');
    return null;
  }

  return new GoogleCalendarClient({
    clientId,
    clientSecret,
    redirectUri: process.env.GMAIL_REDIRECT_URI || 'http://localhost:3333/api/auth/gmail/callback',
    refreshToken,
    calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary'
  });
}
