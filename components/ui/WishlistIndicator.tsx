"use client";

import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/hooks/use-wishlist';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WishlistIndicatorProps {
  className?: string;
}

export function WishlistIndicator({ className }: WishlistIndicatorProps) {
  const { wishlistCount } = useWishlist();
  const router = useRouter();
  
  const handleClick = () => {
    router.push('/wishlist');
  };
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={cn(
        "relative p-2 hover:bg-blue-50 dark:hover:bg-blue-950",
        className
      )}
      aria-label={`View wishlist (${wishlistCount} items)`}
    >
      <Heart className="h-5 w-5" />
      
      {/* Count Badge */}
      <AnimatePresence>
        {wishlistCount > 0 && (
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
            {wishlistCount > 99 ? '99+' : wishlistCount}
          </motion.div>
        )}
      </AnimatePresence>
      
      <span className="sr-only">View wishlist</span>
    </Button>
  );
}
