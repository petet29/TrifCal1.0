import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    refreshToken?: string
    provider?: string
  }
}

export interface ExtendedSession extends DefaultSession {
  accessToken?: string
  refreshToken?: string
  provider?: string
}
