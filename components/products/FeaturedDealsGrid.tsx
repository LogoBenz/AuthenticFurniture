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

  // Separate products into big cards (first 2) and small cards (next 4)
  const bigCards = products.slice(0, 2);
  const smallCards = products.slice(2, 6);

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
    <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-2 text-center">
          {title}
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
          Discover our featured deals, perfect for homes, offices, and commercial spaces.
        </p>

        <div className="max-w-7xl mx-auto">
          {/* Big Cards Row - 2 large cards side by side */}
          {bigCards.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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

          {/* Small Cards Grid - 2x2 grid */}
          {smallCards.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {smallCards.map((product, index) => (
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

  if (isLarge) {
    // BIG CARD - Matches reference layout exactly
    return (
      <div className="bg-white rounded-lg border-2 border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer overflow-hidden h-[300px]">
        {/* Top badges */}
        <div className="flex gap-2 p-3 pb-0">
          <div className="bg-orange-600 text-white rounded-md px-3 py-1 text-sm font-bold">
            Selling Fast
          </div>
          {discountPercent > 0 && (
            <div className="bg-green-100 text-green-800 rounded-md px-3 py-1 text-sm font-medium">
              Free Shipping
            </div>
          )}
        </div>

        {/* Main content area */}
        <div className="flex h-full">
          {/* Left side - Image */}
          <div className="w-2/5 p-3">
            <div className="relative h-full bg-slate-50 rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right side - Product Info */}
          <div className="w-3/5 p-3 flex flex-col justify-between">
            {/* Product details */}
            <div>
              <h3 className="font-semibold text-slate-900 text-lg line-clamp-2 mb-2">
                {product.name}
              </h3>

              {/* Star rating */}
              <div className="flex items-center mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-slate-600 ml-2">(5)</span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="text-2xl font-bold text-slate-900">
                  {formatPrice(currentPrice)}
                </div>
                {discountPercent > 0 && (
                  <div className="text-green-600 text-sm font-medium">
                    You save {formatPrice(originalPrice - currentPrice)}
                  </div>
                )}
              </div>
            </div>

            {/* Stock counter bar */}
            <div className="mt-auto">
              <div className="bg-slate-200 rounded-full h-2 mb-2 overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${soldPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Stock: {stockCount}</span>
                <span>Sold: {soldCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SMALL CARD - Keep existing layout for small cards
  return (
    <div className="bg-white rounded-lg border-2 border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer overflow-hidden h-[240px]">
      <div className="relative overflow-hidden aspect-square bg-slate-50">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold">
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
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          title="Quick View"
        >
          <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 mb-2">
          {product.name}
        </h3>

        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-900 text-lg">
            {formatPrice(currentPrice)}
          </span>
          {discountPercent > 0 && (
            <span className="text-slate-500 line-through text-sm">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {discountPercent > 0 && (
          <div className="text-green-600 text-sm font-medium mt-1">
            You save {formatPrice(originalPrice - currentPrice)}
          </div>
        )}
      </div>
    </div>
  );
}
