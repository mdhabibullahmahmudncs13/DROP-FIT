import { NextRequest, NextResponse } from 'next/server';
import { createCommunityPost } from '@/lib/appwrite/community';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const caption = formData.get('caption') as string;
    const userName = formData.get('userName') as string;
    const userId = formData.get('userId') as string;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(file, 'dropfit/community');

    // Create community post
    const post = await createCommunityPost(
      userName || 'Anonymous',
      imageUrl,
      caption
    );

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating community post:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    // Check if it's a Cloudinary configuration error
    if (errorMessage.includes('Cloudinary is not configured')) {
      return NextResponse.json(
        { error: 'Image upload service not configured. Please contact administrator.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
