"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface ColorVariant {
  id: string;
  color_name: string;
  color_hex: string;
  images: string[];
  price?: number;
  sku?: string;
  is_available: boolean;
}

interface ColorVariantSelectorProps {
  variants: ColorVariant[];
  selectedVariantId?: string;
  onVariantChange: (variant: ColorVariant) => void;
  basePrice?: number;
  className?: string;
}

export function ColorVariantSelector({
  variants,
  selectedVariantId,
  onVariantChange,
  basePrice,
  className = ""
}: ColorVariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<ColorVariant | null>(null);

  useEffect(() => {
    if (selectedVariantId) {
      const variant = variants.find(v => v.id === selectedVariantId);
      if (variant) {
        setSelectedVariant(variant);
      }
    } else if (variants.length > 0) {
      setSelectedVariant(variants[0]);
    }
  }, [selectedVariantId, variants]);

  const handleVariantSelect = (variant: ColorVariant) => {
    setSelectedVariant(variant);
    onVariantChange(variant);
  };

  if (variants.length === 0) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Color</h3>
        <div className="flex flex-wrap gap-2">
          {variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => handleVariantSelect(variant)}
              disabled={!variant.is_available}
              className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                selectedVariant?.id === variant.id
                  ? 'border-gray-900 scale-110 shadow-lg'
                  : 'border-gray-300 hover:border-gray-500'
              } ${
                !variant.is_available
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
              style={{ backgroundColor: variant.color_hex }}
              title={`${variant.color_name}${!variant.is_available ? ' (Out of Stock)' : ''}`}
            >
              {selectedVariant?.id === variant.id && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white drop-shadow" />
                </span>
              )}
              {!variant.is_available && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-0.5 bg-gray-500 rotate-45"></div>
                </div>
              )}
            </button>
          ))}
        </div>
        {selectedVariant && (
          <p className="text-sm text-gray-600 mt-2">
            Selected: {selectedVariant.color_name}
            {selectedVariant.price && selectedVariant.price !== basePrice && (
              <span className="ml-2 text-green-600 font-medium">
                (+₦{(selectedVariant.price - (basePrice || 0)).toLocaleString()})
              </span>
            )}
          </p>
        )}
      </div>

      {/* Variant Details */}
      {selectedVariant && (
        <div className="space-y-2">
          {selectedVariant.sku && (
            <p className="text-xs text-gray-500">SKU: {selectedVariant.sku}</p>
          )}
          {selectedVariant.images && selectedVariant.images.length > 0 && (
            <div className="text-xs text-gray-500">
              {selectedVariant.images.length} image{selectedVariant.images.length !== 1 ? 's' : ''} available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
