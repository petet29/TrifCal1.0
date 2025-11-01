import { auth } from '@/lib/auth/config'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ 
        authenticated: false,
        user: null 
      })
    }

    return NextResponse.json({ 
      authenticated: true,
      user: {
        name: session.user?.name,
        email: session.user?.email,
        image: session.user?.image,
      },
      provider: (session as any).provider,
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ 
      authenticated: false,
      error: 'Failed to check session' 
    }, { status: 500 })
  }
}

