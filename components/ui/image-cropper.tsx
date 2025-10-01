"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Button } from './button';
import { X, Check } from 'lucide-react';

interface ImageCropperProps {
  imageUrl: string;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

export function ImageCropper({
  imageUrl,
  onCropComplete,
  onCancel,
  aspectRatio = 1
}: ImageCropperProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cropBox, setCropBox] = useState({ x: 50, y: 50, size: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageLoad = useCallback(() => {
    const img = imageRef.current;
    if (!img) return;

    setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
    setImageLoaded(true);

    // Initialize crop box in center
    const maxSize = Math.min(img.naturalWidth, img.naturalHeight);
    const size = Math.min(maxSize * 0.8, 400);
    setCropBox({
      x: (img.naturalWidth - size) / 2,
      y: (img.naturalHeight - size) / 2,
      size: size
    });
  }, []);

  const handleCrop = useCallback(async () => {
    setIsLoading(true);

    try {
      const img = imageRef.current;
      if (!img) throw new Error('Image not loaded');

      // Create canvas for cropping
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      canvas.width = cropBox.size;
      canvas.height = cropBox.size;

      // Draw the cropped portion
      ctx.drawImage(
        img,
        cropBox.x, cropBox.y, cropBox.size, cropBox.size,
        0, 0, cropBox.size, cropBox.size
      );

      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create image blob'));
        }, 'image/jpeg', 0.9);
      });

      // Create file
      const fileName = imageUrl.split('/').pop() || 'cropped-image.jpg';
      const croppedFile = new File([blob], fileName, { type: 'image/jpeg' });

      onCropComplete(croppedFile);
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setIsLoading(false);
    }
  }, [cropBox, imageUrl, onCropComplete]);

  const updateCropBox = useCallback((deltaX: number, deltaY: number, deltaSize: number) => {
    setCropBox(prev => {
      const newSize = Math.max(50, Math.min(prev.size + deltaSize, Math.min(imageSize.width, imageSize.height)));
      const newX = Math.max(0, Math.min(prev.x + deltaX, imageSize.width - newSize));
      const newY = Math.max(0, Math.min(prev.y + deltaY, imageSize.height - newSize));

      return { x: newX, y: newY, size: newSize };
    });
  }, [imageSize]);

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Crop Image</h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 flex items-center justify-center bg-gray-50">
          {!imageLoaded ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading image...</p>
            </div>
          ) : (
            <div
              className="relative"
              onMouseMove={(e) => {
                if (!isDragging) return;

                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                setCropBox(prev => ({
                  ...prev,
                  x: Math.max(0, Math.min(x - dragStart.x, imageSize.width - prev.size)),
                  y: Math.max(0, Math.min(y - dragStart.y, imageSize.height - prev.size))
                }));
              }}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
            >
              {/* Full Image */}
              <img
                ref={imageRef}
                src={`/api/image-proxy?url=${encodeURIComponent(imageUrl)}`}
                alt="Crop"
                className="max-w-full max-h-96 object-contain border border-gray-300"
                onLoad={handleImageLoad}
                onError={() => setImageLoaded(false)}
                crossOrigin="anonymous"
              />

              {/* Crop Overlay */}
              <div
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${cropBox.x + cropBox.size/2}px ${cropBox.y + cropBox.size/2}px, transparent ${cropBox.size/2}px, rgba(0,0,0,0.7) 0%)`
                }}
              />

              {/* Crop Box */}
              <div
                className="absolute border-2 border-white shadow-lg cursor-move"
                style={{
                  left: cropBox.x,
                  top: cropBox.y,
                  width: cropBox.size,
                  height: cropBox.size,
                  boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)'
                }}
                onMouseDown={(e) => {
                  setIsDragging(true);
                  setDragStart({ x: e.clientX - cropBox.x, y: e.clientY - cropBox.y });
                  e.preventDefault();
                }}
              />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateCropBox(0, 0, -20)}
              >
                <div className="text-xs">−</div>
              </Button>
              <span className="text-sm font-mono">
                {Math.round(cropBox.size)} × {Math.round(cropBox.size)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateCropBox(0, 0, 20)}
              >
                <div className="text-xs">+</div>
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={handleCrop} disabled={isLoading}>
                <Check className="h-4 w-4 mr-2" />
                {isLoading ? 'Cropping...' : 'Crop & Save'}
              </Button>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-500 text-center">
            Click and drag the crop area to position it, use +/- to resize
          </div>
        </div>
      </div>
    </div>
  );
}
