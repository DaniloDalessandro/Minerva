import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname
  const { pathname } = request.nextUrl
  
  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/demo-validation', '/demo-sector-validation']
  
  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // Get the token from cookies
  const token = request.cookies.get('access')?.value
  
  // If no token and trying to access protected route, redirect to login
  // Note: We only do a basic check here since localStorage verification happens on client-side
  if (!token && !isPublicRoute && pathname !== '/') {
    const loginUrl = new URL('/login', request.url)
    // Store the original URL to redirect after login
    loginUrl.searchParams.set('returnUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // If trying to access login while potentially authenticated (has cookie), redirect to dashboard
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // Allow access to root path and let client-side handle the redirect
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}