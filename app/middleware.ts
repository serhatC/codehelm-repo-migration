
export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/migrate/:path*',
    '/history/:path*',
    '/repositories/:path*',
    '/settings/:path*',
    '/premium/:path*',
    '/migrations/:path*'
  ]
}
