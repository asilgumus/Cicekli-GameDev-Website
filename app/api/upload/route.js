import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';
import { isAuthorized, unauthorized } from '@/lib/auth';

export async function POST(request) {
    if (!isAuthorized(request)) return unauthorized();

    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file || typeof file === 'string') {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Yol gezinmesini engelle: sadece dosya adını al, özel karakterleri temizle
        const baseName = file.name.split('/').pop().split('\\').pop();
        const safeName = baseName.replace(/[^a-zA-Z0-9._-]+/g, '-') || 'upload';
        const fileName = `${Date.now()}-${safeName}`;
        const filePath = path.join(uploadDir, fileName);

        await writeFile(filePath, buffer);

        const url = `/uploads/${fileName}`;
        return NextResponse.json({ success: true, url });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}


