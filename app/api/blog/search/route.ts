import { NextRequest, NextResponse } from 'next/server';
import { searchBlogPosts } from '@/lib/blog';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }
    
    const posts = await searchBlogPosts(query);
    
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error searching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to search blog posts' },
      { status: 500 }
    );
  }
}
