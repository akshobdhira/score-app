import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/admin/login',
  },
})

export const config = {
  // Protects /admin and all sub-paths except /admin/login itself
  matcher: ['/admin', '/admin/((?!login$).+)'],
}
