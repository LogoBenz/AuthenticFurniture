"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types";
import ProductCard from "@/components/products/ProductCard";
import { QuickViewModal } from "@/components/products/QuickViewModal";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";

interface FeaturedCollectionsProps {
    newArrivals: Product[];
    bestSellers: Product[];
}

type TabType = "new-arrivals" | "best-sellers";

export function FeaturedCollections({
    newArrivals = [],
    bestSellers = [],
}: FeaturedCollectionsProps) {
    console.log('FeaturedCollections rendering:', {
        newArrivals: newArrivals?.length,
        bestSellers: bestSellers?.length
    });

    const [activeTab, setActiveTab] = useState<TabType>("new-arrivals");
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    // Determine current products based on active tab
    const getActiveProducts = () => {
        switch (activeTab) {
            case "new-arrivals":
                return newArrivals || [];
            case "best-sellers":
                return bestSellers || [];
            default:
                return [];
        }
    };

    const getTabLabel = (tab: TabType) => {
        switch (tab) {
            case "new-arrivals":
                return "New Arrivals";
            case "best-sellers":
                return "Best Sellers";
            default:
                return "";
        }
    };

    const getTabLink = (tab: TabType) => {
        switch (tab) {
            case "new-arrivals":
                return "/products?sort=newest";
            case "best-sellers":
                return "/products?collection=best-sellers";
            default:
                return "/products";
        }
    };

    const products = getActiveProducts();

    return (
        <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-[85rem] mx-auto px-4">
                {/* Header with Tabs */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                    <div className="flex items-center gap-6 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
                        {(["new-arrivals", "best-sellers"] as TabType[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-2xl md:text-3xl font-heading font-bold whitespace-nowrap transition-colors relative ${activeTab === tab
                                    ? "text-slate-900 dark:text-white"
                                    : "text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400"
                                    }`}
                            >
                                {getTabLabel(tab)}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTabIndicator"
                                        className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-800 dark:bg-blue-500 rounded-full"
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    <Link
                        href={getTabLink(activeTab)}
                        className="hidden md:flex items-center gap-2 text-sm font-semibold text-blue-800 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors group"
                    >
                        View All {getTabLabel(activeTab)}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Product Grid/Carousel */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Horizontal Scrollable Carousel - All Screen Sizes */}
                            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory">
                                {products.map((product) => (
                                    <div key={product.id} className="flex-shrink-0 w-[280px] md:w-[300px] lg:w-[320px] snap-center">
                                        <ProductCard
                                            product={product}
                                            onQuickView={(product) => {
                                                setQuickViewProduct(product);
                                                setIsQuickViewOpen(true);
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Mobile "View All" button */}
                    <div className="mt-4 flex md:hidden justify-center">
                        <Link
                            href={getTabLink(activeTab)}
                            className="btn btn-outline w-full justify-center"
                        >
                            View All {getTabLabel(activeTab)}
                        </Link>
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
        </section>
    );
}
