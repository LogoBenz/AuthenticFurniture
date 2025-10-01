"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { QuickViewModal } from "./QuickViewModal";
import { useEnquiryCart } from "@/hooks/use-enquiry-cart";
import { Product } from "@/types";

interface RowProps {
  title: string;
  fetcher: () => Promise<any[]>;
}

export function HorizontalProductRow({ title, fetcher }: RowProps) {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetcher();
        if (mounted) setItems(Array.isArray(data) ? data : []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [fetcher]);

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-2 text-center">
          {title}
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
          Discover our {title.toLowerCase()}, perfect for homes, offices, and commercial spaces.
        </p>
        <div className="relative">
          <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
            {loading && (
              <div className="text-muted-foreground text-sm">Loading...</div>
            )}
            {!loading && items.length === 0 && (
              <div className="text-muted-foreground text-sm">No products available</div>
            )}
            {items.map((p) => {
              return (
                <div key={p.id} className="min-w-[240px] sm:min-w-[280px] max-w-[280px] snap-start">
                  <ProductCard 
                    product={p} 
                    onQuickView={(product) => {
                      setQuickViewProduct(product);
                      setIsQuickViewOpen(true);
                    }}
                  />
                </div>
              );
            })}
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
