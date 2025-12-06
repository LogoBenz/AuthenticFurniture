"use client";

import React, { useState, useCallback } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { getCroppedImg } from "@/lib/cropImage";
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Check,
  X,
  Grid3X3,
  Square,
  Monitor,
  Smartphone,
  Maximize
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
  initialAspectRatio?: number;
}

const ASPECT_RATIOS = [
  { label: "Free", value: null, icon: Maximize },
  { label: "Square", value: 1, icon: Square },
  { label: "4:3", value: 4 / 3, icon: Monitor }, // Landscape
  { label: "3:4", value: 3 / 4, icon: Smartphone }, // Portrait
  { label: "16:9", value: 16 / 9, icon: Monitor }, // Wide
];

export function ImageCropper({
  image,
  onCropComplete,
  onCancel,
  initialAspectRatio = 1,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number | null>(initialAspectRatio);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onCropCompleteCallback = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSave = async () => {
    try {
      if (croppedAreaPixels) {
        const croppedImage = await getCroppedImg(
          image,
          croppedAreaPixels,
          rotation
        );
        if (croppedImage) {
          onCropComplete(croppedImage);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-background rounded-lg shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Grid3X3 className="w-5 h-5" />
            Crop Image
          </h2>
          <Button variant="ghost" size="icon" onClick={onCancel} type="button">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">

          {/* Cropper Canvas */}
          <div className="flex-1 relative bg-neutral-900 min-h-[400px]">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspect || undefined} // react-easy-crop expects undefined for free aspect
              onCropChange={onCropChange}
              onCropComplete={onCropCompleteCallback}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              classes={{
                containerClassName: "image-cropper-container",
                cropAreaClassName: "border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]",
              }}
            />
          </div>

          {/* Controls Sidebar */}
          <div className="w-full lg:w-80 bg-background border-l p-6 flex flex-col gap-8 overflow-y-auto">

            {/* Aspect Ratio */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <Button
                    key={ratio.label}
                    variant={aspect === ratio.value ? "default" : "outline"}
                    size="sm"
                    type="button"
                    className={cn(
                      "flex flex-col h-auto py-2 gap-1 text-xs",
                      aspect === ratio.value ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    )}
                    onClick={() => setAspect(ratio.value)}
                  >
                    <ratio.icon className="w-4 h-4" />
                    {ratio.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Zoom Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Zoom
                </label>
                <span className="text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <ZoomOut className="w-4 h-4 text-muted-foreground" />
                <Slider
                  value={[zoom]}
                  min={1}
                  max={3}
                  step={0.1}
                  onValueChange={(value) => setZoom(value[0])}
                  className="flex-1"
                />
                <ZoomIn className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* Rotation Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Rotation
                </label>
                <span className="text-xs text-muted-foreground">{rotation}°</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-muted-foreground" />
                <Slider
                  value={[rotation]}
                  min={0}
                  max={360}
                  step={1}
                  onValueChange={(value) => setRotation(value[0])}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Dimensions Info */}
            <div className="bg-muted/50 p-3 rounded-md text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Width:</span>
                <span className="font-mono">{croppedAreaPixels?.width}px</span>
              </div>
              <div className="flex justify-between">
                <span>Height:</span>
                <span className="font-mono">{croppedAreaPixels?.height}px</span>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-muted/20 flex justify-between items-center text-sm text-muted-foreground">
          <p>Drag corners to resize • Drag center to move</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} type="button">
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2" type="button">
              <Check className="w-4 h-4" />
              Crop & Save
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
