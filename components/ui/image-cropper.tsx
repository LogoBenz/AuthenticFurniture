"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "./button";
import { X, Check } from "lucide-react";

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
  aspectRatio = 4 / 3,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 80,
    height: 80,
    x: 10,
    y: 10,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Convert Supabase URL to proxy URL
  const getProxyUrl = (url: string) => {
    try {
      const pathMatch = url.match(
        /\/storage\/v1\/object\/public\/([^/]+)\/(.+)/
      );
      if (pathMatch) {
        const bucket = pathMatch[1];
        const path = pathMatch[2];
        return `/api/proxy-image?bucket=${encodeURIComponent(
          bucket
        )}&path=${encodeURIComponent(path)}`;
      }
    } catch (e) {
      console.error("Failed to parse image URL:", e);
    }
    return url;
  };

  const proxyImageUrl = getProxyUrl(imageUrl);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;

      // Set initial crop to center 80% of image
      const cropWidth = width * 0.8;
      const cropHeight = height * 0.8;

      setCrop({
        unit: "px",
        width: cropWidth,
        height: cropHeight,
        x: (width - cropWidth) / 2,
        y: (height - cropHeight) / 2,
      });
    },
    []
  );

  const handleCropComplete = useCallback(async () => {
    if (!completedCrop || !imgRef.current) {
      console.error("No crop or image ref");
      return;
    }

    setIsLoading(true);

    try {
      const image = imgRef.current;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("No 2d context");
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Canvas is empty"));
          },
          "image/jpeg",
          0.95
        );
      });

      const fileName = imageUrl.split("/").pop() || "cropped-image.jpg";
      const file = new File([blob], fileName, { type: "image/jpeg" });

      onCropComplete(file);
    } catch (error) {
      console.error("Error cropping image:", error);
    } finally {
      setIsLoading(false);
    }
  }, [completedCrop, imageUrl, onCropComplete]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col w-full h-full bg-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b flex justify-between items-center flex-shrink-0">
        <h2 className="text-lg font-semibold">Crop Image</h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Cropper Area */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-900">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspectRatio}
          className="max-w-full max-h-full"
        >
          <img
            ref={imgRef}
            src={proxyImageUrl}
            alt="Crop"
            onLoad={onImageLoad}
            className="max-w-full max-h-[75vh] object-contain"
          />
        </ReactCrop>
      </div>

      {/* Controls */}
      <div className="p-4 border-t bg-gray-50 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Drag corners to resize • Drag center to move •{" "}
            {completedCrop
              ? `${Math.round(completedCrop.width)} × ${Math.round(
                  completedCrop.height
                )}px`
              : "Select area"}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleCropComplete}
              disabled={isLoading || !completedCrop}
            >
              <Check className="h-4 w-4 mr-2" />
              {isLoading ? "Cropping..." : "Crop & Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
