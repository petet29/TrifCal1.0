import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Apple from 'next-auth/providers/apple'
import { ExtendedSession } from '@/types/auth'

// Validate required environment variables at build/start time
const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
const nextAuthSecret = process.env.NEXTAUTH_SECRET

if (!googleClientId || !googleClientSecret) {
  console.error('Error: Google OAuth credentials not configured')
}

if (!nextAuthSecret) {
  console.error('Error: NEXTAUTH_SECRET not configured')
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: googleClientId || 'missing-client-id',
      clientSecret: googleClientSecret || 'missing-client-secret',
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/calendar.readonly'
        }
      }
    }),
    Apple({
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.provider = account.provider
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        const extendedSession = session as ExtendedSession
        extendedSession.accessToken = token.accessToken as string
        extendedSession.refreshToken = token.refreshToken as string
        extendedSession.provider = token.provider as string
      }
      return session
    },
  },
  // Note: In NextAuth v5, custom pages might cause routing issues
  // We'll handle errors via the error page component
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update session if older than 24 hours
  },
  secret: nextAuthSecret || 'missing-secret',
  // Explicitly set the base URL for NextAuth v5
  basePath: '/api/auth',
  // Trust host for localhost
  trustHost: true,
})
