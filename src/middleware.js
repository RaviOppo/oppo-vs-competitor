import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Allow access to login page without auth
    if (path === '/login') {
      if (token) {
        // Already logged in, redirect to home
        return NextResponse.redirect(new URL('/', req.url));
      }
      return NextResponse.next();
    }

    // Protect admin routes - only admin role
    if (path.startsWith('/admin')) {
      if (!token || token.role !== 'admin') {
        return NextResponse.redirect(new URL('/login?callbackUrl=' + path, req.url));
      }
      return NextResponse.next();
    }

    // Protect home page - any authenticated user
    if (path === '/') {
      if (!token) {
        return NextResponse.redirect(new URL('/login?callbackUrl=/', req.url));
      }
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // Allow login page without token
        if (path === '/login') return true;
        // Require token for all other pages
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/', '/login', '/admin/:path*'],
};