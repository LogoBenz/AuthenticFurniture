"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingCart, MessageCircle, Facebook, Twitter, Linkedin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Product } from "@/types";
import { useEnquiryCart } from "@/hooks/use-enquiry-cart";
import { formatPrice } from "@/lib/products-client";
import { motion, AnimatePresence } from "framer-motion";

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
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-white dark:bg-slate-900 border-none shadow-2xl rounded-2xl">
        <div className="flex flex-col lg:flex-row h-[90vh] lg:h-[600px]">
          {/* Product Image - Left Side */}
          <div className="lg:w-1/2 relative bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-8">
            <div className="relative w-full h-full max-h-[300px] lg:max-h-none">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Close Button (Mobile) */}
            <Button
              onClick={onClose}
              className="absolute top-4 right-4 lg:hidden rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm text-slate-500"
              size="icon"
              variant="ghost"
            >
              <X className="w-5 h-5" />
            </Button>

            {/* View Details Link */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <Link
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-blue-800 transition-colors border-b border-transparent hover:border-blue-800 pb-0.5"
              >
                View Full Details
              </Link>
            </div>
          </div>

          {/* Product Info - Right Side */}
          <div className="lg:w-1/2 p-6 lg:p-10 flex flex-col h-full overflow-y-auto bg-white dark:bg-slate-900">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2 uppercase tracking-wider">
                  {product.category}
                </p>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                  {product.name}
                </h2>
              </div>
              <Button
                onClick={onClose}
                className="hidden lg:flex rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                size="icon"
                variant="ghost"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                {formatPrice(currentPrice)}
              </span>
              {discountPercent > 0 && (
                <>
                  <span className="text-lg text-slate-400 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                    -{discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-slate dark:prose-invert text-sm text-slate-600 dark:text-slate-300 mb-8 line-clamp-3">
              {product.description || `The ${product.name} is designed to combine elegance, comfort, and functionality, making it a perfect addition to your space.`}
            </div>

            <div className="mt-auto space-y-6">
              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg h-12 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-l-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium text-slate-900 dark:text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-r-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className={`flex-1 h-12 text-base font-semibold transition-all duration-300 ${isInCart(product.id)
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-blue-800 hover:bg-blue-900 text-white shadow-lg shadow-blue-900/20'
                    }`}
                >
                  {isInCart(product.id) ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      ADDED TO CART
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      ADD TO CART
                    </>
                  )}
                </Button>
              </div>

              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleWhatsAppOrder}
                  variant="outline"
                  className="h-11 border-slate-200 hover:bg-slate-50 text-slate-700"
                >
                  <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
                  WhatsApp
                </Button>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-sm text-slate-500">Share:</span>
                  <button onClick={() => handleSocialShare('facebook')} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleSocialShare('twitter')} className="p-2 text-slate-400 hover:text-blue-400 transition-colors">
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleSocialShare('linkedin')} className="p-2 text-slate-400 hover:text-blue-700 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
