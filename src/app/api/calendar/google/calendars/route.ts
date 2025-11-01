import { NextResponse } from 'next/server'
import { GoogleCalendarService } from '@/lib/calendar/google'
import { auth } from '@/lib/auth/config'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated. Please sign in with Google.' },
        { status: 401 }
      )
    }

    const googleCalendar = new GoogleCalendarService(session.accessToken)
    const calendars = await googleCalendar.getCalendars()

    return NextResponse.json({ calendars })
  } catch (error) {
    console.error('Google Calendar list API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Google Calendar list' },
      { status: 500 }
    )
  }
}
