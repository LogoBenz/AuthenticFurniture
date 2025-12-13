"use client";

import { useState, useEffect, useRef } from "react";
import { Search, History, TrendingUp, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getFeaturedProducts } from "@/lib/products";
import { Product } from "@/types";

const PLACEHOLDERS = [
    "Search Authentic Furniture",
    "Search Executive Tables",
    "Search Sofa Sets",
    "Search Office Chairs",
    "Search Bedroom sets",
    "Search Dining Tables"
];

const POPULAR_SEARCHES = [
    "Center Table", "Sofa", "TV Stand", "Bed", "Dining Table"
];

export function SearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0]);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    // Data State
    const [popularProducts, setPopularProducts] = useState<Product[]>([]);
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    // Animated Placeholder
    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setPlaceholder(PLACEHOLDERS[placeholderIndex]);
    }, [placeholderIndex]);

    // Fetch Popular Products (Initial Load)
    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const products = await getFeaturedProducts();
                setPopularProducts(products.slice(0, 8));
            } catch (err) {
                console.error("Failed to fetch popular products", err);
            }
        };
        fetchPopular();
    }, []);

    // Instant Search Logic
    useEffect(() => {
        if (!query.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        setIsSearching(true);
        debounceTimer.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setSearchResults(data.products || []);
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setIsSearching(false);
            }
        }, 300); // 300ms debounce

        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [query]);

    // Click Outside Handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/products?search=${encodeURIComponent(query.trim())}`);
            setIsFocused(false);
        }
    };

    const showResults = query.trim().length > 0;
    const productsToDisplay = showResults ? searchResults : popularProducts;

    return (
        <div ref={containerRef} className="relative w-full max-w-md">
            {/* Input Field */}
            <form onSubmit={handleSearch} className="relative z-20">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 dark:text-slate-300" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        placeholder={placeholder}
                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border transition-all duration-200 outline-none text-sm rounded-full
              ${isFocused
                                ? "border-slate-400 dark:border-slate-600 ring-2 ring-blue-500/20"
                                : "border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500"
                            }
            `}
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery("");
                                setSearchResults([]);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full"
                        >
                            <X className="h-3 w-3 text-slate-500" />
                        </button>
                    )}
                </div>
            </form>

            {/* Dropdown Menu */}
            {isFocused && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-b-lg rounded-t-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 mt-2 max-h-[500px] overflow-y-auto custom-scrollbar">

                    {/* Trending / Popular Searches */}
                    {!showResults && (
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <TrendingUp className="h-3 w-3" />
                                Popular Searches
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {POPULAR_SEARCHES.map((term) => (
                                    <button
                                        key={term}
                                        onClick={() => {
                                            setQuery(term);
                                            router.push(`/products?search=${encodeURIComponent(term)}`);
                                            setIsFocused(false);
                                        }}
                                        className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        <Search className="inline-block h-3 w-3 mr-1.5 -mt-0.5 opacity-50" />
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Product Results */}
                    <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {isSearching ? <Loader2 className="h-3 w-3 animate-spin" /> : <History className="h-3 w-3" />}
                                {showResults ? (searchResults.length > 0 ? "Search Results" : "No results found") : "Popular Products"}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {productsToDisplay.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.slug}`}
                                    onClick={() => setIsFocused(false)}
                                    className="block bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all group"
                                >
                                    <div className="w-full aspect-[4/3] bg-slate-100 dark:bg-slate-700 overflow-hidden relative">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {product.inStock && (
                                            <div className="absolute top-2 right-2 bg-green-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                                                IN STOCK
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {product.name}
                                        </h4>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                ₦{product.price.toLocaleString()}
                                            </span>
                                            <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                                                {product.category}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {showResults && searchResults.length === 0 && !isSearching && (
                            <div className="text-center py-8 text-slate-400 text-sm">
                                No products found matching "{query}"
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
