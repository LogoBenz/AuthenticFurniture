"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingCart, MessageCircle, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Product } from "@/types";
import { useEnquiryCart } from "@/hooks/use-enquiry-cart";
import { formatPrice } from "@/lib/products-client";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isInCart } = useEnquiryCart();

  if (!product) return null;

  // Calculate pricing
  const originalPrice = product.original_price || product.price;
  const discountPercent = product.discount_percent || 0;
  const currentPrice = discountPercent > 0 ? originalPrice * (1 - discountPercent / 100) : originalPrice;

  const imageUrl = product.imageUrl || product.images?.[0] || "/placeholder-product.jpg";

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleWhatsAppOrder = () => {
    const message = `Hi! I'm interested in the ${product.name}. 
Product: ${product.name}
Price: ${formatPrice(currentPrice)}
Quantity: ${quantity}
Total: ${formatPrice(currentPrice * quantity)}
Can you provide more details and availability?`;
    window.open(`https://wa.me/2348123456789?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSocialShare = (platform: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `Check out this ${product.name} from Authentic Furniture!`;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden p-0 w-[95vw] sm:w-full">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Product Image - Left Side */}
          <div className="lg:w-1/2 relative">
            <div className="relative aspect-square lg:aspect-auto lg:h-full max-h-[50vh] lg:max-h-none">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              <Button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-lg"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="absolute bottom-4 left-4">
              <Link
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                VIEW DETAILS
              </Link>
            </div>
          </div>

          {/* Product Info - Right Side */}
          <div className="lg:w-1/2 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Product Name */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-xl sm:text-2xl font-bold text-red-600">
                  {formatPrice(currentPrice)}
                </span>
                {discountPercent > 0 && (
                  <span className="text-base sm:text-lg text-slate-500 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-slate-600 mb-6 leading-relaxed">
                {product.description || `The ${product.name} is designed to combine elegance, comfort, and functionality, making it a perfect addition to your space. With its refined craftsmanship and premium finish, it transforms everyday living into a stylish experience.`}
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-sm font-medium text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-300 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 p-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <Button
                  onClick={handleAddToCart}
                  className={`w-full py-2 sm:py-3 text-base sm:text-lg font-semibold ${
                    isInCart(product.id) 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {isInCart(product.id) ? 'REMOVE FROM CART' : 'ADD TO CART'}
                </Button>

                <Button
                  onClick={handleWhatsAppOrder}
                  variant="outline"
                  className="w-full py-2 sm:py-3 text-base sm:text-lg font-semibold border-green-600 text-green-600 hover:bg-green-50"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  ORDER
                </Button>
              </div>

              {/* Product Details */}
              <div className="space-y-2 text-sm text-slate-600 mb-6">
                {product.modelNo && (
                  <div>
                    <span className="font-medium">SKU:</span> {product.modelNo}
                  </div>
                )}
                <div>
                  <span className="font-medium">Category:</span> {product.category}
                </div>
              </div>

              {/* Social Share */}
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-slate-700">Share:</span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSocialShare('facebook')}
                    className="w-8 h-8 p-0 text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSocialShare('twitter')}
                    className="w-8 h-8 p-0 text-blue-400 border-blue-400 hover:bg-blue-50"
                  >
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSocialShare('linkedin')}
                    className="w-8 h-8 p-0 text-blue-700 border-blue-700 hover:bg-blue-50"
                  >
                    <Linkedin className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
