"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import ProductCard from "@/components/products/ProductCard";
import { QuickViewModal } from "@/components/products/QuickViewModal";

const PRODUCT_TYPES = [
  "Executive Tables",
  "Electric Desks",
  "Reception Tables",
  "Conference Tables",
  "Standard Tables",
];

interface OfficeTablesSectionProps {
  products: Product[];
}

export function OfficeTablesSection({ products }: OfficeTablesSectionProps) {
  const [selectedType, setSelectedType] = useState(PRODUCT_TYPES[0]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  useEffect(() => {
    // Filter products by selected type
    const filtered = products.filter(
      (product) => product.product_type === selectedType
    );
    setFilteredProducts(filtered);
  }, [selectedType, products]);

  const scrollContainer = (direction: "left" | "right") => {
    const container = document.getElementById("office-tables-carousel");
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="pt-5 pb-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-[85rem] mx-auto px-4">
        {/* Header with gradient background and image */}
        <div className="relative mb-8 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-transparent pointer-events-none"></div>
          <div className="relative flex items-center justify-between px-6 py-3">
            <div>
              <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
                Office Tables
              </h2>
            </div>
            <div className="hidden md:block -my-2">
              <Image
                src="/catImg/oTable.png"
                alt="Office Tables"
                width={150}
                height={100}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Type Filter Tabs */}
        <div className="flex gap-3 mb-8 justify-center overflow-x-auto pb-2 scrollbar-hide">
          {PRODUCT_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selectedType === type
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Products Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={() => scrollContainer("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-slate-800 p-2 rounded-full border border-slate-300 dark:border-slate-600 shadow-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-slate-900 dark:text-white" />
          </button>

          <button
            onClick={() => scrollContainer("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-slate-800 p-2 rounded-full border border-slate-300 dark:border-slate-600 shadow-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-slate-900 dark:text-white" />
          </button>

          {/* Products Grid - Using ProductCard component */}
          <div
            id="office-tables-carousel"
            className="overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-[32px]">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-[386px]">
                  <ProductCard 
                    product={product} 
                    onQuickView={(product) => {
                      setQuickViewProduct(product);
                      setIsQuickViewOpen(true);
                    }}
                  />
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-12">
                  <p className="text-slate-500 dark:text-slate-400">
                    No products available for {selectedType}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Latest Office Table Collections Section */}
        <div className="mt-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-heading font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                Latest Office Table Collections
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                Boost productivity at work or school with Apple iPad, Android, Windows, and drawing tablets. Powerful performance, long battery life, and portable designs for every need.
              </p>
            </div>
            <Link
              href="/products?subcategory=office-tables"
              className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </Link>
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
