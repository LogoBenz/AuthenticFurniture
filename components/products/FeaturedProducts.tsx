"use client";

import { useState, useEffect } from "react";
import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/products/ProductCard";
import { Product } from "@/types";

export function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-center">
            Featured Products
          </h2>
          <div className="text-center text-muted-foreground text-sm sm:text-base">Loading featured products...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-center">
          Featured Products
        </h2>
        <p className="text-center text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto text-sm sm:text-base">
          Discover our selection of high-quality furniture pieces, perfect for homes, 
          offices, and commercial spaces.
        </p>
        
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground text-sm sm:text-base">
            No featured products available
          </div>
        )}
      </div>
    </section>
  );
}