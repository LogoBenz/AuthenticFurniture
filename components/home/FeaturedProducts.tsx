"use client";

import { useState, useEffect, useRef } from "react";
import { getFeaturedProducts } from "@/lib/products";
import ProductCard from "@/components/products/ProductCard";
import { QuickViewModal } from "@/components/products/QuickViewModal";
import { Product } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export function NewArrivals() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);

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

    container.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation

    return () => container.removeEventListener("scroll", handleScroll);
  }, [newArrivals]);

  useEffect(() => {
    const loadNewArrivals = async () => {
      try {
        const products = await getFeaturedProducts();
        setNewArrivals(products);
      } catch (error) {
        console.error("Error loading new arrivals:", error);
        setNewArrivals([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadNewArrivals();
  }, []);

  // Auto-scroll functionality - pauses on hover
  useEffect(() => {
    if (isHovered || newArrivals.length === 0) {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
      return;
    }

    autoScrollInterval.current = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;

        if (container.scrollLeft >= maxScroll - 10) {
          // Reset to start with smooth transition
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // Scroll by one card width
          const cardWidth =
            container.querySelector(".product-card")?.clientWidth || 280;
          container.scrollBy({ left: cardWidth + 24, behavior: "smooth" }); // 24 is gap
        }
      }
    }, 3000); // Auto-scroll every 3 seconds

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [isHovered, newArrivals.length]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const cardWidth =
        scrollContainerRef.current.querySelector(".product-card")
          ?.clientWidth || 280;
      const scrollAmount = (cardWidth + 24) * 2; // Scroll 2 cards at a time

      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold tracking-tight mb-2 text-center">
            New Arrivals
          </h2>
          <div className="text-center text-muted-foreground">
            Loading new arrivals...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-[85rem] mx-auto px-4">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[28px] font-heading font-semibold tracking-tight text-slate-900 dark:text-white"
          >
            New Arrivals
          </motion.h2>

          {/* Navigation Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => handleScroll("left")}
              className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-slate-900 dark:text-white" />
            </button>

            <button
              onClick={() => handleScroll("right")}
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
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex gap-[32px]">
              {newArrivals.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.5,
                    ease: "easeOut",
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
