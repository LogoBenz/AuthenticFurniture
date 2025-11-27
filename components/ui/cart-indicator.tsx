"use client";

import { ShoppingCart } from "lucide-react";
import { useEnquiryCart } from "@/hooks/use-enquiry-cart";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    <>
      <ShoppingCart className="h-5 w-5" />
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ scale: 0, x: 5 }}
            animate={{ scale: 1, x: 0 }}
            exit={{ scale: 0, x: 5 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30
            }}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center px-1"
          >
            {cartCount > 99 ? '99+' : cartCount}
          </motion.div>
        )}
      </AnimatePresence>
      <span className="sr-only">
        Cart {cartCount > 0 ? `(${cartCount} items)` : '(empty)'}
      </span>
    </>
  );
}