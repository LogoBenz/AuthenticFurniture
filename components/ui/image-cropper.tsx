"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Button } from './button';
import { X, RotateCw, ZoomIn, ZoomOut, Crop } from 'lucide-react';

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImageUrl: string) => void;
  onClose: () => void;
  aspectRatio?: number;
}

export function ImageCropper({ 
  image, 
  onCropComplete, 
  onClose, 
  aspectRatio = 1 
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleCrop = useCallback(() => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;

    // Set canvas size to crop area
    canvas.width = crop.width;
    canvas.height = crop.height;

    // Calculate source coordinates
    const sourceX = crop.x * scaleX;
    const sourceY = crop.y * scaleY;
    const sourceWidth = crop.width * scaleX;
    const sourceHeight = crop.height * scaleY;

    // Draw cropped image
    ctx.drawImage(
      img,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, crop.width, crop.height
    );

    // Convert to blob and create URL
    canvas.toBlob((blob) => {
      if (blob) {
        const croppedUrl = URL.createObjectURL(blob);
        onCropComplete(croppedUrl);
      }
    }, 'image/jpeg', 0.9);
  }, [crop, onCropComplete]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setCrop(prev => ({
      ...prev,
      x: Math.max(0, Math.min(prev.x + deltaX, 400 - prev.width)),
      y: Math.max(0, Math.min(prev.y + deltaY, 400 - prev.height))
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResize = (e: React.MouseEvent, corner: string) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - centerX;
      const deltaY = moveEvent.clientY - centerY;
      
      let newWidth = crop.width;
      let newHeight = crop.height;

      if (corner.includes('right')) {
        newWidth = Math.max(50, Math.min(crop.width + deltaX, 400 - crop.x));
      }
      if (corner.includes('left')) {
        newWidth = Math.max(50, Math.min(crop.width - deltaX, crop.x + crop.width));
      }
      if (corner.includes('bottom')) {
        newHeight = Math.max(50, Math.min(crop.height + deltaY, 400 - crop.y));
      }
      if (corner.includes('top')) {
        newHeight = Math.max(50, Math.min(crop.height - deltaY, crop.y + crop.height));
      }

      // Maintain aspect ratio
      if (aspectRatio > 0) {
        if (corner.includes('right') || corner.includes('left')) {
          newHeight = newWidth / aspectRatio;
        } else {
          newWidth = newHeight * aspectRatio;
        }
      }

      setCrop(prev => ({
        ...prev,
        width: newWidth,
        height: newHeight
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const aspectRatioOptions = [
    { label: 'Square (1:1)', value: 1 },
    { label: 'Wide (16:9)', value: 16/9 },
    { label: 'Standard (4:3)', value: 4/3 },
    { label: 'Free', value: 0 }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Crop Image</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Aspect Ratio</label>
            <div className="flex gap-2 flex-wrap">
              {aspectRatioOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={aspectRatio === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCrop(prev => ({
                    ...prev,
                    width: aspectRatio > 0 ? prev.height * aspectRatio : prev.width,
                    height: prev.height
                  }))}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Image Container */}
          <div className="relative mb-4">
            <div className="relative inline-block">
              <img
                ref={imageRef}
                src={image}
                alt="Crop preview"
                className="max-w-full max-h-96 object-contain"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease'
                }}
                onLoad={() => {
                  if (imageRef.current) {
                    const img = imageRef.current;
                    const maxSize = 400;
                    const scale = Math.min(maxSize / img.naturalWidth, maxSize / img.naturalHeight);
                    const width = img.naturalWidth * scale;
                    const height = img.naturalHeight * scale;
                    
                    setCrop({
                      x: (width - Math.min(width, height)) / 2,
                      y: (height - Math.min(width, height)) / 2,
                      width: Math.min(width, height),
                      height: Math.min(width, height)
                    });
                  }
                }}
              />
              
              {/* Crop Overlay */}
              <div
                className="absolute border-2 border-blue-500 bg-blue-500/20 cursor-move"
                style={{
                  left: crop.x,
                  top: crop.y,
                  width: crop.width,
                  height: crop.height
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                {/* Resize Handles */}
                <div
                  className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white cursor-nw-resize"
                  onMouseDown={(e) => handleResize(e, 'top-left')}
                />
                <div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white cursor-ne-resize"
                  onMouseDown={(e) => handleResize(e, 'top-right')}
                />
                <div
                  className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white cursor-sw-resize"
                  onMouseDown={(e) => handleResize(e, 'bottom-left')}
                />
                <div
                  className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white cursor-se-resize"
                  onMouseDown={(e) => handleResize(e, 'bottom-right')}
                />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm">{Math.round(zoom * 100)}%</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(prev => Math.min(3, prev + 0.1))}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setRotation(prev => (prev + 90) % 360)}
            >
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleCrop}>
              <Crop className="w-4 h-4 mr-2" />
              Crop Image
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
