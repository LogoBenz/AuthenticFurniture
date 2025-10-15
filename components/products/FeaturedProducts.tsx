"use client";

import { useState, useEffect, useRef } from "react";
import { getFeaturedProducts } from "@/lib/products";
import { Product } from "@/types";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEnquiryCart } from "@/hooks/use-enquiry-cart";

export function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addToCart, isInCart } = useEnquiryCart();

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const products = await getFeaturedProducts();
        setFeaturedProducts(Array.isArray(products) ? products : []);
      } catch (error) {
        console.error('Error loading featured products:', error);
        setFeaturedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -scrollRef.current.clientWidth : scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center">Featured Products</h2>
          <div className="text-center text-gray-500">Loading featured products...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-12 sm:py-16 bg-slate-50 dark:bg-slate-900/50 overflow-hidden">
      <div className="max-w-[85rem] mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Best Sellers</h2>
        </div>

        <div className="relative group">
        {/* Scroll Buttons */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm border rounded-full p-2 shadow hover:bg-white transition-opacity opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm border rounded-full p-2 shadow hover:bg-white transition-opacity opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>

        {/* Scrollable Product Row */}
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide pb-6"
        >
          {featuredProducts.map((product) => {
            const originalPrice = product.original_price || product.price;
            const discountPercent = product.discount_percent || 0;
            const currentPrice = discountPercent > 0 ? originalPrice * (1 - discountPercent / 100) : originalPrice;
            const savingsAmount = discountPercent > 0 ? originalPrice - currentPrice : 0;
            const imageUrl = product.imageUrl || product.images?.[0] || "/placeholder-product.jpg";

            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="flex-none snap-start w-[85%] sm:w-[45%] lg:w-[30%] bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Image Section */}
                <div className="relative aspect-[5/4] overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover scale-105 hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 30vw"
                    unoptimized
                  />
                  {discountPercent > 0 && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                      -{discountPercent}%
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5 flex flex-col justify-between h-[180px]">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="mt-auto pt-3 flex flex-col justify-end">
                    {savingsAmount > 0 && (
                      <p className="text-sm text-green-600 font-medium mb-1">
                        You save {formatPrice(savingsAmount)}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                          {formatPrice(currentPrice)}
                        </p>
                        {discountPercent > 0 && (
                          <p className="text-sm text-gray-400 line-through">
                            {formatPrice(originalPrice)}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-sm transition-all"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

          {/* Gradient Fade Right */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-slate-50 dark:from-slate-900 to-transparent" />
        </div>
      </div>
    </section>
  );
}