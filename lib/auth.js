import { NextResponse } from 'next/server';

// Cookie değeri env'deki oturum token'ıyla eşleşmeli
export function isAuthorized(request) {
    const token = request.cookies.get('auth_token')?.value;
    const expected = process.env.ADMIN_SESSION_TOKEN;
    return Boolean(expected) && token === expected;
}

export function unauthorized() {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}