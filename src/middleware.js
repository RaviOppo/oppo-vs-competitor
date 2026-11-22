import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Skip middleware during build/prerender (no valid URL)
    if (!req.url || req.url.includes('undefined')) {
      return NextResponse.next();
    }

    // Allow user login page without auth
    if (path === '/login') {
      if (token) {
        try {
          return NextResponse.redirect(new URL('/', req.url));
        } catch {
          return NextResponse.next();
        }
      }
      return NextResponse.next();
    }

    // Allow admin login page without auth
    if (path === '/admin/login') {
      if (token && token.role === 'admin') {
        try {
          return NextResponse.redirect(new URL('/admin', req.url));
        } catch {
          return NextResponse.next();
        }
      }
      return NextResponse.next();
    }

    // Protect admin routes - only admin role
    if (path.startsWith('/admin')) {
      if (!token || token.role !== 'admin') {
        try {
          return NextResponse.redirect(new URL('/admin/login?callbackUrl=' + path, req.url));
        } catch {
          return NextResponse.next();
        }
      }
      return NextResponse.next();
    }

    // Protect home page (/) - require authenticated user (user OR admin)
    if (path === '/') {
      if (!token) {
        try {
          return NextResponse.redirect(new URL('/login?callbackUrl=/', req.url));
        } catch {
          return NextResponse.next();
        }
      }
      // Allow both 'user' and 'admin' roles
      if (token.role !== 'user' && token.role !== 'admin') {
        try {
          return NextResponse.redirect(new URL('/login?callbackUrl=/', req.url));
        } catch {
          return NextResponse.next();
        }
      }
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // Allow login pages without token
        if (path === '/login' || path === '/admin/login') return true;
        // Require token for home page (user OR admin)
        if (path === '/') return token?.role === 'user' || token?.role === 'admin';
        // Require admin token for admin routes
        if (path.startsWith('/admin')) return token?.role === 'admin';
        // Allow all other pages
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/', '/login', '/admin/:path*'],
};