"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Search, Loader2 } from "lucide-react";
import { searchProducts, getFeaturedProducts } from "@/lib/products";
import { Product } from "@/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const placeholderExamples = [
  "office tables",
  "conference tables",
  "student desks",
  "outdoor seating for bars",
  "executive chairs",
  "sofa sets",
  "storage cabinets",
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholder, setPlaceholder] = useState(placeholderExamples[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Load popular products when modal opens
  useEffect(() => {
    if (isOpen && popularProducts.length === 0) {
      const loadPopularProducts = async () => {
        try {
          const products = await getFeaturedProducts();
          setPopularProducts(products.slice(0, 6));
        } catch (error) {
          console.error("Error loading popular products:", error);
        }
      };
      loadPopularProducts();
    }
  }, [isOpen, popularProducts.length]);

  // Rotate placeholder text every 2 seconds
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderExamples.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Update placeholder with fade transition
  useEffect(() => {
    setPlaceholder(placeholderExamples[placeholderIndex]);
  }, [placeholderIndex]);

  // Debounced search with 300ms delay
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const timeoutId = setTimeout(async () => {
      try {
        const results = await searchProducts(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header with close button */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-slate-400" />
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Search Products
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>

              {/* Search Input */}
              <div className="p-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    key={placeholderIndex}
                    placeholder={`Search for ${placeholder}...`}
                    className="w-full pl-12 pr-4 py-4 text-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all animate-in fade-in duration-300"
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500 animate-spin" />
                  )}
                </div>
              </div>

              {/* Results area */}
              <div className="p-6 pt-0 max-h-[60vh] overflow-y-auto">
                {!searchQuery.trim() ? (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                      Popular Products
                    </h3>
                    {popularProducts.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {popularProducts.map((product) => (
                          <a
                            key={product.id}
                            href={`/products/${product.slug}`}
                            onClick={onClose}
                            className="group block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden hover:shadow-lg hover:border-blue-500 transition-all"
                          >
                            <div className="aspect-square relative overflow-hidden bg-slate-100 dark:bg-slate-700">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="p-3">
                              <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2 mb-1">
                                {product.name}
                              </h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                {product.category}
                              </p>
                              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                ₦{product.price.toLocaleString()}
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                        Start typing to search...
                      </p>
                    )}
                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        Popular categories:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["Office Tables", "Student Chairs", "Office Chairs", "Sofa Sets"].map((category) => (
                          <a
                            key={category}
                            href={`/products?subcategory=${category.toLowerCase().replace(/\s+/g, "-")}`}
                            onClick={onClose}
                            className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                          >
                            {category}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : isSearching ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {searchResults.map((product) => (
                        <a
                          key={product.id}
                          href={`/products/${product.slug}`}
                          onClick={onClose}
                          className="group block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden hover:shadow-lg hover:border-blue-500 transition-all"
                        >
                          <div className="aspect-square relative overflow-hidden bg-slate-100 dark:bg-slate-700">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {!product.inStock && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white text-sm font-semibold">Out of Stock</span>
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2 mb-1">
                              {product.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                              {product.category}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                ₦{product.price.toLocaleString()}
                              </span>
                              {product.inStock && (
                                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                  In Stock
                                </span>
                              )}
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-600 dark:text-slate-400 mb-2">
                      No products found for "{searchQuery}"
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      Try different keywords or browse our categories
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
