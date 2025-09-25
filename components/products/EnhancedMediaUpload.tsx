"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, Plus, Image as ImageIcon, Video, Crop, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { uploadProductImage, uploadProductVideo } from "@/lib/products";
import { ImageCropper } from "@/components/ui/image-cropper";
import { VideoPlayer } from "@/components/ui/video-player";

interface MediaFile {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  name: string;
}

interface EnhancedMediaUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  videos?: string[];
  onVideosChange?: (videos: string[]) => void;
  maxImages?: number;
  maxVideos?: number;
  disabled?: boolean;
  enableCropping?: boolean;
}

export function EnhancedMediaUpload({ 
  images, 
  onImagesChange,
  videos = [],
  onVideosChange,
  maxImages = 8, 
  maxVideos = 3,
  disabled = false,
  enableCropping = true
}: EnhancedMediaUploadProps) {
  console.log('🔄 EnhancedMediaUpload rendered with images:', images, 'videos:', videos);

  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [cropImage, setCropImage] = useState<{ file: File; url: string } | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log('🔄 Image files selected:', files.length, files.map(f => f.name));

    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images. Currently you have ${images.length} images.`);
      return;
    }

    for (const file of files) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not a valid image type. Please use JPEG, PNG, GIF, or WebP.`);
        continue;
      }

      // Validate file size (10MB limit for images)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }

      // If cropping is enabled, show crop dialog
      if (enableCropping) {
        const url = URL.createObjectURL(file);
        setCropImage({ file, url });
      } else {
        await uploadImageFile(file);
      }
    }

    // Clear the input
    e.target.value = '';
  }, [images, maxImages, enableCropping]);

  const handleVideoFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log('🔄 Video files selected:', files.length, files.map(f => f.name));

    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (videos.length + files.length > maxVideos) {
      alert(`You can only upload up to ${maxVideos} videos. Currently you have ${videos.length} videos.`);
      return;
    }

    for (const file of files) {
      // Validate file type
      const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'];
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not a valid video type. Please use MP4, WebM, OGG, AVI, or MOV.`);
        continue;
      }

      // Validate file size (100MB limit for videos)
      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 100MB.`);
        continue;
      }

      await uploadVideoFile(file);
    }

    // Clear the input
    e.target.value = '';
  }, [videos, maxVideos]);

  const uploadImageFile = async (file: File) => {
    try {

      console.log("file is", file);
      // Create a unique key for progress tracking
      const progressKey = `${file.name}-${Date.now()}`;

      // Start progress tracking
      setUploadProgress(prev => ({ ...prev, [progressKey]: 0 }));
      setIsUploading(true);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[progressKey] || 0;
          if (current < 90) {
            return { ...prev, [progressKey]: current + 10 };
          }
          return prev;
        });
      }, 200);

      // Actually upload the image to Supabase Storage
      console.log('🔄 Starting image upload for:', file.name);
      const imageUrl = await uploadProductImage(file);
      console.log('✅ Image upload completed, URL:', imageUrl);

      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(prev => ({ ...prev, [progressKey]: 100 }));

      // Add to images array
      const newImages = [...images, imageUrl];
      onImagesChange(newImages);
      console.log('📝 Updated images array:', newImages);

      // Clean up progress tracking
      setTimeout(() => {
        setUploadProgress(prev => {
          const { [progressKey]: _, ...rest } = prev;
          return rest;
        });
      }, 1000);

    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const uploadVideoFile = async (file: File) => {
    try {
      // Create a unique key for progress tracking
      const progressKey = `${file.name}-${Date.now()}`;

      // Start progress tracking
      setUploadProgress(prev => ({ ...prev, [progressKey]: 0 }));
      setIsUploading(true);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[progressKey] || 0;
          if (current < 90) {
            return { ...prev, [progressKey]: current + 10 };
          }
          return prev;
        });
      }, 200);

      // Actually upload the video to Supabase Storage
      console.log('🔄 Starting video upload for:', file.name);
      const videoUrl = await uploadProductVideo(file);
      console.log('✅ Video upload completed, URL:', videoUrl);

      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(prev => ({ ...prev, [progressKey]: 100 }));

      // Add to videos array
      const newVideos = [...videos, videoUrl];
      onVideosChange?.(newVideos);
      console.log('📝 Updated videos array:', newVideos);

      // Clean up progress tracking
      setTimeout(() => {
        setUploadProgress(prev => {
          const { [progressKey]: _, ...rest } = prev;
          return rest;
        });
      }, 1000);

    } catch (error) {
      console.error('Error uploading video:', error);
      alert(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCropComplete = async (croppedFile: File) => {
    await uploadImageFile(croppedFile);
    setCropImage(null);
  };

  const removeImage = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  const removeVideo = useCallback((index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    onVideosChange?.(newVideos);
  }, [videos, onVideosChange]);

  const moveImage = useCallback((fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  const generateVideoThumbnail = (videoUrl: string): string => {
    // For now, return a placeholder. In a real implementation, you'd generate a thumbnail
    return '/placeholder-video-thumbnail.jpg';
  };

  return (
    <div className="space-y-6">
      {/* Images Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Product Images ({images.length}/{maxImages})</Label>
          {images.length < maxImages && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Images
            </Button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          multiple
          onChange={handleImageFileSelect}
          onChange={e => {
            console.log('Files:', e.target.files);
            handleImageFileSelect(e);
          }}
          className="hidden"
          disabled={disabled || isUploading}
        />

        {/* Upload Progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="space-y-2">
            {Object.entries(uploadProgress).map(([key, progress]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <Upload className="h-4 w-4 mr-1" />
                    Uploading...
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Image Grid */}
        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative group aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-600"
              >
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                />

                {/* Primary Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Primary
                  </div>
                )}

                {/* Remove Button */}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </Button>

                {/* Move Buttons */}
                <div className="absolute bottom-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-6 w-6 p-0 text-xs"
                      onClick={() => moveImage(index, index - 1)}
                      disabled={disabled}
                    >
                      ←
                    </Button>
                  )}
                  {index < images.length - 1 && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-6 w-6 p-0 text-xs"
                      onClick={() => moveImage(index, index + 1)}
                      disabled={disabled}
                    >
                      →
                    </Button>
                  )}
                </div>

                {/* Image Index */}
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div 
            className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              Click to upload product images
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Supports JPEG, PNG, GIF, WebP (max 10MB each, up to {maxImages} images)
            </p>
          </div>
        )}
      </div>

      {/* Videos Section */}
      {onVideosChange && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Product Videos ({videos.length}/{maxVideos})</Label>
            {videos.length < maxVideos && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled || isUploading}
                onClick={() => videoInputRef.current?.click()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Videos
              </Button>
            )}
          </div>

          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/avi,video/mov"
            multiple
            onChange={handleVideoFileSelect}
            className="hidden"
            disabled={disabled || isUploading}
          />

          {/* Video Grid */}
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video, index) => (
                <div
                  key={index}
                  className="relative group aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-600"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={generateVideoThumbnail(video)}
                      alt={`Product video ${index + 1}`}
                      fill
                      className="object-cover"
                    />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="rounded-full p-3"
                        onClick={() => setPreviewVideo(video)}
                      >
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>

                    {/* Remove Button */}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeVideo(index)}
                      disabled={disabled}
                    >
                      <X className="h-3 w-3" />
                    </Button>

                    {/* Video Index */}
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-1 rounded">
                      Video {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div 
              className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 transition-colors"
              onClick={() => videoInputRef.current?.click()}
            >
              <Video className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 mb-2">
                Click to upload product videos
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Supports MP4, WebM, OGG, AVI, MOV (max 100MB each, up to {maxVideos} videos)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Image Cropping Dialog */}
      {cropImage && (
        <Dialog open={!!cropImage} onOpenChange={() => setCropImage(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Crop className="w-5 h-5" />
                Crop Image
              </DialogTitle>
            </DialogHeader>
            <ImageCropper
              imageUrl={cropImage.url}
              image={cropImage.url}
              imageRef={cropImage.file}
              onCropComplete={handleCropComplete}
              onCancel={() => setCropImage(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Video Preview Dialog */}
      {previewVideo && (
        <Dialog open={!!previewVideo} onOpenChange={() => setPreviewVideo(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Video Preview</DialogTitle>
            </DialogHeader>
            <VideoPlayer
              src={previewVideo}
              controls
              autoPlay={false}
              className="w-full aspect-video"
            />
          </DialogContent>
        </Dialog>
      )}

      <p className="text-xs text-muted-foreground">
        The first image will be used as the primary product image. You can reorder images using the arrow buttons.
        {enableCropping && " Images can be cropped before upload."}
      </p>
    </div>
  );
}