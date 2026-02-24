import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

export default auth((req) => {
  const pathname = req.nextUrl.pathname;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!req.auth) {
      // Not logged in, redirect to login
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const role = (req.auth.user as any)?.role;
    if (role !== 'ADMIN') {
      // Not admin, redirect to home
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*'],
};
