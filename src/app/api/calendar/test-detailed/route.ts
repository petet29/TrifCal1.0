import { NextResponse } from 'next/server'

export async function GET() {
  const username = 'trifiro@usa.net'
  const password = process.env.APPLE_CALDAV_PASSWORD
  
  if (!password) {
    return NextResponse.json({ error: 'Password not configured' })
  }

  const baseUrl = 'https://caldav.icloud.com/'
  
  try {
    // First, try to get the principal URL
    const response = await fetch(baseUrl, {
      method: 'PROPFIND',
      headers: {
        'Content-Type': 'application/xml',
        'Depth': '0',
        'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
      },
      body: `<?xml version="1.0" encoding="utf-8" ?>
<D:propfind xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">
  <D:prop>
    <D:current-user-principal/>
    <C:calendar-home-set/>
  </D:prop>
</D:propfind>`
    })

    const xmlData = await response.text()
    
    // Extract the calendar home set URL
    const calendarHomeMatch = xmlData.match(/<C:calendar-home-set><D:href>(.*?)<\/D:href><\/C:calendar-home-set>/)
    const calendarHomeUrl = calendarHomeMatch ? calendarHomeMatch[1] : null

    return NextResponse.json({
      message: 'Detailed CalDAV Test',
      status: response.status,
      statusText: response.statusText,
      calendarHomeUrl,
      xmlResponse: xmlData.substring(0, 1000) + '...',
      success: response.ok
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    })
  }
}
