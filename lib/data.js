import fs from 'fs';
import path from 'path';
import { del, list, put } from '@vercel/blob';
import seedPosts from '../data/posts.json';

const BLOB_KEY = 'posts.json';
const postsFilePath = path.join(process.cwd(), 'data', 'posts.json');

// Üretimde veri Vercel Blob'daki posts.json'da tutulur, blob boşsa
// repo'yla gelen data/posts.json ile tohumlanır. Lokal geliştirmede
// BLOB_READ_WRITE_TOKEN yoksa doğrudan dosya kullanılır.
function useBlob() {
    return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readLocalPosts() {
    try {
        const fileContents = fs.readFileSync(postsFilePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.error('Error reading posts:', error);
        return [];
    }
}

// Public blob URL'leri 30 gün CDN cache'lenir ve overwrite cache'i bozmadığı
// için her yazım yeni bir sürüm (rastgele suffix) olarak saklanır; okuma
// list() ile en güncel sürümü alır.
function newestFirst(a, b) {
    return new Date(b.uploadedAt) - new Date(a.uploadedAt);
}

async function readBlobPosts() {
    const { blobs } = await list({ prefix: 'posts' });
    const latest = blobs.sort(newestFirst)[0];
    if (!latest) {
        return null;
    }

    const res = await fetch(latest.url, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error(`Posts blob read failed: ${res.status}`);
    }
    return res.json();
}

async function writeBlobPosts(posts) {
    await put(BLOB_KEY, JSON.stringify(posts, null, 4), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: true,
    });

    // En yeni iki sürümü tut, eskilerini sil
    const { blobs } = await list({ prefix: 'posts' });
    const stale = blobs.sort(newestFirst).slice(2);
    if (stale.length) {
        await del(stale.map((b) => b.url)).catch((error) => {
            console.error('Error cleaning up old post blobs:', error);
        });
    }
}

async function readPosts() {
    if (!useBlob()) {
        return readLocalPosts();
    }

    const posts = await readBlobPosts();
    if (posts) {
        return posts;
    }

    // Blob boş (ilk deploy): repo'yla gelen veriyle tohumla
    const seeded = seedPosts;
    await writeBlobPosts(seeded);
    return seeded;
}

async function writePosts(posts) {
    if (!useBlob()) {
        try {
            fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 4), 'utf8');
        } catch (error) {
            console.error('Error writing posts:', error);
            throw error;
        }
        return;
    }

    await writeBlobPosts(posts);
}

export async function getEvents() {
    const posts = await readPosts();

    // Etkinlikler, type alanı "event_upcoming" veya "event_past" olan gönderilerden türetilir
    const eventPosts = posts.filter(
        (post) => post.type === 'event_upcoming' || post.type === 'event_past'
    );

    return eventPosts.map((post) => ({
        id: post.id,
        title: post.title,
        // Etkinlik için özel tarih alanı varsa onu kullan, yoksa gönderi tarihini kullan
        date: post.eventDate || post.date,
        description: post.excerpt,
        fullContent: post.content,
        tag: post.tag || (post.type === 'event_upcoming' ? 'Yaklaşan' : 'Geçmiş'),
        type: post.type === 'event_upcoming' ? 'upcoming' : 'past',
        slug: post.slug,
        imageUrl: post.imageUrl || null,
    }));
}

export async function getBlogPosts() {
    const posts = await readPosts();
    return posts.filter((post) => post.type === 'blog');
}

export async function getAnnouncements() {
    const posts = await readPosts();
    return posts.filter((post) => post.type === 'announcement');
}

export async function getPostBySlug(slug) {
    const posts = await readPosts();
    return posts.find((post) => post.slug === slug);
}

export async function getPostById(id) {
    const posts = await readPosts();
    return posts.find((post) => post.id === id);
}

export async function savePost(newPost) {
    const posts = await readPosts();
    posts.push(newPost);
    await writePosts(posts);
    return newPost;
}

export async function updatePost(id, updatedPost) {
    const posts = await readPosts();
    const index = posts.findIndex((post) => post.id === id);

    if (index === -1) {
        throw new Error('Post not found');
    }

    // Slug'ı güncelle eğer title değiştiyse
    if (updatedPost.title && updatedPost.title !== posts[index].title) {
        updatedPost.slug = updatedPost.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    }

    posts[index] = { ...posts[index], ...updatedPost };
    await writePosts(posts);
    return posts[index];
}

export async function deletePost(id) {
    const posts = await readPosts();
    const index = posts.findIndex((post) => post.id === id);

    if (index === -1) {
        throw new Error('Post not found');
    }

    const deletedPost = posts[index];
    posts.splice(index, 1);
    await writePosts(posts);
    return deletedPost;
}