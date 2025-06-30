// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuth } from './app/shared/utils/session.server'
import { UserGroupRole } from './app/shared/types/models'

const authPages = ['/auth']
const protectedUserRoutes = ['/user']
const protectedGroupAdminRoutes = ['/group-admin']
const protectedGlobalAdminRoutes = ['/global-admin']

export async function middleware(request: NextRequest) {
  const session = await verifyAuth(request)
  const pathname = request.nextUrl.pathname

  // User not logged in but trying to access protected pages
  const isProtected =
    protectedUserRoutes.some(p => pathname.startsWith(p)) ||
    protectedGroupAdminRoutes.some(p => pathname.startsWith(p)) ||
    protectedGlobalAdminRoutes.some(p => pathname.startsWith(p))

  if (!session && isProtected) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // User is logged in but tries to visit login/register
  if (session && authPages.includes(pathname)) {
    return NextResponse.redirect(new URL('/user', request.url))
  }

  // Enforce global admin access
  if (pathname.startsWith('/global-admin') && !session?.isGlobalAdmin) {
    return NextResponse.redirect(new URL('/user', request.url))
  }


  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|static|favicon.ico|fonts|images).*)'],
}
