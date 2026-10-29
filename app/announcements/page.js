import React from 'react';
import { getAnnouncements } from '@/lib/data';
import AnnouncementsClient from './AnnouncementsClient';

export const dynamic = 'force-dynamic';

export default async function Announcements() {
    const announcements = await getAnnouncements();

    return <AnnouncementsClient announcements={announcements} />;
}
