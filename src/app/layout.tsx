import type { Metadata } from 'next'
import './globals.css'
import SessionProvider from '@/components/SessionProvider'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: 'Immpact — Parent Career Guidance Assessment',
  description: 'Discover how effectively you are guiding your child\'s career and education journey.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
