import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
 
const PUBLIC_ADMIN_PATHS = ['/admin/sign-in', '/admin/sign-up'];

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some((path) => 
    pathname.startsWith(path)
  )

  if (token && isPublicAdminPath) {
      return NextResponse.redirect(new URL('/admin', request.url))
  }

  if (!token && pathname.startsWith('/admin') && !isPublicAdminPath) {
    return NextResponse.redirect(new URL('/admin/sign-in', request.url))
  }

  return NextResponse.next()
}
 
export const config = {
  matcher: ['/admin/:path*'],
}