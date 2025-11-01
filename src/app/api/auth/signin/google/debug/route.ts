import { NextResponse } from 'next/server'

export async function GET() {
  // Debug endpoint to check environment variables
  return NextResponse.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 10)}...` : 'NOT SET',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'SET (hidden)' : 'NOT SET',
    nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'SET (hidden)' : 'NOT SET',
    nextAuthUrl: process.env.NEXTAUTH_URL || 'NOT SET',
  })
}
