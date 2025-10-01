import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      console.error('❌ Missing image URL parameter');
      return new NextResponse('Missing image URL', { status: 400 });
    }

    console.log('🔄 Proxying image request:', imageUrl);

    // Validate URL format
    try {
      new URL(imageUrl);
    } catch {
      console.error('❌ Invalid URL format:', imageUrl);
      return new NextResponse('Invalid URL format', { status: 400 });
    }

    // Fetch the image from the original URL with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ImageCropper/1.0)',
        'Accept': 'image/*',
        'Cache-Control': 'no-cache', // Don't cache on the proxy level
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('❌ Failed to fetch image:', response.status, response.statusText, imageUrl);
      return new NextResponse(`Failed to fetch image: ${response.status} ${response.statusText}`, { status: response.status });
    }

    // Check content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      console.error('❌ Invalid content type:', contentType);
      return new NextResponse('Invalid content type', { status: 400 });
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();

    if (imageBuffer.byteLength === 0) {
      console.error('❌ Empty image buffer');
      return new NextResponse('Empty image data', { status: 400 });
    }

    // Validate image buffer (basic check)
    const uint8Array = new Uint8Array(imageBuffer);
    if (uint8Array.length < 10) {
      console.error('❌ Image buffer too small:', uint8Array.length, 'bytes');
      return new NextResponse('Image data too small', { status: 400 });
    }

    // Check for PNG signature (89 50 4E 47)
    if (contentType === 'image/png' && !(uint8Array[0] === 0x89 && uint8Array[1] === 0x50 && uint8Array[2] === 0x4E && uint8Array[3] === 0x47)) {
      console.error('❌ Invalid PNG signature');
      return new NextResponse('Invalid PNG data', { status: 400 });
    }

    // Check for JPEG signature (FF D8)
    if (contentType === 'image/jpeg' && !(uint8Array[0] === 0xFF && uint8Array[1] === 0xD8)) {
      console.error('❌ Invalid JPEG signature');
      return new NextResponse('Invalid JPEG data', { status: 400 });
    }

    console.log('✅ Successfully proxied image:', contentType, imageBuffer.byteLength, 'bytes');

    // Return the image with proper headers to prevent CORS issues
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Length': imageBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('❌ Error proxying image:', error);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return new NextResponse('Request timeout', { status: 408 });
      }
      return new NextResponse(`Error: ${error.message}`, { status: 500 });
    }
    return new NextResponse('Internal server error', { status: 500 });
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
