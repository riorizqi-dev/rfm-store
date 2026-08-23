import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'panel-x7k9m2p4q';

function getJwtSecret(): Uint8Array {
  return new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-change-me');
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secretBase = `/${ADMIN_SECRET}`;

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const isSecretRoute = pathname === secretBase || pathname.startsWith(`${secretBase}/`);
  if (!isSecretRoute) return NextResponse.next();

  const isDashboard = pathname.startsWith(`${secretBase}/dashboard`);
  const token = request.cookies.get('admin_session')?.value;

  if (isDashboard) {
    if (!token) {
      return NextResponse.redirect(new URL(secretBase, request.url));
    }
    try {
      await jwtVerify(token, getJwtSecret());
    } catch {
      const res = NextResponse.redirect(new URL(secretBase, request.url));
      res.cookies.delete('admin_session');
      return res;
    }
  } else {
    if (token) {
      try {
        await jwtVerify(token, getJwtSecret());
        return NextResponse.redirect(new URL(`${secretBase}/dashboard`, request.url));
      } catch {
        // expired token, stay on login
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico|logos).*)'],
};
