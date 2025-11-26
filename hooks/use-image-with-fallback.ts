"use client";

import { useState, useEffect } from "react";

interface UseImageWithFallbackOptions {
  src: string;
  maxRetries?: number;
}

interface UseImageWithFallbackReturn {
  imgSrc: string;
  hasError: boolean;
  retryCount: number;
  handleError: () => void;
  reset: () => void;
}

export function useImageWithFallback({ 
  src, 
  maxRetries = 1 
}: UseImageWithFallbackOptions): UseImageWithFallbackReturn {
  const [imgSrc, setImgSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Reset state when src changes
  useEffect(() => {
    setImgSrc(src);
    setRetryCount(0);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (retryCount < maxRetries) {
      // Retry once by appending a cache-busting parameter
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);
      setImgSrc(`${src}${src.includes('?') ? '&' : '?'}retry=${newRetryCount}`);
      
      // Log error for monitoring without breaking UI
      console.warn(`Image load failed, retrying (${newRetryCount}/${maxRetries}):`, src);
    } else {
      // Show fallback after max retries
      setHasError(true);
      
      // Log final error for monitoring
      console.error(`Image load failed after ${maxRetries} retries:`, src);
    }
  };

  const reset = () => {
    setImgSrc(src);
    setRetryCount(0);
    setHasError(false);
  };

  return { 
    imgSrc, 
    hasError, 
    retryCount, 
    handleError,
    reset
  };
}
