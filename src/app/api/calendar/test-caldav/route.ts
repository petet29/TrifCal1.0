import { NextResponse } from 'next/server'

export async function GET() {
  const username = 'trifiro@usa.net'
  const password = process.env.APPLE_CALDAV_PASSWORD || 'your_app_specific_password_here'
  
  // Common iCloud CalDAV URL patterns to try
  const commonUrls = [
    'https://caldav.icloud.com/',
    'https://caldav.icloud.com/123456789/calendars/',
    'https://p01-caldav.icloud.com/',
    'https://p02-caldav.icloud.com/',
    'https://p03-caldav.icloud.com/',
  ]

  const results = []

  for (const baseUrl of commonUrls) {
    try {
      // Test if the URL is accessible
      const response = await fetch(baseUrl, {
        method: 'PROPFIND',
        headers: {
          'Content-Type': 'application/xml',
          'Depth': '0',
          'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
        },
        body: `<?xml version="1.0" encoding="utf-8" ?>
<D:propfind xmlns:D="DAV:">
  <D:prop>
    <D:displayname/>
  </D:prop>
</D:propfind>`
      })

      results.push({
        url: baseUrl,
        status: response.status,
        statusText: response.statusText,
        success: response.ok
      })
    } catch (error) {
      results.push({
        url: baseUrl,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      })
    }
  }

  return NextResponse.json({
    message: 'CalDAV URL Test Results',
    username,
    passwordConfigured: !password.includes('your_app_specific_password_here'),
    results,
    instructions: {
      step1: 'Create an app-specific password at appleid.apple.com',
      step2: 'Update APPLE_CALDAV_PASSWORD in .env.local',
      step3: 'Try this endpoint again to test different URLs',
      step4: 'Use the working URL in your .env.local file'
    }
  })
}
