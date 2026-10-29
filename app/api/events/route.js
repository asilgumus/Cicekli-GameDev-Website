import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/data';
import { isAuthorized, unauthorized } from '@/lib/auth';

export async function GET() {
    try {
        const events = await getEvents();
        return NextResponse.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request) {
    if (!isAuthorized(request)) return unauthorized();

    try {
        const body = await request.json();

        // Simple validation
        if (!body.title || !body.description || !body.type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // For now, just return success. In a real app, save to file or DB
        return NextResponse.json({ success: true, event: body });
    } catch (error) {
        console.error('Error creating event:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
