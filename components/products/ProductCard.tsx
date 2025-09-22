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
      className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block">
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
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 shadow-sm"
              title="Compare"
            >
              <RotateCcw className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView?.(product);
              }}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 shadow-sm"
              title="Quick View"
            >
              <Eye className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsWishlisted(!isWishlisted);
              }}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 shadow-sm"
              title="Add to Wishlist"
            >
              <Heart 
                className={`w-4 h-4 transition-colors duration-200 ${
                  isWishlisted ? 'text-red-500 fill-red-500' : 'text-slate-600'
                }`} 
              />
            </button>
          </div>

          {/* Add to Cart Button - Circular */}
          <button 
            onClick={handleAddToCart}
            className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 ${
              isInCart(product.id) 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            title={isInCart(product.id) ? 'Remove from cart' : 'Add to cart'}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          {/* Product Name & ID */}
          <div>
            <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
              {product.name}
            </h3>
            {product.modelNo && (
              <p className="text-xs text-slate-500 mt-1">#{product.modelNo}</p>
            )}
          </div>

          {/* Product Tags */}
          {product.popular_with && product.popular_with.length > 0 && (
            <div className="mt-2">
              <div className="inline-flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-full px-2 py-1">
                <span className="text-yellow-600 text-xs">🔥</span>
                <span className="text-xs font-medium text-gray-700">
                  {product.popular_with[0]}
                </span>
              </div>
            </div>
          )}

          {/* Pricing */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-slate-900">
              {formatPrice(currentPrice)}
            </span>
            {discountPercent > 0 && (
              <span className="text-slate-500 line-through text-sm">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;