import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, RotateCcw, Eye, MessageCircle } from 'lucide-react';
import { Product } from '@/types';
import { useEnquiryCart } from '@/hooks/use-enquiry-cart';

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
    <div 
      className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer overflow-hidden relative flex flex-col h-full min-w-[300px] w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block flex flex-col h-full">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-square bg-slate-50">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* NEW Badge */}
          {isNew && (
            <div className="absolute top-3 left-3 bg-green-500 text-white rounded-md px-2 py-1 text-xs font-bold">
              NEW
            </div>
          )}

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className={`absolute top-3 ${isNew ? 'left-16' : 'left-3'} bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold`}>
              -{discountPercent}%
            </div>
          )}

          {/* Action Icons - Always visible on mobile, hover on desktop */}
          <div className={`absolute top-3 right-3 flex flex-col space-y-2 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0 sm:opacity-100 md:opacity-0'
          }`}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Compare functionality - placeholder for now
              }}
              className="w-8 h-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-colors duration-200 shadow-sm"
              title="Compare"
            >
              <RotateCcw className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView?.(product);
              }}
              className="w-8 h-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-colors duration-200 shadow-sm"
              title="Quick View"
            >
              <Eye className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsWishlisted(!isWishlisted);
              }}
              className="w-8 h-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-colors duration-200 shadow-sm"
              title="Add to Wishlist"
            >
              <Heart
                className={`w-4 h-4 transition-colors duration-200 ${
                  isWishlisted ? 'text-red-500 fill-red-500' : 'text-slate-600 dark:text-slate-300'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Product Name */}
          <div className="mb-3">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 min-h-[40px]">
              {product.name}
            </h3>
          </div>

          {/* Pricing */}
          <div className="mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {formatPrice(currentPrice)}
              </span>
              {discountPercent > 0 && (
                <span className="text-slate-500 dark:text-slate-400 line-through text-sm">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <div className="text-green-600 dark:text-green-400 text-sm font-medium mt-1">
                You save {formatPrice(originalPrice - currentPrice)}
              </div>
            )}
          </div>

          {/* Add to Cart Button - Moved outside image, at bottom */}
          <div className="mt-auto">
            <button
              onClick={handleAddToCart}
              className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold text-sm shadow-md transition-all duration-200 hover:shadow-lg ${
                isInCart(product.id)
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              title={isInCart(product.id) ? 'Remove from cart' : 'Add to cart'}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{isInCart(product.id) ? 'Remove from Cart' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
