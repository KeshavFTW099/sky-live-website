import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 1. File validation
    const fileExt = path.extname(file.name).toLowerCase();
    const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.mp4', '.webm', '.ogg'];
    const MAX_FILE_SIZE_LIMIT = 50 * 1024 * 1024; // 50MB absolute max for videos
    const MAX_STANDARD_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB limit for pdf/images

    if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
      return NextResponse.json(
        { error: `File type ${fileExt} is not allowed.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_LIMIT) {
      return NextResponse.json(
        { error: 'File size exceeds the maximum limit of 50MB.' },
        { status: 400 }
      );
    }

    const isVideo = ['.mp4', '.webm', '.ogg'].includes(fileExt);
    if (!isVideo && file.size > MAX_STANDARD_SIZE_LIMIT) {
      return NextResponse.json(
        { error: 'Image and PDF files are limited to 10MB.' },
        { status: 400 }
      );
    }

    // 2. Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Upload to Cloudinary using upload_stream
    const cleanBaseName = path.basename(file.name, fileExt).replace(/[^a-zA-Z0-9_-]/g, '_');
    const publicId = `${cleanBaseName}_${Date.now()}`;

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'skylife-sciences-v2',
          public_id: publicId,
          resource_type: 'auto', // Detects images, videos, raw files (PDFs)
        },
        (error, uploadResult) => {
          if (error) return reject(error);
          resolve(uploadResult);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      filename: result.public_id,
    });
  } catch (error: any) {
    console.error('[Cloudinary Upload Error]:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
