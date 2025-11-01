import { NextRequest, NextResponse } from 'next/server'
import { GoogleCalendarService } from '@/lib/calendar/google'
import { auth } from '@/lib/auth/config'
import { CalendarEvent } from '@/types/calendar'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated. Please sign in with Google.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const timeMin = searchParams.get('timeMin')
    const timeMax = searchParams.get('timeMax')

    const googleCalendar = new GoogleCalendarService(session.accessToken)
    
    // First, get all calendars
    const calendars = await googleCalendar.getCalendars()
    
    // Fetch events from all calendars
    const allEvents: CalendarEvent[] = []
    for (const calendar of calendars) {
      try {
        const events = await googleCalendar.getEvents(
          calendar.id,
          timeMin ? new Date(timeMin) : undefined,
          timeMax ? new Date(timeMax) : undefined
        )
        
        // Add calendar info to each event
        events.forEach(event => {
          event.source = {
            id: calendar.id,
            name: calendar.name,
            type: 'google',
            color: calendar.color,
            enabled: true
          }
        })
        
        allEvents.push(...events)
      } catch (error) {
        console.error(`Error fetching events from calendar ${calendar.name}:`, error)
        // Continue with other calendars even if one fails
      }
    }

    // Sort all events by start date
    allEvents.sort((a, b) => a.start.getTime() - b.start.getTime())

    return NextResponse.json({ 
      events: allEvents,
      calendarsFetched: calendars.length,
      totalEvents: allEvents.length
    })
  } catch (error) {
    console.error('Google Calendar API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Google Calendar events' },
      { status: 500 }
    )
  }
}

