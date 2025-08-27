import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth/auth-config';

export async function middleware(request: NextRequest) {
  try {
    const session = await auth();
    const isAuthPage = request.nextUrl.pathname.startsWith('/login');
    const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard') ||
                            request.nextUrl.pathname.startsWith('/bug-capture');

    // If user is not authenticated and trying to access protected routes
    if (!session && isProtectedPage) {
      const loginUrl = new URL('/login', request.url);
      // Add a returnTo parameter to redirect back after login
      loginUrl.searchParams.set('returnTo', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If user is authenticated and trying to access auth pages
    if (session && isAuthPage) {
      // Check if there's a returnTo parameter
      const returnTo = request.nextUrl.searchParams.get('returnTo');
      const redirectUrl = returnTo || '/bug-capture';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, allow the request to continue
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/bug-capture',
    '/login',
  ],
};
