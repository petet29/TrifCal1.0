import { NextResponse } from 'next/server'
import { AppleCalendarService } from '@/lib/calendar/apple'

export async function GET() {
  try {
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
    const calendars = await appleCalendar.getCalendars()

    return NextResponse.json({ calendars })
  } catch (error) {
    console.error('Apple Calendar list API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Apple Calendar list' },
      { status: 500 }
    )
  }
}
