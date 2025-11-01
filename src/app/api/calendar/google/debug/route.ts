import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session || !session.accessToken) {
      return NextResponse.json({ 
        error: 'Not authenticated',
        hasSession: !!session,
        hasAccessToken: !!(session?.accessToken)
      })
    }

    // Test the Google Calendar API directly
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
    
    const params = new URLSearchParams({
      singleEvents: 'true',
      orderBy: 'startTime',
      timeMin: firstDay.toISOString(),
      timeMax: lastDay.toISOString(),
      maxResults: '10'
    })

    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    return NextResponse.json({
      authenticated: true,
      apiResponse: {
        status: response.status,
        statusText: response.statusText,
        hasItems: !!(data.items && data.items.length > 0),
        itemCount: data.items?.length || 0,
        firstEvent: data.items?.[0] || null,
        error: data.error || null
      },
      dateRange: {
        timeMin: firstDay.toISOString(),
        timeMax: lastDay.toISOString()
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

