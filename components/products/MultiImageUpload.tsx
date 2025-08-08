"use client";

import { useState, useCallback } from "react";
import { Upload, X, Plus, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { uploadProductImage } from "@/lib/products";

interface MultiImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export function MultiImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 5, 
  disabled = false 
}: MultiImageUploadProps) {
  console.log('🔄 MultiImageUpload rendered with images:', images);
  
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log('🔄 Files selected:', files.length, files.map(f => f.name));
    
    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images. Currently you have ${images.length} images.`);
      return;
    }

    setIsUploading(true);
    const newImages: string[] = [];

    for (const file of files) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not a valid image type. Please use JPEG, PNG, GIF, or WebP.`);
        continue;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`);
        continue;
      }

      try {
        // Create a unique key for progress tracking
        const progressKey = `${file.name}-${Date.now()}`;
        
        // Start progress tracking
        setUploadProgress(prev => ({ ...prev, [progressKey]: 0 }));
        
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
        console.log('🔄 Starting upload for:', file.name);
        const imageUrl = await uploadProductImage(file);
        console.log('✅ Upload completed, URL:', imageUrl);
        
        // Complete progress
        clearInterval(progressInterval);
        setUploadProgress(prev => ({ ...prev, [progressKey]: 100 }));

        newImages.push(imageUrl);
        console.log('📝 Added to newImages array:', newImages);

      } catch (error) {
        console.error('Error uploading image:', error);
        alert(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (newImages.length > 0) {
      console.log('🔄 Calling onImagesChange with:', [...images, ...newImages]);
      onImagesChange([...images, ...newImages]);
      console.log('✅ onImagesChange called successfully');
    }

    setIsUploading(false);
    
    // Clear the input
    e.target.value = '';
  }, [images, maxImages, onImagesChange]);

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Product Images ({images.length}/{maxImages})</Label>
        {images.length < maxImages && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || isUploading}
            onClick={() => document.getElementById('multi-image-input')?.click()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Images
          </Button>
        )}
      </div>

      <input
        id="multi-image-input"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        multiple
        onChange={handleFileSelect}
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
          onClick={() => document.getElementById('multi-image-input')?.click()}
        >
          <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            Click to upload product images
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Supports JPEG, PNG, GIF, WebP (max 5MB each, up to {maxImages} images)
          </p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        The first image will be used as the primary product image. You can reorder images using the arrow buttons.
      </p>
    </div>
  );
}