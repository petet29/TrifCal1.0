import { CalendarEvent, CalendarSource } from '@/types/calendar'
import ICAL from 'ical'

export class AppleCalendarService {
  private caldavUrl: string
  private username: string
  private password: string

  constructor(caldavUrl: string, username: string, password: string) {
    this.caldavUrl = caldavUrl
    this.username = username
    this.password = password
  }

  async getEvents(
    calendarId: string = 'home',
    timeMin?: Date,
    timeMax?: Date
  ): Promise<CalendarEvent[]> {
    try {
      // Check if credentials are properly configured
      if (this.caldavUrl.includes('your_apple_caldav_url_here') || 
          this.username.includes('your_apple_username_here') ||
          this.password.includes('your_apple_password_here')) {
        throw new Error('Apple Calendar credentials not properly configured')
      }

      // Handle both base URL and full URL formats
      const calendarUrl = this.caldavUrl.endsWith('/calendars/') 
        ? `${this.caldavUrl}${calendarId}/`
        : `${this.caldavUrl}calendars/${calendarId}/`
      
      // Build CalDAV REPORT request body
      const timeMinStr = timeMin ? timeMin.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z' : ''
      const timeMaxStr = timeMax ? timeMax.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z' : ''
      
      const reportBody = `<?xml version="1.0" encoding="utf-8" ?>
<C:calendar-query xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">
  <D:prop>
    <D:getetag/>
    <C:calendar-data/>
  </D:prop>
  <C:filter>
    <C:comp-filter name="VCALENDAR">
      <C:comp-filter name="VEVENT">
        ${timeMinStr ? `<C:time-range start="${timeMinStr}" end="${timeMaxStr}"/>` : ''}
      </C:comp-filter>
    </C:comp-filter>
  </C:filter>
</C:calendar-query>`

      const response = await fetch(calendarUrl, {
        method: 'REPORT',
        headers: {
          'Content-Type': 'application/xml',
          'Depth': '1',
          'Authorization': `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`
        },
        body: reportBody
      })

      if (!response.ok) {
        throw new Error(`CalDAV request failed: ${response.statusText}`)
      }

      const xmlData = await response.text()
      return this.parseCalDAVResponse(xmlData)
    } catch (error) {
      console.error('Apple Calendar fetch error:', error)
      throw new Error('Failed to fetch Apple Calendar events')
    }
  }

  async getCalendars(): Promise<CalendarSource[]> {
    try {
      const response = await fetch(this.caldavUrl, {
        method: 'PROPFIND',
        headers: {
          'Content-Type': 'application/xml',
          'Depth': '1',
          'Authorization': `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`
        },
        body: `<?xml version="1.0" encoding="utf-8" ?>
<D:propfind xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">
  <D:prop>
    <D:displayname/>
    <C:calendar-color/>
    <C:calendar-description/>
  </D:prop>
</D:propfind>`
      })

      if (!response.ok) {
        throw new Error(`CalDAV calendar list failed: ${response.statusText}`)
      }

      const xmlData = await response.text()
      return this.parseCalendarList(xmlData)
    } catch (error) {
      console.error('Apple Calendar list error:', error)
      throw new Error('Failed to fetch Apple Calendar list')
    }
  }

  private parseCalDAVResponse(xmlData: string): CalendarEvent[] {
    const events: CalendarEvent[] = []
    
    // Simple XML parsing for calendar data
    // Using [\s\S] instead of . with 's' flag for ES2017 compatibility
    const calendarDataMatches = xmlData.match(/<C:calendar-data><!\[CDATA\[([\s\S]*?)\]\]><\/C:calendar-data>/g)
    
    if (calendarDataMatches) {
      for (const match of calendarDataMatches) {
        const icalData = match.replace(/<C:calendar-data><!\[CDATA\[([\s\S]*?)\]\]><\/C:calendar-data>/, '$1')
        const parsedEvents = this.parseICalData(icalData)
        events.push(...parsedEvents)
      }
    }
    
    return events
  }

  private parseICalData(icalData: string): CalendarEvent[] {
    const events: CalendarEvent[] = []
    
    try {
      const parsedData = ICAL.parseICS(icalData)
      
      for (const key in parsedData) {
        const event = parsedData[key]
        if (event.type === 'VEVENT') {
          // Check if event is all-day by examining the original iCal data or ICAL.Time object
          // All-day events in iCalendar use DATE instead of DATE-TIME
          const startDate = event.start ? new Date(event.start) : new Date()
          const endDate = event.end ? new Date(event.end) : new Date()
          
          // An event is all-day if start time is at midnight and has no time component
          // Check if the original iCal string indicates a DATE value (all-day) vs DATE-TIME
          const eventKey = key
          const isAllDay = icalData.includes(`DTSTART;VALUE=DATE:`) || 
                          icalData.includes(`DTSTART;VALUE=DATE;`) ||
                          (startDate.getHours() === 0 && startDate.getMinutes() === 0 && 
                           startDate.getSeconds() === 0 && startDate.getMilliseconds() === 0)
          
          events.push({
            id: event.uid || crypto.randomUUID(),
            title: event.summary || 'No Title',
            description: event.description || '',
            start: startDate,
            end: endDate,
            allDay: isAllDay,
            location: event.location || '',
            source: {
              id: 'apple',
              name: 'Apple Calendar',
              type: 'apple',
              color: '#007aff',
              enabled: true,
              lastSync: new Date()
            },
            status: 'confirmed',
            visibility: 'private'
          })
        }
      }
    } catch (error) {
      console.error('Error parsing iCal data:', error)
    }
    
    return events
  }

  private parseCalendarList(xmlData: string): CalendarSource[] {
    const calendars: CalendarSource[] = []
    
    // Simple XML parsing for calendar list
    const hrefMatches = xmlData.match(/<D:href>(.*?)<\/D:href>/g)
    const displayNameMatches = xmlData.match(/<D:displayname>(.*?)<\/D:displayname>/g)
    const colorMatches = xmlData.match(/<C:calendar-color>(.*?)<\/C:calendar-color>/g)
    
    if (hrefMatches) {
      for (let i = 0; i < hrefMatches.length; i++) {
        const href = hrefMatches[i].replace(/<D:href>(.*?)<\/D:href>/, '$1')
        const displayName = displayNameMatches?.[i]?.replace(/<D:displayname>(.*?)<\/D:displayname>/, '$1') || 'Apple Calendar'
        const color = colorMatches?.[i]?.replace(/<C:calendar-color>(.*?)<\/C:calendar-color>/, '$1') || '#007aff'
        
        // Extract calendar ID from href
        const calendarId = href.split('/').filter(Boolean).pop() || 'home'
        
        calendars.push({
          id: calendarId,
          name: displayName,
          type: 'apple',
          color: color,
          enabled: true,
          lastSync: new Date()
        })
      }
    }
    
    return calendars
  }
}
