import React from 'react';
import { getEvents } from '@/lib/data';
import EventsClient from './EventsClient';

export const dynamic = 'force-dynamic';

export default async function Events() {
    const events = await getEvents();
    const upcomingEvents = events.filter(e => e.type === 'upcoming');
    const pastEvents = events.filter(e => e.type === 'past');

    return <EventsClient upcomingEvents={upcomingEvents} pastEvents={pastEvents} />;
}
