"use client";

import { ShoppingCart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEnquiryCart } from "@/hooks/use-enquiry-cart";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface FloatingEnquiryButtonProps {
  onClick: () => void;
}

export function FloatingEnquiryButton({ onClick }: FloatingEnquiryButtonProps) {
  const { getCartCount, isLoaded } = useEnquiryCart();
  const [mounted, setMounted] = useState(false);
  const cartCount = getCartCount();

  // Ensure component is mounted before showing to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('🔄 FloatingEnquiryButton render:', {
      mounted,
      isLoaded,
      cartCount,
      shouldShow: mounted && isLoaded && cartCount > 0
    });
  }, [mounted, isLoaded, cartCount]);

  // Don't render until mounted and loaded, or if cart is empty
  if (!mounted || !isLoaded || cartCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        onClick={onClick}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 relative group animate-in slide-in-from-bottom-4"
        size="lg"
      >
        <div className="flex items-center gap-2 px-2">
          <ShoppingCart className="h-5 w-5" />
          <span className="hidden sm:inline font-medium">View Cart</span>
          <MessageCircle className="h-4 w-4 opacity-75" />
        </div>
        
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs font-bold shadow-md animate-pulse"
        >
          {cartCount > 99 ? '99+' : cartCount}
        </Badge>
        
        <span className="sr-only">View Enquiry Cart ({cartCount} items)</span>
        
        {/* Subtle pulse animation */}
        <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-10"></div>
      </Button>
    </div>
  );
}