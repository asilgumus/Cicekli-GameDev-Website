import { NextResponse } from 'next/server';
import { savePost, updatePost, getPostById, deletePost } from '@/lib/data';
import { isAuthorized, unauthorized } from '@/lib/auth';

export async function POST(request) {
    if (!isAuthorized(request)) return unauthorized();

    try {
        const body = await request.json();

        // Simple validation
        if (!body.title || !body.content || !body.type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newPost = {
            id: Date.now().toString(),
            slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
            date: new Date().toISOString().split('T')[0],
            author: 'Admin', // Hardcoded for now
            // Opsiyonel alanlar (etkinlik bilgileri ve görsel)
            excerpt: body.excerpt || '',
            content: body.content,
            type: body.type,
            author: body.author || 'Admin',
            eventDate: body.eventDate || null,
            tag: body.tag || null,
            imageUrl: body.imageUrl || null,
        };

        await savePost(newPost);

        return NextResponse.json({ success: true, post: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request) {
    if (!isAuthorized(request)) return unauthorized();

    try {
        const body = await request.json();

        // Simple validation
        if (!body.id || !body.title || !body.content || !body.type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const updatedPost = await updatePost(body.id, {
            title: body.title,
            excerpt: body.excerpt,
            content: body.content,
            type: body.type,
            author: body.author || 'Admin',
            eventDate: body.eventDate || null,
            tag: body.tag || null,
            imageUrl: body.imageUrl || null,
        });

        return NextResponse.json({ success: true, post: updatedPost });
    } catch (error) {
        console.error('Error updating post:', error);
        if (error.message === 'Post not found') {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request) {
    if (!isAuthorized(request)) return unauthorized();

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            const post = await getPostById(id);
            if (!post) {
                return NextResponse.json({ error: 'Post not found' }, { status: 404 });
            }
            return NextResponse.json({ success: true, post });
        }

        return NextResponse.json({ error: 'ID parameter required' }, { status: 400 });
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request) {
    if (!isAuthorized(request)) return unauthorized();

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID parameter required' }, { status: 400 });
        }

        const deletedPost = await deletePost(id);
        return NextResponse.json({ success: true, post: deletedPost });
    } catch (error) {
        console.error('Error deleting post:', error);
        if (error.message === 'Post not found') {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
