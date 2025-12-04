"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, Play } from "lucide-react";
import { useImageWithFallback } from "@/hooks/use-image-with-fallback";
import { ImageFallback } from "./ImageFallback";


interface EnhancedProductGalleryProps {
  images: string[];
  videos?: string[];
  productName: string;
  category?: string;
}

export function EnhancedProductGallery({ images, videos = [], productName, category }: EnhancedProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [thumbnailErrors, setThumbnailErrors] = useState<Set<number>>(new Set());

  // Combine images and videos into one array for navigation
  const allMedia = [...images, ...videos];
  const isVideo = (index: number) => index >= images.length;

  // Use error handling hook for main image
  const currentMediaSrc = allMedia[currentImageIndex] || "";
  const { imgSrc, hasError, handleError } = useImageWithFallback({
    src: currentMediaSrc,
    maxRetries: 1
  });

  // Handle thumbnail errors
  const handleThumbnailError = (index: number) => {
    setThumbnailErrors(prev => new Set(prev).add(index));
    console.warn(`Thumbnail load failed for index ${index}:`, allMedia[index]);
  };

  const changeMedia = (newIndex: number) => {
    setCurrentImageIndex(newIndex);
  };

  const nextMedia = () => {
    changeMedia((currentImageIndex + 1) % allMedia.length);
  };

  const prevMedia = () => {
    changeMedia((currentImageIndex - 1 + allMedia.length) % allMedia.length);
  };

  const goToMedia = (index: number) => {
    changeMedia(index);
  };

  if (!allMedia || allMedia.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No media available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Main Media Container */}
      <div className="relative aspect-[8/5] lg:aspect-auto lg:flex-1 bg-white rounded-lg overflow-hidden border border-gray-200 group">
        {isVideo(currentImageIndex) ? (
          <video
            src={allMedia[currentImageIndex]}
            controls
            className="w-full h-full object-cover"
            onLoadedData={() => console.log('Video loaded:', allMedia[currentImageIndex])}
            onError={(e) => console.error('Video error:', e)}
            style={{}}
          >
            Your browser does not support the video tag.
          </video>
        ) : hasError ? (
          <ImageFallback
            productName={productName}
            category={category}
            aspectRatio="aspect-[8/5]"
            size="large"
          />
        ) : (
          <Image
            key={currentImageIndex}
            src={imgSrc}
            alt={`${productName} - Media ${currentImageIndex + 1}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02] animate-in fade-in duration-300"
            priority
            onError={handleError}
          />
        )}

        {/* Zoom Overlay (only for images without errors) */}
        {!isVideo(currentImageIndex) && !hasError && (
          <div
            className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 cursor-zoom-in"
            onClick={() => setIsZoomed(true)}
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/95 rounded-full p-2">
                <ZoomIn className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Arrows */}
        {allMedia.length > 1 && (
          <>
            <button
              onClick={prevMedia}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={nextMedia}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </>
        )}

        {/* Image Counter Overlay - Bottom Right */}
        {allMedia.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
            {currentImageIndex + 1}/{allMedia.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation - Horizontal Bottom (ALL viewports) */}
      {allMedia.length > 1 && (
        <div className="flex justify-start">
          <div className="flex space-x-3 overflow-x-auto scrollbar-hide max-w-full">
            {allMedia.map((media, index) => (
              <button
                key={index}
                onClick={() => goToMedia(index)}
                className={`relative flex-shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${index === currentImageIndex
                  ? "border-blue-800"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
                aria-label={`View image ${index + 1}`}
              >
                {isVideo(index) ? (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Play className="w-6 h-6 text-gray-600" />
                  </div>
                ) : thumbnailErrors.has(index) ? (
                  <ImageFallback
                    productName={productName}
                    category={category}
                    aspectRatio="aspect-square"
                    size="small"
                  />
                ) : (
                  <Image
                    src={media}
                    alt={`${productName} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    loading="lazy"
                    onError={() => handleThumbnailError(index)}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
            <Image
              src={images[currentImageIndex]}
              alt={`${productName} - Zoomed view`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 bg-white/95 rounded-full p-2 hover:bg-white transition-colors z-10"
              aria-label="Close zoom"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 rotate-45" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
