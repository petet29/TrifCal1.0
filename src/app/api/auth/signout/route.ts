import { signOut } from '@/lib/auth/config'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // NextAuth v5 signOut throws NEXT_REDIRECT, which is expected
    // Return success and let the client handle redirect
    signOut({ redirectTo: '/' })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    // NEXT_REDIRECT is expected behavior, not an error
    if (error?.message === 'NEXT_REDIRECT') {
      return NextResponse.json({ success: true })
    }
    console.error('Sign out error:', error)
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    )
  }
}

