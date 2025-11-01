import { NextRequest, NextResponse } from 'next/server'
import { GoogleCalendarService } from '@/lib/calendar/google'
import { auth } from '@/lib/auth/config'

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
    const calendarId = searchParams.get('calendarId') || 'primary'
    const timeMin = searchParams.get('timeMin')
    const timeMax = searchParams.get('timeMax')

    const googleCalendar = new GoogleCalendarService(session.accessToken)
    
    const events = await googleCalendar.getEvents(
      calendarId,
      timeMin ? new Date(timeMin) : undefined,
      timeMax ? new Date(timeMax) : undefined
    )

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Google Calendar API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Google Calendar events' },
      { status: 500 }
    )
  }
}
