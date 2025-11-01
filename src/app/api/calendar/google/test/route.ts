import { NextRequest, NextResponse } from 'next/server'
import { GoogleCalendarService } from '@/lib/calendar/google'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accessToken = searchParams.get('token')
    
    if (!accessToken) {
      return NextResponse.json({
        error: 'Access token required',
        instructions: {
          step1: 'Get your Google Calendar API access token',
          step2: 'You can use Google OAuth Playground: https://developers.google.com/oauthplayground/',
          step3: 'Select "Calendar API v3" and authorize',
          step4: 'Copy the access token and add ?token=YOUR_TOKEN to this URL',
          step5: 'Or use the /api/auth/signin endpoint to sign in with Google'
        }
      }, { status: 400 })
    }

    const googleCalendar = new GoogleCalendarService(accessToken)
    const calendars = await googleCalendar.getCalendars()
    const events = await googleCalendar.getEvents('primary')

    return NextResponse.json({
      success: true,
      calendarsCount: calendars.length,
      eventsCount: events.length,
      calendars: calendars.slice(0, 5), // First 5 calendars
      sampleEvents: events.slice(0, 3) // First 3 events
    })
  } catch (error) {
    console.error('Google Calendar test error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to test Google Calendar',
      success: false
    }, { status: 500 })
  }
}
