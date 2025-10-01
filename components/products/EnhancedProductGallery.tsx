"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, Play } from "lucide-react";
import { VideoPlayer } from "@/components/ui/video-player";

interface EnhancedProductGalleryProps {
  images: string[];
  videos?: string[];
  productName: string;
}

export function EnhancedProductGallery({ images, videos = [], productName }: EnhancedProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Combine images and videos into one array for navigation
  const allMedia = [...images, ...videos];
  const isVideo = (index: number) => index >= images.length;

  const nextMedia = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allMedia.length);
  };

  const prevMedia = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
  };

  const goToMedia = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (!allMedia || allMedia.length === 0) {
    return (
      <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">No media available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Thumbnail Navigation - Desktop Left Side */}
      {allMedia.length > 1 && (
        <div className="hidden lg:flex flex-col space-y-2 w-20">
          {allMedia.map((media, index) => (
            <button
              key={index}
              onClick={() => goToMedia(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentImageIndex
                  ? "border-blue-600 dark:border-blue-400"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              {isVideo(index) ? (
                <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <Play className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </div>
              ) : (
                <Image
                  src={media}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main Media Container */}
      <div className="flex-1">
        <div className="relative aspect-square bg-white rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 group">
          {isVideo(currentImageIndex) ? (
            <video
              src={allMedia[currentImageIndex]}
              controls
              className="w-full h-full object-cover"
              onLoadedData={() => console.log('Video loaded:', allMedia[currentImageIndex])}
              onError={(e) => console.error('Video error:', e)}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <Image
              src={allMedia[currentImageIndex]}
              alt={`${productName} - Media ${currentImageIndex + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
            />
          )}

          {/* Zoom Overlay (only for images) */}
          {!isVideo(currentImageIndex) && (
            <div
              className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 cursor-zoom-in"
              onClick={() => setIsZoomed(true)}
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 dark:bg-slate-800/90 rounded-full p-2">
                  <ZoomIn className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Arrows */}
          {allMedia.length > 1 && (
            <>
              <button
                onClick={prevMedia}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white dark:hover:bg-slate-800"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
              <button
                onClick={nextMedia}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white dark:hover:bg-slate-800"
              >
                <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
            </>
          )}

          {/* Media Counter */}
          {allMedia.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {allMedia.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Navigation - Mobile Bottom */}
      {allMedia.length > 1 && (
        <div className="lg:hidden flex space-x-2 overflow-x-auto scrollbar-hide">
          {allMedia.map((media, index) => (
            <button
              key={index}
              onClick={() => goToMedia(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentImageIndex
                  ? "border-blue-600 dark:border-blue-400"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              {isVideo(index) ? (
                <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <Play className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </div>
              ) : (
                <Image
                  src={media}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={images[currentImageIndex]}
              alt={`${productName} - Zoomed view`}
              width={800}
              height={800}
              className="object-contain max-w-full max-h-full"
            />
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 rounded-full p-2 hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300 rotate-45" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
