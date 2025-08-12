import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { Role } from '@/types/permission';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is a protected route
  const isProtectedRoute = [
    '/dashboard',
    '/profile',
    '/users',
    '/permissions',
    '/role-permissions',
    '/admin',
    '/settings',
  ].some(route => pathname.startsWith(route));
  
  // Check if the path is an auth route
  const isAuthRoute = [
    '/login',
    '/register',
    '/forgot-password',
  ].some(route => pathname === route);
  
  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || 'your-super-secret-key-change-this-in-production',
  });
  
  // Redirect logic
  if (isProtectedRoute && !token) {
    // Redirect to login if trying to access protected route without token
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
  if (isAuthRoute && token) {
    // Redirect to dashboard if trying to access auth route with token
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Admin route protection
  if ((pathname.startsWith('/users') || pathname.startsWith('/permissions') || pathname.startsWith('/role-permissions') || pathname.startsWith('/admin')) && token?.role !== ('admin' as Role)) {
    // Redirect non-admin users trying to access admin routes
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Continue with the request if no redirects are needed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};