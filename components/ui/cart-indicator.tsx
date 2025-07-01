"use client";

import { ShoppingCart } from "lucide-react";
import { useEnquiryCart } from "@/hooks/use-enquiry-cart";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export function CartIndicator() {
  const { getCartCount, isLoaded } = useEnquiryCart();
  const [mounted, setMounted] = useState(false);
  
  // Ensure component is mounted before showing to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted and loaded
  if (!mounted || !isLoaded) {
    return (
      <div className="flex items-center">
        <ShoppingCart className="h-5 w-5" />
      </div>
    );
  }

  const cartCount = getCartCount();

  return (
    <div className="flex items-center relative">
      <ShoppingCart className="h-5 w-5" />
      {cartCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold animate-in zoom-in-50"
        >
          {cartCount > 99 ? '99+' : cartCount}
        </Badge>
      )}
      <span className="sr-only">
        Cart {cartCount > 0 ? `(${cartCount} items)` : '(empty)'}
      </span>
    </div>
  );
}