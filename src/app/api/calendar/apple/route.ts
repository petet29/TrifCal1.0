import { NextRequest, NextResponse } from 'next/server'
import { AppleCalendarService } from '@/lib/calendar/apple'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const calendarId = searchParams.get('calendarId') || 'home'
    const timeMin = searchParams.get('timeMin')
    const timeMax = searchParams.get('timeMax')

    // Get credentials from environment
    const caldavUrl = process.env.APPLE_CALDAV_URL
    const username = process.env.APPLE_CALDAV_USERNAME
    const password = process.env.APPLE_CALDAV_PASSWORD

    if (!caldavUrl || !username || !password) {
      return NextResponse.json(
        { error: 'Apple Calendar credentials not configured' },
        { status: 500 }
      )
    }

    const appleCalendar = new AppleCalendarService(caldavUrl, username, password)
    
    const events = await appleCalendar.getEvents(
      calendarId,
      timeMin ? new Date(timeMin) : undefined,
      timeMax ? new Date(timeMax) : undefined
    )

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Apple Calendar API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Apple Calendar events' },
      { status: 500 }
    )
  }
}
