import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const sessionToken = process.env.ADMIN_SESSION_TOKEN;

        if (!adminUsername || !adminPassword || !sessionToken) {
            return NextResponse.json(
                { error: 'Auth not configured: set ADMIN_USERNAME, ADMIN_PASSWORD and ADMIN_SESSION_TOKEN' },
                { status: 500 }
            );
        }

        if (username === adminUsername && password === adminPassword) {
            const response = NextResponse.json({ success: true });

            // Secure cookie settings
            response.cookies.set('auth_token', sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });

            return response;
        }

        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
