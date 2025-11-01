import { signIn } from '@/lib/auth/config'
import { NextRequest } from 'next/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  // Validate environment variables first
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    redirect('/auth/error?error=Configuration&message=Missing Google OAuth credentials')
  }

  if (!process.env.NEXTAUTH_SECRET) {
    redirect('/auth/error?error=Configuration&message=Missing NEXTAUTH_SECRET')
  }

  const { searchParams } = new URL(request.url)
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  
  // NextAuth v5 signIn throws NEXT_REDIRECT which is expected behavior
  // We need to let it propagate, not catch it
  return await signIn('google', { 
    redirectTo: callbackUrl,
    redirect: true 
  })
}
