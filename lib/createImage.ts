export function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    // Handle cross-origin images
    image.crossOrigin = 'anonymous';

    image.addEventListener('load', () => {
      console.log('✅ Image loaded successfully:', url);
      resolve(image);
    });

    image.addEventListener('error', (error) => {
      console.error('❌ Failed to load image:', url, error);
      reject(new Error(`Failed to load image: ${url}`));
    });

    // Set the source last to ensure all event listeners are attached
    image.src = url;

    // Timeout after 10 seconds
    setTimeout(() => {
      reject(new Error(`Image load timeout: ${url}`));
    }, 10000);
  });
}
