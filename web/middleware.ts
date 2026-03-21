import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// We use process.env here. `jsonwebtoken` doesn't work in Edge Runtime completely, so we'll just check if the cookie exists.
// A better approach is using `jose` which is Edge compatible.
const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'supersecretjwtkey');

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('adminToken')?.value;
  const isLoginPage = req.nextUrl.pathname.startsWith('/admin/login') || req.nextUrl.pathname.startsWith('/api/admin/login') || req.nextUrl.pathname.startsWith('/api/admin/setup');
  
  if (req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/api/admin')) {
    if (isLoginPage) return NextResponse.next();

    if (!token) {
      if (req.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (err) {
      if (req.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
      }
      const response = NextResponse.redirect(new URL('/admin/login', req.url));
      response.cookies.delete('adminToken');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin', '/api/admin/:path*'],
};
