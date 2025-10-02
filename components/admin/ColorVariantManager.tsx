"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface ColorOption {
  id: string;
  name: string;
  hex_code: string;
  display_order: number;
}

interface ProductVariant {
  id: string;
  product_id: number;
  color_id: string;
  color_name: string;
  color_hex: string;
  images: string[];
  price?: number;
  sku?: string;
  is_available: boolean;
  display_order: number;
}

interface ColorVariantManagerProps {
  productId: number;
  productName: string;
  basePrice: number;
  onVariantsChange?: (variants: ProductVariant[]) => void;
}

export function ColorVariantManager({
  productId,
  productName,
  basePrice,
  onVariantsChange
}: ColorVariantManagerProps) {
  const [colorOptions, setColorOptions] = useState<ColorOption[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [productId]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load color options and variants
      const [colorsRes, variantsRes] = await Promise.all([
        fetch('/api/colors'),
        fetch(`/api/products/${productId}/variants`)
      ]);

      if (colorsRes.ok) {
        const { colors } = await colorsRes.json();
        setColorOptions(colors || []);
      }

      if (variantsRes.ok) {
        const { variants: productVariants } = await variantsRes.json();
        setVariants(productVariants || []);
        onVariantsChange?.(productVariants || []);
      }
    } catch (error) {
      console.error('Error loading color variant data:', error);
      toast.error('Failed to load color variant data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVariants = () => {
    if (selectedColors.length === 0) {
      toast.error('Please select at least one color');
      return;
    }

    const newVariants = selectedColors.map((colorId, index) => {
      const color = colorOptions.find(c => c.id === colorId);
      return {
        id: `temp-${Date.now()}-${index}`,
        product_id: productId,
        color_id: colorId,
        color_name: color?.name || '',
        color_hex: color?.hex_code || '#000000',
        images: [],
        price: basePrice,
        sku: `${productId}-${color?.name?.toLowerCase().replace(/\s+/g, '-')}`,
        is_available: true,
        display_order: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as ProductVariant;
    });

    setVariants(prev => [...prev, ...newVariants]);
    setSelectedColors([]);
    setIsDialogOpen(false);
    toast.success('Color variants created successfully');
  };

  const handleUpdateVariant = (variantId: string, updates: Partial<ProductVariant>) => {
    setVariants(prev => prev.map(v => 
      v.id === variantId ? { ...v, ...updates } : v
    ));
    toast.success('Variant updated successfully');
  };

  const handleDeleteVariant = (variantId: string) => {
    setVariants(prev => prev.filter(v => v.id !== variantId));
    toast.success('Variant deleted successfully');
  };

  const handleImageUpload = async (variantId: string, file: File) => {
    try {
      // Simulate image upload - replace with actual upload logic
      const imageUrl = URL.createObjectURL(file);
      
      setVariants(prev => prev.map(v => 
        v.id === variantId 
          ? { ...v, images: [...v.images, imageUrl] }
          : v
      ));
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleRemoveImage = (variantId: string, imageIndex: number) => {
    setVariants(prev => prev.map(v => 
      v.id === variantId 
        ? { ...v, images: v.images.filter((_, i) => i !== imageIndex) }
        : v
    ));
  };

  if (loading) {
    return <div className="text-center py-4">Loading color variants...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Color Variants</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Color Variants
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Color Variants for {productName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Select Colors</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {colorOptions.map(color => (
                    <button
                      key={color.id}
                      onClick={() => {
                        setSelectedColors(prev => 
                          prev.includes(color.id)
                            ? prev.filter(id => id !== color.id)
                            : [...prev, color.id]
                        );
                      }}
                      className={`relative w-12 h-12 rounded-lg border-2 transition-all ${
                        selectedColors.includes(color.id)
                          ? 'border-blue-500 scale-105'
                          : 'border-gray-300 hover:border-gray-500'
                      }`}
                      style={{ backgroundColor: color.hex_code }}
                      title={color.name}
                    >
                      {selectedColors.includes(color.id) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Selected: {selectedColors.length} color{selectedColors.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateVariants}>
                  Create Variants
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {variants.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No color variants added yet. Click "Add Color Variants" to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {variants.map(variant => (
            <Card key={variant.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: variant.color_hex }}
                    />
                    <span className="font-medium">{variant.color_name}</span>
                  </div>
                  <Badge variant={variant.is_available ? "default" : "secondary"}>
                    {variant.is_available ? "Available" : "Out of Stock"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Images */}
                <div>
                  <Label className="text-sm">Images</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {variant.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`${variant.color_name} variant`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <button
                          onClick={() => handleRemoveImage(variant.id, index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(variant.id, file);
                        }}
                      />
                      <Upload className="w-6 h-6 text-gray-400" />
                    </label>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <Label className="text-sm">Price (₦)</Label>
                  <Input
                    type="number"
                    value={variant.price || basePrice}
                    onChange={(e) => handleUpdateVariant(variant.id, { 
                      price: parseFloat(e.target.value) || basePrice 
                    })}
                    className="mt-1"
                  />
                </div>

                {/* SKU */}
                <div>
                  <Label className="text-sm">SKU</Label>
                  <Input
                    value={variant.sku || ''}
                    onChange={(e) => handleUpdateVariant(variant.id, { 
                      sku: e.target.value 
                    })}
                    className="mt-1"
                    placeholder="Auto-generated"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateVariant(variant.id, { 
                      is_available: !variant.is_available 
                    })}
                  >
                    {variant.is_available ? 'Mark Unavailable' : 'Mark Available'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteVariant(variant.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
