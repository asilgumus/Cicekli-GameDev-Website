import React from 'react';
import { getBlogPosts, getAnnouncements, getEvents } from '@/lib/data';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const blogPosts = await getBlogPosts();
    const announcements = await getAnnouncements();
    const events = await getEvents();

    const upcomingEvents = events.filter((e) => e.type === 'upcoming');
    const pastEvents = events.filter((e) => e.type === 'past');

    return (
        <AdminDashboardClient
            blogPosts={blogPosts}
            announcements={announcements}
            upcomingEvents={upcomingEvents}
            pastEvents={pastEvents}
        />
    );
}
