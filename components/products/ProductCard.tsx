'use client';

import Link from "next/link";
import Image from "next/image";
import { Plus, X, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { useEnquiryCart } from "@/hooks/use-enquiry-cart";
import { useState, useCallback } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { name, slug, category, price, imageUrl, inStock } = product;
  const { addToCart, removeFromCart, isInCart, isLoaded } = useEnquiryCart();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Only check if in cart after the hook is loaded to prevent hydration issues
  const isProductInCart = isLoaded ? isInCart(product.id) : false;

  const handleCartAction = useCallback(async (e: React.MouseEvent) => {
    // Debug logging
    console.log('🛒 Cart action triggered:', { 
      productId: product.id, 
      productName: product.name,
      isInCart: isProductInCart,
      isLoaded,
      inStock,
      isProcessing
    });
    
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation();
    
    if (!isLoaded || !inStock || isProcessing) {
      console.warn('❌ Cart action blocked:', { isLoaded, inStock, isProcessing });
      return;
    }

    setIsProcessing(true);
    
    try {
      if (isProductInCart) {
        console.log('🗑️ Removing from cart:', product.name);
        const success = removeFromCart(product.id);
        if (!success) {
          throw new Error('Failed to remove item from cart');
        }
      } else {
        console.log('➕ Adding to cart:', product.name);
        const success = addToCart(product);
        if (!success) {
          throw new Error('Failed to add item to cart');
        }
      }
      
      // Brief delay to show feedback
      setTimeout(() => {
        setIsProcessing(false);
      }, 300);
    } catch (error) {
      console.error("❌ Cart action error:", error);
      setIsProcessing(false);
      // Show user-friendly error message
      alert(`Failed to ${isProductInCart ? 'remove' : 'add'} item. Please try again.`);
    }
  }, [addToCart, removeFromCart, product, isLoaded, inStock, isProductInCart, isProcessing]);

  const getButtonContent = () => {
    if (isProcessing) {
      return (
        <>
          <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent mr-1" />
          {isProductInCart ? 'Removing' : 'Adding'}
        </>
      );
    }
    
    if (isProductInCart) {
      return (
        <>
          <X className="h-3 w-3 mr-1" />
          Remove
        </>
      );
    }
    
    return (
      <>
        <Plus className="h-3 w-3 mr-1" />
        Enquire
      </>
    );
  };

  const getQuickAddContent = () => {
    if (isProcessing) {
      return (
        <>
          <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent mr-1" />
          {isProductInCart ? 'Removing...' : 'Adding...'}
        </>
      );
    }
    
    if (isProductInCart) {
      return (
        <>
          <X className="h-3 w-3 mr-1" />
          Remove
        </>
      );
    }
    
    return (
      <>
        <ShoppingCart className="h-3 w-3 mr-1" />
        Quick Add
      </>
    );
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-800/50">
      <Link href={`/products/${slug}`}>
        <div className="aspect-square relative overflow-hidden bg-slate-50 dark:bg-slate-900">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={false}
          />
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}
          
          {/* Quick Add Button Overlay - Only show if in stock */}
          {inStock && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button
                size="sm"
                onClick={handleCartAction}
                disabled={!isLoaded || isProcessing}
                className={`transition-all duration-200 shadow-lg ${
                  isProductInCart 
                    ? "bg-red-600 hover:bg-red-700 text-white" 
                    : "bg-white hover:bg-slate-50 text-slate-900"
                }`}
              >
                {getQuickAddContent()}
              </Button>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/products/${slug}`}>
          <h3 className="font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors line-clamp-1 mb-1">
            {name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-3">{category}</p>
        
        <div className="flex items-center justify-between">
          <p className="font-semibold text-foreground">
            {formatPrice(price)}
          </p>
          
          <Button
            size="sm"
            variant={isProductInCart ? "destructive" : "outline"}
            onClick={handleCartAction}
            disabled={!isLoaded || !inStock || isProcessing}
            className={`transition-all duration-200 ${
              isProductInCart 
                ? "bg-red-600 hover:bg-red-700 text-white border-red-600" 
                : "hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20 dark:hover:border-blue-800"
            }`}
          >
            {getButtonContent()}
          </Button>
        </div>
      </div>
    </div>
  );
}