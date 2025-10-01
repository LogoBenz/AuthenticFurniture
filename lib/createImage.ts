export function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    // Only set crossOrigin for external URLs, not blob URLs (blob URLs don't require CORS)
    if (!url.startsWith('blob:')) {
      image.crossOrigin = 'anonymous';
    }

    image.addEventListener('load', () => {
      console.log('✅ Image loaded successfully:', url, `(${image.width}x${image.height})`);
      resolve(image);
    });

    image.addEventListener('error', (error) => {
      console.error('❌ Failed to load image:', url, error);
      console.error('Image source:', url);
      console.error('Image crossOrigin:', image.crossOrigin);
      reject(new Error(`Failed to load image: ${url} - ${error.type || 'Unknown error'}`));
    });

    // Set the source last to ensure all event listeners are attached
    console.log('🔄 Starting to load image:', url);
    image.src = url;

    // Timeout after 10 seconds
    setTimeout(() => {
      console.error('⏰ Image load timeout:', url);
      reject(new Error(`Image load timeout: ${url}`));
    }, 10000);
  });
}
