import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import redis from './lib/redis';

export async function middleware(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session_id')?.value;

    if (!sessionId && request.nextUrl.pathname.startsWith('/challenges')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (sessionId) {
      try {
        const session = await redis.get(`session:${sessionId}`);
        if (!session && request.nextUrl.pathname.startsWith('/challenges')) {
          return NextResponse.redirect(new URL('/login', request.url));
        }
      } catch (error) {
        console.error('Redis error in middleware:', error);
        return NextResponse.next();
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/challenges/:path*'],
}; 