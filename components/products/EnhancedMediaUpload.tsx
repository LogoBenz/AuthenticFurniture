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
  index?: number;
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
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [cropImage, setCropImage] = useState<{ file: File | null; url: string; index?: number } | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const uploadImageFile = useCallback(async (file: File) => {
    try {
      const progressKey = `${file.name}-${Date.now()}`;
      setUploadProgress(prev => ({ ...prev, [progressKey]: 0 }));
      setIsUploading(true);
      
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[progressKey] || 0;
          return current < 90 ? { ...prev, [progressKey]: current + 10 } : prev;
        });
      }, 200);

      const imageUrl = await uploadProductImage(file);
      
      clearInterval(progressInterval);
      setUploadProgress(prev => ({ ...prev, [progressKey]: 100 }));

      const newImages = [...images, imageUrl];
      onImagesChange(newImages);

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
  }, [images, onImagesChange]);

  const uploadVideoFile = useCallback(async (file: File) => {
    try {
      const progressKey = `${file.name}-${Date.now()}`;
      setUploadProgress(prev => ({ ...prev, [progressKey]: 0 }));
      setIsUploading(true);
      
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[progressKey] || 0;
          return current < 90 ? { ...prev, [progressKey]: current + 10 } : prev;
        });
      }, 200);

      const videoUrl = await uploadProductVideo(file);
      
      clearInterval(progressInterval);
      setUploadProgress(prev => ({ ...prev, [progressKey]: 100 }));

      const newVideos = [...videos, videoUrl];
      onVideosChange?.(newVideos);

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
  }, [videos, onVideosChange]);

  const handleImageFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    console.log('📁 Selected files:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));

    if (images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images.`);
      return;
    }

    for (const file of files) {
      console.log('🔄 Processing file:', file.name, file.type, file.size);

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not a valid image type. Supported types: JPEG, PNG, GIF, WebP`);
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }

      if (enableCropping) {
        console.log('✂️ Opening crop dialog for:', file.name);
        const url = URL.createObjectURL(file);
        setCropImage({ file, url });
        break; // Handle one file at a time when cropping
      } else {
        console.log('⬆️ Uploading file directly:', file.name);
        await uploadImageFile(file);
      }
    }

    // Clear the input
    e.target.value = '';
  }, [images, maxImages, enableCropping, uploadImageFile]);

  const handleVideoFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (videos.length + files.length > maxVideos) {
      alert(`You can only upload up to ${maxVideos} videos.`);
      return;
    }

    for (const file of files) {
      if (file.size > 100 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 100MB.`);
        continue;
      }

      await uploadVideoFile(file);
    }

    e.target.value = '';
  }, [videos, maxVideos, uploadVideoFile]);

  const handleCropComplete = async (croppedFile: File) => {
    try {
      if (cropImage?.index !== undefined) {
        // Replace existing image
        const imageUrl = await uploadProductImage(croppedFile);
        const newImages = [...images];
        newImages[cropImage.index] = imageUrl;
        onImagesChange(newImages);
      } else {
        // Upload new image
        await uploadImageFile(croppedFile);
      }
    } catch (error) {
      console.error('Error handling crop:', error);
      alert('Failed to process cropped image');
    } finally {
      setCropImage(null);
    }
  };

  const handleEditImage = useCallback((imageUrl: string, index: number) => {
    console.log('✂️ Opening standalone crop for image:', imageUrl, 'at index:', index);
    setCropImage({ file: null, url: imageUrl, index });
  }, []);

  const removeImage = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  const moveImage = useCallback((fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  const removeVideo = useCallback((index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    onVideosChange?.(newVideos);
  }, [videos, onVideosChange]);

  const generateVideoThumbnail = (videoUrl: string): string => {
    // For now, return a placeholder. In the future, this could generate actual thumbnails
    return '/placeholder-video-thumbnail.jpg';
  };

  return (
    <div className="space-y-6">
      {/* Image Upload Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
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
          className="hidden"
          disabled={disabled || isUploading}
        />

        {images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border-2 border-slate-300 dark:border-slate-600"
              >
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                
                {/* Control Buttons */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {enableCropping && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleEditImage(image, index)}
                      disabled={disabled}
                    >
                      <Crop className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => removeImage(index)}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                {/* Move Buttons */}
                <div className="absolute left-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => moveImage(index, index - 1)}
                      disabled={disabled}
                    >
                      <span className="rotate-90">←</span>
                    </Button>
                  )}
                  {index < images.length - 1 && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => moveImage(index, index + 1)}
                      disabled={disabled}
                    >
                      <span className="rotate-90">→</span>
                    </Button>
                  )}
                </div>

                {/* Primary Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Primary
                  </div>
                )}

                {/* Image Index */}
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-1 rounded">
                  Image {index + 1}
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

        {/* Upload Progress Indicators */}
        {Object.entries(uploadProgress).map(([key, progress]) => (
          <div key={key} className="mt-2">
            <div className="text-sm text-slate-600 mb-1">{key.split('-')[0]}</div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Video Upload Section */}
      {onVideosChange && (
        <div>
          <div className="flex justify-between items-center mb-4">
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
        <ImageCropper
          imageUrl={cropImage.url}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropImage(null)}
        />
      )}

      {/* Video Preview Dialog */}
      {previewVideo && (
        <Dialog open={!!previewVideo} onOpenChange={() => setPreviewVideo(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Video Preview</DialogTitle>
            </DialogHeader>
            <VideoPlayer
              videoUrl={previewVideo}
              showControls={true}
              autoPlay={false}
              className="w-full aspect-video"
            />
          </DialogContent>
        </Dialog>
      )}

      <p className="text-xs text-muted-foreground">
        The first image will be used as the primary product image. You can reorder images using the arrow buttons.
        {enableCropping && " Images can be cropped before upload or edited later using the crop button."}
      </p>
    </div>
  );
}
