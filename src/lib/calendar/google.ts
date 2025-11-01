import { CalendarEvent, CalendarSource } from '@/types/calendar'
import { GoogleCalendarEvent, GoogleAttendee, GoogleReminder, GoogleCalendar } from '@/types/google-calendar'

export class GoogleCalendarService {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  async getEvents(
    calendarId: string = 'primary',
    timeMin?: Date,
    timeMax?: Date
  ): Promise<CalendarEvent[]> {
    try {
      const params = new URLSearchParams({
        calendarId,
        singleEvents: 'true',
        orderBy: 'startTime',
        ...(timeMin && { timeMin: timeMin.toISOString() }),
        ...(timeMax && { timeMax: timeMax.toISOString() })
      })

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${params}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Google Calendar API error: ${response.statusText}`)
      }

      const data = await response.json()
      return this.transformGoogleEvents(data.items || [])
    } catch (error) {
      console.error('Google Calendar fetch error:', error)
      throw new Error('Failed to fetch Google Calendar events')
    }
  }

  async getCalendars(): Promise<CalendarSource[]> {
    try {
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/users/me/calendarList',
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Google Calendar API error: ${response.statusText}`)
      }

      const data = await response.json()
      return this.transformGoogleCalendars(data.items || [])
    } catch (error) {
      console.error('Google Calendar list error:', error)
      throw new Error('Failed to fetch Google Calendar list')
    }
  }

  private transformGoogleEvents(googleEvents: GoogleCalendarEvent[]): CalendarEvent[] {
    return googleEvents.map(event => ({
      id: event.id,
      title: event.summary || 'No Title',
      description: event.description || '',
      start: new Date(event.start.dateTime || event.start.date),
      end: new Date(event.end.dateTime || event.end.date),
      allDay: !event.start.dateTime,
      location: event.location || '',
      attendees: event.attendees?.map((attendee: GoogleAttendee) => ({
        email: attendee.email,
        name: attendee.displayName,
        status: this.mapAttendeeStatus(attendee.responseStatus),
        optional: attendee.optional || false
      })) || [],
      source: {
        id: event.organizer?.email || 'unknown',
        name: event.organizer?.displayName || 'Unknown',
        type: 'google',
        color: '#4285f4',
        enabled: true
      },
      reminders: event.reminders?.overrides?.map((reminder: GoogleReminder) => ({
        id: crypto.randomUUID(),
        minutes: reminder.minutes,
        method: reminder.method === 'popup' ? 'popup' : 'email',
        enabled: true
      })) || [],
      status: this.mapEventStatus(event.status),
      visibility: this.mapVisibility(event.visibility)
    }))
  }

  private transformGoogleCalendars(googleCalendars: GoogleCalendar[]): CalendarSource[] {
    return googleCalendars.map(calendar => ({
      id: calendar.id,
      name: calendar.summary,
      type: 'google',
      color: calendar.backgroundColor || '#4285f4',
      enabled: calendar.selected || false,
      lastSync: new Date()
    }))
  }

  private mapAttendeeStatus(status: string): 'accepted' | 'declined' | 'tentative' | 'needsAction' {
    switch (status) {
      case 'accepted': return 'accepted'
      case 'declined': return 'declined'
      case 'tentative': return 'tentative'
      default: return 'needsAction'
    }
  }

  private mapEventStatus(status: string): 'confirmed' | 'tentative' | 'cancelled' {
    switch (status) {
      case 'confirmed': return 'confirmed'
      case 'tentative': return 'tentative'
      case 'cancelled': return 'cancelled'
      default: return 'confirmed'
    }
  }

  private mapVisibility(visibility: string): 'public' | 'private' | 'confidential' {
    switch (visibility) {
      case 'public': return 'public'
      case 'private': return 'private'
      case 'confidential': return 'confidential'
      default: return 'private'
    }
  }
}
