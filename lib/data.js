import fs from 'fs';
import path from 'path';

const postsFilePath = path.join(process.cwd(), 'data', 'posts.json');

function readPosts() {
    try {
        const fileContents = fs.readFileSync(postsFilePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.error('Error reading posts:', error);
        return [];
    }
}

function writePosts(posts) {
    try {
        fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 4), 'utf8');
    } catch (error) {
        console.error('Error writing posts:', error);
        throw error;
    }
}

export function getEvents() {
    const posts = readPosts();

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

export function getBlogPosts() {
    const posts = readPosts();
    return posts.filter((post) => post.type === 'blog');
}

export function getAnnouncements() {
    const posts = readPosts();
    return posts.filter((post) => post.type === 'announcement');
}

export function getPostBySlug(slug) {
    const posts = readPosts();
    return posts.find((post) => post.slug === slug);
}

export function getPostById(id) {
    const posts = readPosts();
    return posts.find((post) => post.id === id);
}

export function savePost(newPost) {
    const posts = readPosts();
    posts.push(newPost);
    writePosts(posts);
    return newPost;
}

export function updatePost(id, updatedPost) {
    const posts = readPosts();
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
    writePosts(posts);
    return posts[index];
}

export function deletePost(id) {
    const posts = readPosts();
    const index = posts.findIndex((post) => post.id === id);

    if (index === -1) {
        throw new Error('Post not found');
    }

    const deletedPost = posts[index];
    posts.splice(index, 1);
    writePosts(posts);
    return deletedPost;
}
