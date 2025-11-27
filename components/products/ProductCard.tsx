'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, RotateCcw, Eye, MessageCircle, Plus } from 'lucide-react';
import { Product } from '@/types';
import { useEnquiryCart } from '@/hooks/use-enquiry-cart';
import { WishlistButton } from '@/components/ui/WishlistButton';
import { NextUICard } from '@/components/ui/nextui-card';
import { NextUIButton } from '@/components/ui/nextui-button';

import { useCompare } from '@/hooks/use-compare';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, removeFromCart, isInCart } = useEnquiryCart();
  const { isInCompare, toggleCompare } = useCompare();
  const [isHovered, setIsHovered] = useState(false);

  const isCompared = isInCompare(product.id.toString());

  // Calculate pricing
  const originalPrice = product.original_price || product.price;
  const discountPercent = product.discount_percent || 0;
  const currentPrice = discountPercent > 0 ? originalPrice * (1 - discountPercent / 100) : originalPrice;
  const savingsAmount = discountPercent > 0 ? originalPrice - currentPrice : 0;

  // Safely extract and validate image URL
  const getImageUrl = () => {
    // Try imageUrl first
    if (product.imageUrl?.trim()) {
      return product.imageUrl;
    }

    // Try images array
    if (product.images) {
      if (Array.isArray(product.images) && product.images.length > 0) {
        const firstImage = product.images[0];
        if (firstImage?.trim()) {
          return firstImage;
        }
      } else if (typeof product.images === 'string' && (product.images as string).trim()) {
        return product.images;
      }
    }

    // Try image_url field
    if (product.image_url?.trim()) {
      return product.image_url;
    }

    // Fallback to placeholder
    return "/placeholder-product.jpg";
  };

  const imageUrl = getImageUrl();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart(product.id)) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  };



  // Format price to Nigerian Naira
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(price);
  };

  // Check if product is marked as new in admin
  const isNew = product.is_new || false;

  return (
    <NextUICard
      variant="bordered"
      radius="none"
      className="group cursor-pointer flex flex-col h-full border-slate-200 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-600 transition-all duration-300 hover:shadow-lg bg-white dark:bg-slate-900"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative w-full h-[215px] bg-white dark:bg-slate-900 overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className={`${product.category?.toLowerCase().includes('chair')
                ? 'object-contain scale-110 group-hover:scale-125'
                : 'object-cover group-hover:scale-105'
              } transition-transform duration-500 ease-out`}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmX/9k="
          />

          {/* NEW Badge */}
          {isNew && (
            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs font-bold z-10 rounded">
              NEW
            </div>
          )}

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className={`absolute top-2 ${isNew ? 'left-14' : 'left-2'} bg-red-500 text-white px-2 py-1 text-xs font-bold z-10 rounded`}>
              -{discountPercent}%
            </div>
          )}

          {/* NextUI Action Icons - Top Right */}
          <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-200 z-20 ${isHovered ? 'opacity-100' : 'opacity-0 sm:opacity-100 md:opacity-0'
            }`}>
            <NextUIButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleCompare(product);
              }}
              variant="flat"
              radius="full"
              size="sm"
              className={`w-8 h-8 min-w-8 p-0 backdrop-blur-md transition-colors ${isCompared
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white/90 text-slate-600 hover:text-blue-600 hover:bg-white'
                }`}
              title={isCompared ? "Remove from compare" : "Compare"}
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isCompared ? 'text-white' : ''}`} />
            </NextUIButton>
            <NextUIButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView?.(product);
              }}
              variant="flat"
              radius="full"
              size="sm"
              className="w-8 h-8 min-w-8 p-0 bg-white/90 backdrop-blur-md text-slate-600 hover:text-blue-600 hover:bg-white"
              title="Quick View"
            >
              <Eye className="w-3.5 h-3.5" />
            </NextUIButton>
            <div className="w-8 h-8 min-w-8 flex items-center justify-center">
              <WishlistButton
                productId={product.id.toString()}
                size="md"
                className="w-8 h-8 p-1.5 bg-white/90 backdrop-blur-md border-none shadow-none hover:shadow-none hover:scale-100"
              />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-3">
          {/* Category Label */}
          <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">
            {product.category}
          </p>

          {/* Product Name */}
          <h3 className="font-heading font-semibold text-slate-900 dark:text-slate-100 text-base leading-tight line-clamp-1 mt-1 mb-2">
            {product.name}
          </h3>

          {/* Price and Add to Cart Row */}
          <div className="flex items-center justify-between">
            {/* Pricing */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {formatPrice(currentPrice)}
                </span>
                {discountPercent > 0 && (
                  <span className="text-xs text-slate-400 line-through font-medium">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
              {discountPercent > 0 && (
                <div className="text-green-600 text-xs font-semibold mt-0.5">
                  Save {formatPrice(savingsAmount)}
                </div>
              )}
            </div>

            <NextUIButton
              onClick={handleAddToCart}
              variant={isInCart(product.id) ? "solid" : "flat"}
              radius="full"
              size="sm"
              className={`w-10 h-10 min-w-10 p-0 flex-shrink-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] relative overflow-hidden group/btn ${isInCart(product.id)
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/40 hover:scale-105 active:scale-95'
                : 'bg-white text-slate-900 border border-slate-200 hover:border-blue-600 hover:text-white shadow-sm hover:shadow-xl hover:shadow-blue-900/20 hover:scale-110 active:scale-90'
                }`}
              title={isInCart(product.id) ? 'Remove from cart' : 'Add to cart'}
            >
              {!isInCart(product.id) && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              )}
              <div className="relative z-10">
                {isInCart(product.id) ? (
                  <ShoppingCart className="w-4 h-4" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </div>
            </NextUIButton>
          </div>
        </div>
      </Link>
    </NextUICard >
  );
};

export default ProductCard;
