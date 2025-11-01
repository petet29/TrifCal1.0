import { NextResponse } from 'next/server'

export async function GET() {
  const googleClientId = process.env.GOOGLE_CLIENT_ID
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
  const nextAuthSecret = process.env.NEXTAUTH_SECRET
  
  const isGoogleConfigured = 
    googleClientId && 
    !googleClientId.includes('your_google_client_id') &&
    googleClientSecret && 
    !googleClientSecret.includes('your_google_client_secret')
  
  const isNextAuthConfigured = 
    nextAuthSecret && 
    !nextAuthSecret.includes('your_nextauth_secret')
  
  return NextResponse.json({
    google: {
      configured: isGoogleConfigured,
      clientId: googleClientId ? googleClientId.substring(0, 10) + '...' : 'Not set',
      clientSecret: googleClientSecret ? 'Set (hidden)' : 'Not set'
    },
    nextAuth: {
      configured: isNextAuthConfigured,
      secret: nextAuthSecret ? 'Set (hidden)' : 'Not set',
      url: process.env.NEXTAUTH_URL || 'Not set'
    },
    allConfigured: isGoogleConfigured && isNextAuthConfigured,
    instructions: {
      step1: 'Get Google OAuth credentials from Google Cloud Console',
      step2: 'Generate NEXTAUTH_SECRET: openssl rand -base64 32',
      step3: 'Update .env.local with your credentials',
      step4: 'Restart the development server',
      step5: 'Or use test endpoint with access token: /api/calendar/google/test?token=YOUR_TOKEN'
    }
  })
}
