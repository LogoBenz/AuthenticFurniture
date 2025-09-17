"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModernProductGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

export function ModernProductGallery({ 
  images, 
  productName, 
  className = "" 
}: ModernProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={cn("bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center", className)}>
        <span className="text-slate-400">No images available</span>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className={cn("flex gap-4", className)}>
      {/* Vertical Thumbnails - Desktop Only */}
      <div className="hidden md:flex flex-col gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={cn(
              "relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all hover:opacity-80",
              index === currentImageIndex
                ? "border-blue-600"
                : "border-slate-200 dark:border-slate-700"
            )}
          >
            <Image
              src={image}
              alt={`${productName} - Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image Container */}
      <div className="flex-1 relative">
        <div className="relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden group">
          <Image
            src={images[currentImageIndex]}
            alt={`${productName} - Image ${currentImageIndex + 1}`}
            fill
            className="object-cover"
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity h-10 w-10 p-0 shadow-lg"
                onClick={prevImage}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity h-10 w-10 p-0 shadow-lg"
                onClick={nextImage}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Horizontal Thumbnails - Mobile Only */}
        {images.length > 1 && (
          <div className="md:hidden mt-4 flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={cn(
                  "relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0",
                  index === currentImageIndex
                    ? "border-blue-600"
                    : "border-slate-200 dark:border-slate-700"
                )}
              >
                <Image
                  src={image}
                  alt={`${productName} - Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
