"use client";

import { useEffect, useState, useRef } from "react";
import ProductCard from "./ProductCard";
import { QuickViewModal } from "./QuickViewModal";
import { Product } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface RowProps {
  title: string;
  fetcher: () => Promise<any[]>;
}

export function HorizontalProductRow({ title, fetcher }: RowProps) {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetcher();
        if (mounted) setItems(Array.isArray(data) ? data : []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [fetcher]);

  // Track scroll progress
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth - container.clientWidth;
      const progress = scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;
      setScrollProgress(progress);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => container.removeEventListener('scroll', handleScroll);
  }, [items]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.querySelector('.product-card')?.clientWidth || 386;
      const scrollAmount = (cardWidth + 32) * 2; // Scroll 2 cards at a time
      
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-[85rem] mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold tracking-tight mb-2 text-center">
            {title}
          </h2>
          <div className="text-center text-muted-foreground">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-12 pb-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-[85rem] mx-auto px-4">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[28px] font-heading font-semibold tracking-tight text-slate-900 dark:text-white"
          >
            {title}
          </motion.h2>
          
          {/* Navigation Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-slate-900 dark:text-white" />
            </button>

            <button
              onClick={() => handleScroll('right')}
              className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-slate-900 dark:text-white" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-[32px]">
              {items.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                  className="flex-shrink-0 w-[386px] product-card"
                >
                  <ProductCard 
                    product={product}
                    onQuickView={(product) => {
                      setQuickViewProduct(product);
                      setIsQuickViewOpen(true);
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Minimal Scrollbar */}
          <div className="mt-6">
            <div 
              className="relative h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden cursor-pointer"
              onClick={(e) => {
                if (!scrollContainerRef.current) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = x / rect.width;
                const scrollWidth =
                  scrollContainerRef.current.scrollWidth -
                  scrollContainerRef.current.clientWidth;
                scrollContainerRef.current.scrollTo({
                  left: scrollWidth * percentage,
                  behavior: "smooth",
                });
              }}
            >
              <div
                className="absolute left-0 top-0 h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </div>
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
