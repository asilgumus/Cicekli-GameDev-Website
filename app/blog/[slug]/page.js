import React from 'react';
import styles from './page.module.css';
import { getPostBySlug } from '@/lib/data';
import BlogPostClient from './BlogPostClient';

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ params }) {
    const resolvedParams = await params;
    const post = await getPostBySlug(resolvedParams.slug);

    if (!post) {
        return <div className={styles.container}>Gönderi bulunamadı</div>;
    }

    return <BlogPostClient post={post} />;
}
