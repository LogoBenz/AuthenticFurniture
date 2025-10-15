import { supabase } from '@/lib/supabase-simple';

export async function uploadProductImage(file: File): Promise<string> {
  try {
    console.log('🔄 Starting image upload:', file.name, file.size, file.type);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    console.log('📁 Upload path:', filePath);

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (error) {
      console.error('❌ Supabase upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    console.log('✅ Upload successful, getting public URL');

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    console.log('✅ Public URL:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    throw new Error(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function uploadProductVideo(file: File): Promise<string> {
  try {
    console.log('🔄 Starting video upload:', file.name, file.size, file.type);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `product-videos/${fileName}`;

    console.log('📁 Video upload path:', filePath);

    const { data, error } = await supabase.storage
      .from('product-videos')
      .upload(filePath, file);

    if (error) {
      console.error('❌ Supabase video upload error:', error);
      throw new Error(`Video upload failed: ${error.message}`);
    }

    console.log('✅ Video upload successful, getting public URL');

    const { data: { publicUrl } } = supabase.storage
      .from('product-videos')
      .getPublicUrl(filePath);

    console.log('✅ Video public URL:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('❌ Error uploading video:', error);
    throw new Error(`Video upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateVideoThumbnail(videoFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      video.src = URL.createObjectURL(videoFile);
      video.load();

      video.onloadeddata = () => {
        // Set canvas size to match video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Seek to first frame
        video.currentTime = 0;
      };

      video.onseeked = () => {
        try {
          // Draw video frame to canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Convert canvas to blob
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to generate thumbnail'));
              return;
            }

            const thumbnailFile = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
            uploadProductImage(thumbnailFile)
              .then(resolve)
              .catch(reject);
          }, 'image/jpeg', 0.8);
        } catch (error) {
          reject(error);
        }
      };

      video.onerror = () => {
        reject(new Error('Failed to load video'));
      };
    } catch (error) {
      reject(error);
    }
  });
}
