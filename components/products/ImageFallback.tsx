"use client";

import { Package } from "lucide-react";

interface ImageFallbackProps {
  productName: string;
  category?: string;
  aspectRatio?: string;
  size?: "small" | "large";
}

export function ImageFallback({ 
  productName, 
  category, 
  aspectRatio = "aspect-[8/5]",
  size = "large"
}: ImageFallbackProps) {
  const iconSize = size === "large" ? "w-16 h-16" : "w-8 h-8";
  const textSize = size === "large" ? "text-base" : "text-xs";
  const categorySize = size === "large" ? "text-sm" : "text-[10px]";
  
  return (
    <div className={`${aspectRatio} bg-gray-100 rounded-lg flex flex-col items-center justify-center border border-gray-200`}>
      <Package className={`${iconSize} text-gray-400 mb-2`} />
      {category && (
        <p className={`text-gray-600 font-medium ${categorySize}`}>{category}</p>
      )}
      <p className={`text-gray-500 ${textSize} text-center px-4 mt-1 line-clamp-2`}>
        {productName}
      </p>
    </div>
  );
}
