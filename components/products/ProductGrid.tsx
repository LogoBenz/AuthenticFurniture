"use client";

import { useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import { QuickViewModal } from "@/components/products/QuickViewModal";
import { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  variant?: 'simple' | 'detailed';
}

export function ProductGrid({ products, variant = 'simple' }: ProductGridProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <div className="space-y-6">
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant={variant}
              onQuickView={(product) => setQuickViewProduct(product)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        </div>
      )}

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}