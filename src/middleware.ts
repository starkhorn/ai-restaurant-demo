import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // If user is not authenticated and trying to access admin routes
    if (req.nextUrl.pathname.startsWith('/admin') && !req.nextauth.token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to admin routes only for authenticated users
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*']
}