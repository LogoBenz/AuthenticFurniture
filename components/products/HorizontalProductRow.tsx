"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEnquiryCart } from "@/hooks/use-enquiry-cart";
import { formatPrice } from "@/lib/products";

interface RowProps {
  title: string;
  fetcher: () => Promise<any[]>;
}

export function HorizontalProductRow({ title, fetcher }: RowProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, isInCart, isLoaded } = useEnquiryCart();

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
    <section className="py-8 sm:py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg sm:text-xl font-semibold">{title}</h3>
        </div>
        <div className="relative">
          <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2">
            {loading && (
              <div className="text-muted-foreground text-sm">Loading...</div>
            )}
            {!loading && items.length === 0 && (
              <div className="text-muted-foreground text-sm">No products available</div>
            )}
            {items.map((p) => {
              const discount = Number(p.discount_percent || 0);
              const original = Number(p.original_price ?? p.price);
              const discounted = discount > 0 ? Math.max(0, original * (1 - discount / 100)) : original;
              const inCart = isLoaded ? isInCart(p.id) : false;
              return (
                <div key={p.id} className="min-w-[180px] sm:min-w-[200px] max-w-[200px] snap-start rounded-lg border border-slate-200 dark:border-slate-800 bg-card shadow-sm">
                  <Link href={`/products/${p.slug}`} className="block">
                    <div className="relative w-full h-36 sm:h-40 bg-slate-50 dark:bg-slate-900 rounded-t-lg overflow-hidden flex items-center justify-center">
                      <Image src={p.imageUrl || p.images?.[0] || "/placeholder-product.jpg"} alt={p.name} fill className="object-cover" />
                      {discount > 0 && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">-{discount}%</div>
                      )}
                    </div>
                  </Link>
                  <div className="p-3">
                    <Link href={`/products/${p.slug}`} className="block mb-2">
                      <div className="line-clamp-2 text-sm font-medium">{p.name}</div>
                    </Link>
                    <div className="flex items-center gap-2 mb-3">
                      {discount > 0 ? (
                        <>
                          <span className="text-xs line-through text-muted-foreground">{formatPrice(original)}</span>
                          <span className="text-sm font-semibold text-red-600">{formatPrice(discounted)}</span>
                        </>
                      ) : (
                        <span className="text-sm font-semibold">{formatPrice(original)}</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className={inCart ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
                      onClick={(e) => { e.preventDefault(); addToCart(p); }}
                      disabled={!isLoaded}
                    >
                      {inCart ? "In Cart" : "Add to Cart"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


