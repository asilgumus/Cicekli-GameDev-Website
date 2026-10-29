import { NextResponse } from 'next/server';

export function middleware(request) {
    const path = request.nextUrl.pathname;

    // Check if the path starts with /admin
    if (path.startsWith('/admin')) {
        const token = request.cookies.get('auth_token')?.value;

        // Redirect unless the cookie matches the configured session token
        if (!token || token !== process.env.ADMIN_SESSION_TOKEN) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
