"use client";

import { useState, useEffect } from "react";
import { getFeaturedProducts } from "@/lib/products";
import ProductCard from "@/components/products/ProductCard";
import { QuickViewModal } from "@/components/products/QuickViewModal";
import { Product } from "@/types";

export function NewArrivals() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  useEffect(() => {
    const loadNewArrivals = async () => {
      try {
        const products = await getFeaturedProducts();
        setNewArrivals(products);
      } catch (error) {
        console.error('Error loading new arrivals:', error);
        setNewArrivals([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadNewArrivals();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-center">
            New Arrivals
          </h2>
          <div className="text-center text-muted-foreground">Loading new arrivals...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-2 text-center">
          New Arrivals
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
          Discover our latest furniture pieces, perfect for homes, 
          offices, and commercial spaces.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              onQuickView={(product) => {
                setQuickViewProduct(product);
                setIsQuickViewOpen(true);
              }}
            />
          ))}
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