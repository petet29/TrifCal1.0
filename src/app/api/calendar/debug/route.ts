import { NextResponse } from 'next/server'

export async function GET() {
  const caldavUrl = process.env.APPLE_CALDAV_URL
  const username = process.env.APPLE_CALDAV_USERNAME
  const password = process.env.APPLE_CALDAV_PASSWORD

  return NextResponse.json({
    message: 'Apple Calendar Configuration Status',
    caldavUrl: caldavUrl?.replace(/\/\d+\//, '/[HIDDEN]/') || 'Not set',
    username: username?.replace(/(.{2}).*(@.*)/, '$1***$2') || 'Not set',
    password: password ? 'Set (hidden)' : 'Not set',
    isConfigured: !caldavUrl?.includes('your_apple_caldav_url_here') && 
                  !username?.includes('your_apple_username_here') && 
                  !password?.includes('your_apple_password_here'),
    instructions: {
      step1: 'Find your CalDAV URL (usually https://caldav.icloud.com/YOUR_NUMBER/calendars/)',
      step2: 'Create an app-specific password at appleid.apple.com',
      step3: 'Update .env.local with your real credentials',
      step4: 'Restart the development server'
    }
  })
}
