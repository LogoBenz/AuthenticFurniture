"use client";

import { useState, useCallback } from "react";
import { Plus, X, ShoppingCart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEnquiryCart } from "@/hooks/use-enquiry-cart";
import { Product } from "@/types";

interface ProductPageClientProps {
  product: Product;
}

export function ProductPageClient({ product }: ProductPageClientProps) {
  const { addToCart, removeFromCart, isInCart, isLoaded } = useEnquiryCart();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const isProductInCart = isLoaded ? isInCart(product.id) : false;

  const handleCartToggle = useCallback(async () => {
    if (!isLoaded || !product.inStock || isProcessing) {
      return;
    }

    setIsProcessing(true);
    
    try {
      if (isProductInCart) {
        removeFromCart(product.id);
      } else {
        addToCart(product);
      }
      
      // Brief delay to show feedback
      setTimeout(() => {
        setIsProcessing(false);
      }, 300);
    } catch (error) {
      console.error("Error updating cart:", error);
      setIsProcessing(false);
    }
  }, [addToCart, removeFromCart, product, isLoaded, isProductInCart, isProcessing]);

  const handleDirectWhatsApp = () => {
    const message = `Hi! I'm interested in the ${product.name} from your website.\n\nProduct: ${product.name}\nCategory: ${product.category}\nPrice: ${new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(product.price)}\nLink: ${window.location.href}\n\nPlease provide more details about availability, pricing, and delivery options.`;
    
    const phoneNumber = "2348012345678";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const getButtonContent = () => {
    if (isProcessing) {
      return (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
          {isProductInCart ? 'Removing from Cart...' : 'Adding to Cart...'}
        </>
      );
    }
    
    if (isProductInCart) {
      return (
        <>
          <X className="h-4 w-4 mr-2" />
          Remove from Cart
        </>
      );
    }
    
    return (
      <>
        <Plus className="h-4 w-4 mr-2" />
        Add to Cart
      </>
    );
  };

  if (!product.inStock) {
    return (
      <div className="pt-4">
        <Button disabled className="w-full mb-4" size="lg">
          Out of Stock
        </Button>
        <Button 
          variant="outline" 
          onClick={handleDirectWhatsApp}
          className="w-full"
          size="lg"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask About Availability
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-4 space-y-3">
      <Button
        onClick={handleCartToggle}
        disabled={!isLoaded || isProcessing}
        className={`w-full transition-all duration-200 ${
          isProductInCart 
            ? "bg-red-600 hover:bg-red-700 text-white" 
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
        size="lg"
      >
        {getButtonContent()}
      </Button>
      
      <Button 
        variant="outline" 
        onClick={handleDirectWhatsApp}
        className="w-full"
        size="lg"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Quick WhatsApp Enquiry
      </Button>
      
      {isProductInCart && (
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <div className="flex items-center text-green-800 dark:text-green-200">
            <ShoppingCart className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">
              Added to enquiry cart! View your cart to send a bulk enquiry.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}