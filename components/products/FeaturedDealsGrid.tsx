"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { QuickViewModal } from "./QuickViewModal";

interface FeaturedDealsGridProps {
  title?: string;
  fetcher?: () => Promise<Product[]>;
}

export function FeaturedDealsGrid({ title = "Deals of the Week", fetcher }: FeaturedDealsGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (fetcher) {
          const data = await fetcher();
          if (mounted) setProducts(Array.isArray(data) ? data.slice(0, 6) : []);
        }
      } catch (error) {
        console.error('Error fetching featured deals:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [fetcher]);

  // 2 big cards on top, 4 normal cards at bottom (6 total)
  const bigCards = products.slice(0, 2);
  const normalCards = products.slice(2, 6);

  if (loading) {
    return (
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mr-3"></div>
            <span className="text-muted-foreground">Loading deals...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-5 pb-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-[85rem] mx-auto px-4">
        <h2 className="text-[28px] font-heading font-semibold tracking-tight mb-10 text-left">
          {title}
        </h2>

        <div className="w-full">
          {/* Big Cards Row - 2 large cards side by side */}
          {bigCards.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {bigCards.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="relative"
                >
                  <FeaturedDealCard
                    product={product}
                    size="large"
                    onQuickView={(product) => {
                      setQuickViewProduct(product);
                      setIsQuickViewOpen(true);
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Normal Cards Row - 4 cards in a row */}
          {normalCards.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {normalCards.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: (index + 2) * 0.1 }}
                >
                  <FeaturedDealCard
                    product={product}
                    size="small"
                    onQuickView={(product) => {
                      setQuickViewProduct(product);
                      setIsQuickViewOpen(true);
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Fallback for no products */}
          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No featured deals available at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false);
          setQuickViewProduct(null);
        }}
      />
    </section>
  );
}

// Featured Deal Card Component - Redesigned to match reference
interface FeaturedDealCardProps {
  product: Product;
  size: 'large' | 'small';
  onQuickView: (product: Product) => void;
}

function FeaturedDealCard({ product, size, onQuickView }: FeaturedDealCardProps) {
  const imageUrl = product.imageUrl || product.images?.[0] || "/placeholder-product.jpg";
  const isLarge = size === 'large';

  // Calculate pricing
  const originalPrice = product.original_price || product.price;
  const discountPercent = product.discount_percent || 0;
  const currentPrice = discountPercent > 0 ? originalPrice * (1 - discountPercent / 100) : originalPrice;

  // Mock stock data (in real app, this would come from database)
  const stockCount = (product as any).stock_count || 59;
  const soldCount = (product as any).sold_count || 67;
  const totalStock = stockCount + soldCount;
  const soldPercentage = (soldCount / totalStock) * 100;

  // Format price to Nigerian Naira
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(price);
  };

  // Navigate to product page
  const handleClick = () => {
    window.location.href = `/products/${product.slug}`;
  };

  if (isLarge) {
    // BIG CARD - 656x299px desktop, responsive mobile
    return (
      <div
        onClick={handleClick}
        className="relative bg-white border-2 border-slate-700 shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 group cursor-pointer overflow-hidden h-auto lg:h-[299px]"
      >
        {/* Badges positioned over the image */}
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          <div className="bg-yellow-400 text-slate-900 px-2.5 py-1 text-xs font-semibold shadow-md rounded">
            Selling Fast
          </div>
          {discountPercent > 0 && (
            <div className="bg-green-500 text-white px-2.5 py-1 text-xs font-semibold shadow-md rounded">
              Free Shipping
            </div>
          )}
        </div>

        {/* Main content area - Responsive layout */}
        <div className="flex flex-col lg:flex-row h-full relative">
          {/* Left side - Image (widened from 40% to 50%) */}
          <div className="w-full lg:w-[50%] flex-shrink-0">
            <div className="relative h-full bg-white overflow-hidden">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Right side - Product Info (reduced from 60% to 50%) */}
          <div className="w-full lg:w-[50%] flex flex-col justify-center bg-white backdrop-blur-sm p-4 lg:p-0" style={{ padding: '20px 20px 20px 10px' }}>
            <div className="flex flex-col justify-between h-full">
              {/* Product details - centered content */}
              <div className="flex-grow flex flex-col justify-center">
                <h3 className="font-heading font-bold text-slate-900 dark:text-white text-sm sm:text-base mb-3 leading-tight break-words">
                  {product.name}
                </h3>



                {/* Price */}
                <div className="mb-4">
                  {discountPercent > 0 && (
                    <div className="text-green-600 dark:text-green-400 text-sm font-semibold mb-1">
                      💰 You save {formatPrice(originalPrice - currentPrice)}
                    </div>
                  )}
                  <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {formatPrice(currentPrice)}
                  </div>
                </div>
              </div>

              {/* Stock counter bar - Compact design */}
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-2.5">
                <div className="flex justify-between text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1.5 gap-2">
                  <span className="text-red-500 font-semibold whitespace-nowrap">Stock: {stockCount}</span>
                  <span className="text-slate-500 whitespace-nowrap">Sold: {soldCount}</span>
                </div>
                <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-1.5 overflow-hidden">
                  <div
                    className="bg-red-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${soldPercentage}%` }}
                  />
                </div>
                <div className="text-[11px] text-center text-slate-500 dark:text-slate-400 font-medium">
                  Hurry! Only {stockCount} left in stock
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SMALL CARD - Compact responsive design
  return (
    <div
      onClick={handleClick}
      className="bg-white border border-slate-300 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer overflow-hidden flex flex-col w-full h-full"
    >
      <div className="relative overflow-hidden aspect-square bg-white shrink-0">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold shadow-md rounded">
            -{discountPercent}%
          </div>
        )}

        {/* Quick View Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-colors duration-200 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          title="Quick View"
        >
          <svg className="w-4 h-4 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>

        {/* Stock indicator badge */}
        <div className="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur-sm text-white px-2 py-1 text-xs font-semibold shadow-md rounded">
          {stockCount} in stock
        </div>
      </div>

      {/* Product Info - Compact */}
      <div className="p-3 flex flex-col justify-between flex-grow">
        <h3 className="font-semibold text-slate-900 dark:text-white text-base line-clamp-2 mb-2">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="mt-auto">
          {discountPercent > 0 && (
            <div className="text-green-600 dark:text-green-400 text-xs font-semibold mb-1">
              Save {formatPrice(originalPrice - currentPrice)}
            </div>
          )}
          <div className="flex items-baseline space-x-2 mb-1">
            <span className="font-bold text-slate-900 dark:text-white text-lg">
              {formatPrice(currentPrice)}
            </span>
            {discountPercent > 0 && (
              <span className="text-slate-500 dark:text-slate-400 line-through text-xs">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
