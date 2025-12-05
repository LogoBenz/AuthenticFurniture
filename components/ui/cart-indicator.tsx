"use client";

import { useEnquiryCart } from "@/hooks/use-enquiry-cart";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function CustomCartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M0 1h4.764l.545 2h18.078l-3.666 11H7.78l-.5 2H22v2H4.72l1.246-4.989L3.236 3H0V1Zm7.764 11h10.515l2.334-7H5.855l1.909 7ZM4 21a2 2 0 1 1 4 0a2 2 0 0 1-4 0Zm14 0a2 2 0 1 1 4 0a2 2 0 0 1-4 0Z" />
    </svg>
  );
}

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
        <CustomCartIcon className="h-5 w-5" />
      </div>
    );
  }

  const cartCount = getCartCount();

  return (
    <>
      <CustomCartIcon className="h-5 w-5" />
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