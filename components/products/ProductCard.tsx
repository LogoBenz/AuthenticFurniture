import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, RotateCcw, Eye, MessageCircle, Plus } from 'lucide-react';
import { Product } from '@/types';
import { useEnquiryCart } from '@/hooks/use-enquiry-cart';
import { NextUICard } from '@/components/ui/nextui-card';
import { NextUIButton } from '@/components/ui/nextui-button';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

 const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
   const { addToCart, removeFromCart, isInCart } = useEnquiryCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate pricing
  const originalPrice = product.original_price || product.price;
  const discountPercent = product.discount_percent || 0;
  const currentPrice = discountPercent > 0 ? originalPrice * (1 - discountPercent / 100) : originalPrice;
  const savingsAmount = discountPercent > 0 ? originalPrice - currentPrice : 0;
  
  const imageUrl = product.imageUrl || product.images?.[0] || "/placeholder-product.jpg";
  
         const handleAddToCart = (e: React.MouseEvent) => {
           e.preventDefault();
           e.stopPropagation();
           if (isInCart(product.id)) {
             removeFromCart(product.id);
           } else {
             addToCart(product);
           }
         };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
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
        <div className="relative w-full h-[215px] bg-white overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="386px"
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
          <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0 sm:opacity-100 md:opacity-0'
          }`}>
            <NextUIButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Compare functionality
              }}
              variant="flat"
              radius="full"
              size="sm"
              className="w-8 h-8 min-w-8 p-0 bg-white/90 backdrop-blur-md"
              title="Compare"
            >
              <RotateCcw className="w-3.5 h-3.5" />
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
              className="w-8 h-8 min-w-8 p-0 bg-white/90 backdrop-blur-md"
              title="Quick View"
            >
              <Eye className="w-3.5 h-3.5" />
            </NextUIButton>
            <NextUIButton
              onClick={handleWishlist}
              variant="flat"
              radius="full"
              size="sm"
              className="w-8 h-8 min-w-8 p-0 bg-white/90 backdrop-blur-md"
              title="Add to Wishlist"
            >
              <Heart
                className={`w-3.5 h-3.5 transition-colors duration-200 ${
                  isWishlisted ? 'text-red-500 fill-red-500' : ''
                }`}
              />
            </NextUIButton>
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

            {/* NextUI Circular Button */}
            <NextUIButton
              onClick={handleAddToCart}
              variant={isInCart(product.id) ? "solid" : "shadow"}
              radius="full"
              size="sm"
              className={`w-10 h-10 min-w-10 p-0 flex-shrink-0 ${
                isInCart(product.id)
                  ? 'bg-red-500 hover:bg-red-600 shadow-red-500/50'
                  : 'bg-slate-900 hover:bg-slate-800'
              }`}
              title={isInCart(product.id) ? 'Remove from cart' : 'Add to cart'}
            >
              {isInCart(product.id) ? (
                <ShoppingCart className="w-4 h-4" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </NextUIButton>
          </div>
        </div>
      </Link>
    </NextUICard>
  );
};

export default ProductCard;
