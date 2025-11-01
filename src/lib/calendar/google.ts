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
      // Default to current month if no date range provided
      const defaultTimeMin = timeMin || new Date()
      const defaultTimeMax = timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      
      const allEvents: CalendarEvent[] = []
      let pageToken: string | undefined = undefined

      do {
        const paramsInit: Record<string, string> = {
          singleEvents: 'true',
          orderBy: 'startTime',
          timeMin: defaultTimeMin.toISOString(),
          timeMax: defaultTimeMax.toISOString(),
          maxResults: '2500', // Increased limit per page
          showDeleted: 'false', // Don't show deleted events
        }
        if (pageToken) {
          paramsInit.pageToken = pageToken
        }
        const params = new URLSearchParams(paramsInit)

        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`
        
        const response = await fetch(
          url,
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
        
        if (data.items && data.items.length > 0) {
          const transformedEvents = this.transformGoogleEvents(data.items)
          allEvents.push(...transformedEvents)
        }

        // Check if there are more pages
        pageToken = data.nextPageToken
      } while (pageToken)

      console.log(`Fetched ${allEvents.length} events from Google Calendar`)
      return allEvents
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
    // Include all events - filter out only events without valid start times
    return googleEvents
      .filter(event => event.start && (event.start.dateTime || event.start.date)) // Only include events with valid start times
      .map(event => {
        // Handle all-day events (date only) vs timed events (dateTime with timezone)
        const isAllDay = !event.start.dateTime
        
        // For all-day events, parse the date in local timezone to avoid day shifts
        // For timed events, parse with timezone info
        let startDate: Date
        let endDate: Date
        
        if (isAllDay) {
          // All-day events: date is like "2025-11-21" - parse as local date
          // Create date at local midnight to avoid UTC timezone issues
          const startParts = event.start.date!.split('-').map(Number)
          const endParts = event.end.date!.split('-').map(Number)
          startDate = new Date(startParts[0], startParts[1] - 1, startParts[2])
          endDate = new Date(endParts[0], endParts[1] - 1, endParts[2])
          // For end date of all-day events, Google uses exclusive end (next day)
          // But we want to show it on the same day, so we subtract 1 day
          endDate.setDate(endDate.getDate() - 1)
        } else {
          // Timed events: dateTime includes timezone info
          startDate = new Date(event.start.dateTime!)
          endDate = new Date(event.end.dateTime!)
        }
        
        return {
          id: event.id,
          title: event.summary || 'No Title',
          description: event.description || '',
          start: startDate,
          end: endDate,
          allDay: isAllDay,
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
          status: this.mapEventStatus(event.status || 'confirmed'),
          visibility: this.mapVisibility(event.visibility || 'private')
        }
      })
  }

  private transformGoogleCalendars(googleCalendars: GoogleCalendar[]): CalendarSource[] {
    // Return ALL calendars, not just selected ones
    return googleCalendars.map(calendar => ({
      id: calendar.id,
      name: calendar.summary,
      type: 'google',
      color: calendar.backgroundColor || '#4285f4',
      enabled: true, // Always enable - don't filter by selected status
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
