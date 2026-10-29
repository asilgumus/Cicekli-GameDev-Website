import React from 'react';
import { getBlogPosts } from '@/lib/data';
import BlogClient from './BlogClient';

export const dynamic = 'force-dynamic';

export default async function Blog() {
    const posts = await getBlogPosts();

    return <BlogClient posts={posts} />;
}
