import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getIP } from '@/lib/rateLimit'
import { createHash, timingSafeEqual } from 'crypto'

// Hash first so inputs of any length compare in constant time
function safeEqual(a: string, b: string): boolean {
  const hash = (s: string) => createHash('sha256').update(s).digest()
  return timingSafeEqual(hash(a), hash(b))
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const validUsername = process.env.ADMIN_USERNAME
        const validPassword = process.env.ADMIN_PASSWORD
        if (!validUsername || !validPassword || !credentials) return null

        // Both checks always run so timing never reveals which one failed
        const userOk = safeEqual(credentials.username, validUsername)
        const passOk = safeEqual(credentials.password, validPassword)
        if (userOk && passOk) {
          return { id: '1', name: 'Admin' }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

// GET passes straight through — only POST (login attempt) is rate limited
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(...args: any[]) {
  return (handler as any)(...args)
}

export async function POST(req: NextRequest, ...rest: unknown[]) {
  const ip = getIP(req)
  const { allowed } = await checkRateLimit(`admin-login:${ip}`, 5, 15)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again in 15 minutes.' },
      { status: 429 }
    )
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (handler as any)(req, ...rest)
}
