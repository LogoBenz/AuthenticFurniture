"use client";

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '@/hooks/use-wishlist';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 p-1',
  md: 'w-8 h-8 p-1.5',
  lg: 'w-10 h-10 p-2'
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
};

export function WishlistButton({ 
  productId, 
  size = 'md', 
  className 
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const inWishlist = isInWishlist(productId);
  
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔘 Wishlist button clicked for product:', productId);
    
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      console.log('📝 Toggling wishlist...');
      await toggleWishlist(productId);
      console.log('✅ Wishlist toggled successfully');
    } catch (error) {
      console.error('❌ Error toggling wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const tooltipText = inWishlist ? 'Remove from wishlist' : 'Add to wishlist';
  
  return (
    <div className="relative">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {tooltipText}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-slate-900" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        disabled={isLoading}
        className={cn(
          'relative flex items-center justify-center rounded-full transition-all duration-200',
          'bg-white/90 backdrop-blur-sm border border-slate-200',
          'hover:bg-white hover:scale-110 hover:shadow-md',
          'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
          'active:scale-95',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizeClasses[size],
          className
        )}
        aria-label={tooltipText}
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className={cn('border-2 border-slate-300 border-t-red-500 rounded-full', {
              'w-3 h-3': size === 'sm',
              'w-4 h-4': size === 'md',
              'w-5 h-5': size === 'lg'
            })}
          />
        ) : (
          <motion.div
            key={inWishlist ? 'filled' : 'outlined'}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: 'spring', 
              stiffness: 500, 
              damping: 30 
            }}
          >
            <Heart
              className={cn(
                'transition-colors duration-200',
                iconSizes[size],
                inWishlist 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-slate-600 hover:text-red-400'
              )}
            />
          </motion.div>
        )}
        
        <AnimatePresence>
          {inWishlist && (
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ scale: 1, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 rounded-full border-2 border-red-500"
            />
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
