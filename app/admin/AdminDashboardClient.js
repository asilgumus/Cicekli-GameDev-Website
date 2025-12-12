"use client";

import React from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { Plus, FileText, Megaphone, Edit, CalendarDays, Trash2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function AdminDashboardClient({ blogPosts, announcements, upcomingEvents, pastEvents }) {
    const { t } = useTranslation();
    const router = useRouter();

    const handleDelete = async (id, title) => {
        if (!confirm(t('admin.deleteConfirm').replace('{title}', title))) {
            return;
        }

        try {
            const response = await fetch(`/api/posts?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.refresh();
            } else {
                alert(t('common.error'));
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert(t('common.error'));
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>{t('admin.title')}</h1>
                <Link href="/admin/new">
                    <Button variant="primary" icon={Plus}>
                        {t('admin.createPost')}
                    </Button>
                </Link>
            </header>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    {t('admin.blogPosts')}
                </h2>
                <div className={styles.list}>
                    {blogPosts.map((post) => (
                        <div key={post.id} className={styles.item}>
                            <div className={styles.itemInfo}>
                                <FileText size={20} className={styles.icon} />
                                <div>
                                    <h3 className={styles.itemTitle}>
                                        {post.title}
                                    </h3>
                                    <span className={styles.date}>
                                        {post.date}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.actions}>
                                <span className={styles.status}>
                                    {t('admin.published')}
                                </span>
                                <Link href={`/admin/edit/${post.id}`}>
                                    <Button
                                        variant="secondary"
                                        icon={Edit}
                                        className={styles.editButton}
                                    >
                                        {t('admin.edit')}
                                    </Button>
                                </Link>
                                <Button
                                    variant="danger"
                                    icon={Trash2}
                                    className={styles.deleteButton}
                                    onClick={() => handleDelete(post.id, post.title)}
                                >
                                    {t('admin.delete')}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    {t('admin.announcements')}
                </h2>
                <div className={styles.list}>
                    {announcements.map((post) => (
                        <div key={post.id} className={styles.item}>
                            <div className={styles.itemInfo}>
                                <Megaphone
                                    size={20}
                                    className={styles.icon}
                                />
                                <div>
                                    <h3 className={styles.itemTitle}>
                                        {post.title}
                                    </h3>
                                    <span className={styles.date}>
                                        {post.date}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.actions}>
                                <span className={styles.status}>
                                    {t('admin.published')}
                                </span>
                                <Link href={`/admin/edit/${post.id}`}>
                                    <Button
                                        variant="secondary"
                                        icon={Edit}
                                        className={styles.editButton}
                                    >
                                        {t('admin.edit')}
                                    </Button>
                                </Link>
                                <Button
                                    variant="danger"
                                    icon={Trash2}
                                    className={styles.deleteButton}
                                    onClick={() => handleDelete(post.id, post.title)}
                                >
                                    {t('admin.delete')}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    {t('admin.eventsTitle')}
                </h2>
                <div className={styles.list}>
                    {upcomingEvents.map((event) => (
                        <div key={event.id} className={styles.item}>
                            <div className={styles.itemInfo}>
                                <CalendarDays
                                    size={20}
                                    className={styles.icon}
                                />
                                <div>
                                    <h3 className={styles.itemTitle}>
                                        {event.title}
                                    </h3>
                                    <span className={styles.date}>
                                        {event.date}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.actions}>
                                <span className={styles.status}>
                                    {t('admin.upcomingEvent')}
                                </span>
                                <Link href={`/admin/edit/${event.id}`}>
                                    <Button
                                        variant="secondary"
                                        icon={Edit}
                                        className={styles.editButton}
                                    >
                                        {t('admin.edit')}
                                    </Button>
                                </Link>
                                <Button
                                    variant="danger"
                                    icon={Trash2}
                                    className={styles.deleteButton}
                                    onClick={() => handleDelete(event.id, event.title)}
                                >
                                    {t('admin.delete')}
                                </Button>
                            </div>
                        </div>
                    ))}
                    {pastEvents.map((event) => (
                        <div key={event.id} className={styles.item}>
                            <div className={styles.itemInfo}>
                                <CalendarDays
                                    size={20}
                                    className={styles.icon}
                                />
                                <div>
                                    <h3 className={styles.itemTitle}>
                                        {event.title}
                                    </h3>
                                    <span className={styles.date}>
                                        {event.date}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.actions}>
                                <span className={styles.status}>
                                    {t('admin.pastEvent')}
                                </span>
                                <Link href={`/admin/edit/${event.id}`}>
                                    <Button
                                        variant="secondary"
                                        icon={Edit}
                                        className={styles.editButton}
                                    >
                                        {t('admin.edit')}
                                    </Button>
                                </Link>
                                <Button
                                    variant="danger"
                                    icon={Trash2}
                                    className={styles.deleteButton}
                                    onClick={() => handleDelete(event.id, event.title)}
                                >
                                    {t('admin.delete')}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

