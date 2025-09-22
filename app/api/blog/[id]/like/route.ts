import { NextRequest, NextResponse } from 'next/server';
import { likeBlogPost } from '@/lib/blog';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userIp, userAgent } = body;
    
    if (!userIp) {
      return NextResponse.json(
        { error: 'User IP is required' },
        { status: 400 }
      );
    }
    
    const success = await likeBlogPost(id, userIp, userAgent);
    
    return NextResponse.json({ 
      success,
      message: success ? 'Post liked successfully' : 'Post already liked'
    });
  } catch (error) {
    console.error('Error liking blog post:', error);
    return NextResponse.json(
      { error: 'Failed to like blog post' },
      { status: 500 }
    );
  }
}
