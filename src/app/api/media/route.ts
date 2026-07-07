import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

// GET: List all media files from Cloudinary folder (Protected by middleware)
export async function GET() {
  try {
    const folderName = 'skylife-sciences-v2';
    
    // Perform search inside our designated folder
    const searchResult = await cloudinary.search
      .expression(`folder:${folderName}`)
      .sort_by('created_at', 'desc')
      .max_results(100)
      .execute();

    const resources = searchResult.resources || [];

    // Map Cloudinary results to the naming convention expected by the CMS dashboard
    const mediaList = resources.map((item: any) => ({
      name: item.public_id,
      url: item.secure_url,
      size: item.bytes,
      createdAt: item.created_at,
    }));

    return NextResponse.json(mediaList);
  } catch (error: any) {
    console.error('[Cloudinary GET Media Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to list media' }, { status: 500 });
  }
}

// DELETE: Delete a media file from Cloudinary (Protected by middleware)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get('name'); // This is the public_id / name

    if (!publicId) {
      return NextResponse.json({ error: 'Media name (public ID) is required' }, { status: 400 });
    }

    // Try deleting as 'image', 'video', and 'raw' sequentially to ensure we hit the correct type
    let deleteResult = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    
    if (deleteResult.result !== 'ok') {
      deleteResult = await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
    }
    
    if (deleteResult.result !== 'ok') {
      deleteResult = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    }

    if (deleteResult.result === 'ok' || deleteResult.result === 'not found') {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: `Cloudinary delete failed with result: ${deleteResult.result}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[Cloudinary DELETE Media Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete media' }, { status: 500 });
  }
}
