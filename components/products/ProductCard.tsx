'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, ArrowLeftRight, Eye, MessageCircle, Plus } from 'lucide-react';
import { Product } from '@/types';
import { useEnquiryCart } from '@/hooks/use-enquiry-cart';
import { WishlistButton } from '@/components/ui/WishlistButton';
import { NextUICard } from '@/components/ui/nextui-card';
import { NextUIButton } from '@/components/ui/nextui-button';

import { useCompare } from '@/hooks/use-compare';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  variant?: 'simple' | 'detailed';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, variant = 'simple' }) => {
  const { addToCart, removeFromCart, isInCart } = useEnquiryCart();
  const { isInCompare, toggleCompare } = useCompare();

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

  // Get second image for hover effect
  const getSecondImageUrl = () => {
    if (product.images && Array.isArray(product.images) && product.images.length > 1) {
      const secondImage = product.images[1];
      if (secondImage?.trim()) {
        return secondImage;
      }
    }
    return null;
  };

  const secondImageUrl = getSecondImageUrl();

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
      variant="flat"
      radius="sm"
      className="group cursor-pointer flex flex-col h-full w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-blue-800 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-xl"
    >
      <Link href={`/products/${product.slug}`} className="block h-full flex flex-col">
        {/* Image Container - Taller and Centered */}
        <div className={`relative w-full ${variant === 'detailed' ? 'h-[300px]' : 'h-[260px]'} bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center rounded-t-sm transition-all duration-300`}>
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className={`${product.category.toLowerCase().includes('chair') || product.category.toLowerCase().includes('seating') ? 'object-contain' : 'object-cover'} group-hover:scale-105 transition-all duration-300 ease-out`}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmX/9k="
          />

          {/* Second Image (Hover) */}
          {secondImageUrl && (
            <Image
              src={secondImageUrl}
              alt={`${product.name} - view 2`}
              fill
              className={`absolute inset-0 z-10 ${product.category.toLowerCase().includes('chair') || product.category.toLowerCase().includes('seating') ? 'object-contain' : 'object-cover'} opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 ease-out`}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading="eager"
            />
          )}

          {/* NEW Badge */}
          {isNew && (
            <div className="absolute top-4 left-4 bg-slate-900 text-white px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-sm z-10">
              New
            </div>
          )}

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className={`absolute top-4 ${isNew ? 'left-16' : 'left-4'} bg-red-500 text-white px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-sm z-10`}>
              -{discountPercent}%
            </div>
          )}

          {/* Action Icons - Top Right (Visible on Hover) */}
          {/* Action Icons - Top Right (Visible on Hover) */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 z-20 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleCompare(product);
              }}
              className={`w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 hover:bg-slate-50 text-slate-600 hover:text-blue-800 transition-colors ${isCompared ? 'text-blue-800 bg-slate-100' : ''}`}
              title={isCompared ? "Remove from compare" : "Compare"}
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView?.(product);
              }}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 hover:bg-slate-50 text-slate-600 hover:text-blue-800 transition-colors"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <div className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-sm border border-slate-100 hover:bg-slate-50">
              <WishlistButton
                productId={product.id.toString()}
                size="sm"
                className="w-full h-full p-2 hover:bg-transparent shadow-none border-none"
              />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="px-4 py-2 flex-1 flex flex-col justify-between border-t border-slate-100 dark:border-slate-800 h-[100px]">
          <div>
            {/* Category Label */}
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-0.5">
              {product.category}
            </p>

            {/* Product Name */}
            <h3 className="font-medium text-slate-900 dark:text-slate-100 text-sm leading-tight mb-1 group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </div>

          {/* Price and Add to Cart */}
          <div className="flex items-end justify-between mt-1">
            <div>
              {/* Savings Text - Visible for all variants now */}
              {discountPercent > 0 && (
                <p className="text-[10px] text-green-600 font-medium mb-0.5">
                  You save {formatPrice(savingsAmount)}
                </p>
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {formatPrice(currentPrice)}
                </span>
                {discountPercent > 0 && (
                  <span className="text-[10px] text-slate-400 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {variant === 'detailed' ? (
              <NextUIButton
                onClick={handleAddToCart}
                radius="full"
                size="sm"
                className={`w-12 h-12 mr-1 mb-1 transition-all duration-300 ${isInCart(product.id)
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-white text-black border border-slate-200 hover:bg-blue-800 hover:text-white hover:border-blue-800'
                  }`}
                title={isInCart(product.id) ? 'Remove from cart' : 'Add to cart'}
              >
                {isInCart(product.id) ? (
                  <ShoppingCart className="w-5 h-5" />
                ) : (
                  <Plus className="w-8 h-8" strokeWidth={3} />
                )}
              </NextUIButton>
            ) : (
              <NextUIButton
                onClick={handleAddToCart}
                radius="full"
                size="sm"
                className={`w-12 h-12 mr-1 mb-1 transition-all duration-300 border ${isInCart(product.id)
                  ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                  : 'bg-white text-black border-slate-200 hover:bg-blue-800 hover:text-white hover:border-blue-800'
                  }`}
                title={isInCart(product.id) ? 'Remove from cart' : 'Add to cart'}
              >
                {isInCart(product.id) ? (
                  <ShoppingCart className="w-5 h-5" />
                ) : (
                  <Plus className="w-8 h-8" strokeWidth={3} />
                )}
              </NextUIButton>
            )}
          </div>
        </div>
      </Link>
    </NextUICard>
  );
};

export default ProductCard;
