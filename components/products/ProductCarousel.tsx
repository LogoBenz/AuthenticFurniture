"use client";

import { useState, useEffect, useRef } from "react";
import ProductCard from "@/components/products/ProductCard";
import { QuickViewModal } from "@/components/products/QuickViewModal";
import { Product } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCarouselProps {
    title: string;
    subtitle?: string;
    products: Product[];
}

export function ProductCarousel({ title, subtitle, products }: ProductCarouselProps) {
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

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
        handleScroll();

        return () => container.removeEventListener('scroll', handleScroll);
    }, [products]);

    const handleScroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const cardWidth = scrollContainerRef.current.querySelector('.product-card')?.clientWidth || 386;
            const scrollAmount = (cardWidth + 32) * 2;

            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (products.length === 0) return null;

    return (
        <div className="py-12 border-t border-gray-100">
            <div className="w-full max-w-[1450px] mx-auto px-4">
                {/* Header with Navigation */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-semibold text-gray-900"
                        >
                            {title}
                        </motion.h2>
                        {subtitle && (
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-gray-600 mt-1"
                            >
                                {subtitle}
                            </motion.p>
                        )}
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                        <button
                            onClick={() => handleScroll('left')}
                            className="bg-white p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-900" />
                        </button>

                        <button
                            onClick={() => handleScroll('right')}
                            className="bg-white p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-900" />
                        </button>
                    </div>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    <div
                        ref={scrollContainerRef}
                        className="overflow-x-auto scrollbar-hide scroll-smooth"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <div className="flex gap-8">
                            {products.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: index * 0.05,
                                        duration: 0.5,
                                        ease: "easeOut"
                                    }}
                                    className="flex-shrink-0 w-[300px] sm:w-[350px] product-card"
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
                    <div className="mt-8">
                        <div
                            className="relative h-1 bg-gray-200 rounded-full overflow-hidden cursor-pointer max-w-xs mx-auto"
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
                                className="absolute left-0 top-0 h-full bg-blue-600 rounded-full transition-all duration-300"
                                style={{ width: `${scrollProgress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <QuickViewModal
                product={quickViewProduct}
                isOpen={isQuickViewOpen}
                onClose={() => {
                    setIsQuickViewOpen(false);
                    setQuickViewProduct(null);
                }}
            />
        </div>
    );
}
