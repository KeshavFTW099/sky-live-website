import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Content from '@/models/Content';
import { ContentUpdateSchema } from '@/lib/validation';

// POST: Save/Update CMS Content configuration (Protected by middleware)
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // Remove mongoose meta fields if present to avoid validation issues
    delete body._id;
    delete body.__v;
    delete body.createdAt;
    delete body.updatedAt;

    // Validate the updated content schema using Zod
    const validationResult = ContentUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('[CMS Content Validation Error]:', validationResult.error.format());
      return NextResponse.json(
        { error: 'CMS content structure validation failed: ' + validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    // Upsert the single CMS content configuration document in MongoDB
    const updatedContent = await Content.findOneAndUpdate(
      {},
      validationResult.data,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true, content: updatedContent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
