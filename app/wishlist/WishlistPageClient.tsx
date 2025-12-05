"use client";

import { useEffect, useState } from 'react';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useWishlist } from '@/hooks/use-wishlist';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { supabase as createClient } from '@/lib/supabase';
import { Product } from '@/types';

function WishlistSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-slate-200 dark:bg-slate-700 aspect-square rounded-lg mb-3" />
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyWishlistState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{
          delay: 0.2,
          type: 'spring',
          stiffness: 200,
          damping: 20
        }}
        className="mb-6"
      >
        <Heart className="w-24 h-24 text-slate-300 dark:text-slate-600" />
      </motion.div>

      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
        Your Wishlist is Empty
      </h2>

      <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
        Save products you love to view them later. Start building your dream furniture collection!
      </p>

      <Link href="/products">
        <Button size="lg" className="gap-2">
          <ShoppingBag className="w-5 h-5" />
          Browse Products
        </Button>
      </Link>
    </motion.div>
  );
}

function WishlistHeader({
  count,
  onClearAll
}: {
  count: number;
  onClearAll: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          My Wishlist
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          {count} {count === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      {count > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAll}
          className="gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </Button>
      )}
    </div>
  );
}

// Transform database row to Product type
const transformProduct = (row: any): Product => {
  // Handle images - could be stored as JSON array, comma-separated string, or single URL
  let images: string[] = [];

  if (row.images) {
    if (Array.isArray(row.images)) {
      images = row.images;
    } else if (typeof row.images === 'string') {
      try {
        const parsed = JSON.parse(row.images);
        images = Array.isArray(parsed) ? parsed : [row.images];
      } catch {
        images = row.images.split(',').map((url: string) => url.trim()).filter(Boolean);
      }
    }
  }

  // Fallback to single image_url if no images array
  if (images.length === 0 && row.image_url) {
    images = [row.image_url];
  }

  // Ensure we have at least one image
  if (images.length === 0) {
    images = ['/placeholder-product.jpg'];
  }

  return {
    ...row,
    id: String(row.id || ''),
    images: images,
    imageUrl: images[0], // Backward compatibility - use first image
    image_url: row.image_url || images[0],
    inStock: Boolean(row.in_stock),
    isFeatured: Boolean(row.is_featured),
  } as Product;
};

export function WishlistPageClient() {
  const { wishlist, loading, clearWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const supabase = createClient;

  // Load product details for wishlist items
  useEffect(() => {
    const loadProducts = async () => {
      if (wishlist.length === 0) {
        setProducts([]);
        return;
      }

      setLoadingProducts(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', wishlist);

        if (error) {
          console.error('Error loading wishlist products:', error);
          return;
        }

        // Transform and sort products to match wishlist order
        const sortedProducts = wishlist
          .map(id => data?.find((p: any) => p.id.toString() === id))
          .filter(Boolean)
          .map(transformProduct);

        setProducts(sortedProducts);

        // Handle orphaned products (Requirement 9.3)
        // If we have fewer products than wishlist items, some items are missing/deleted from DB
        if (sortedProducts.length < wishlist.length) {
          const foundIds = new Set(sortedProducts.map(p => p.id));
          const orphanedIds = wishlist.filter(id => !foundIds.has(id));

          if (orphanedIds.length > 0) {
            console.warn('Found orphaned wishlist items:', orphanedIds);

            // If we really want to clean up:
            const cleanup = async () => {
              const { data: { user } } = await createClient.auth.getUser();
              if (!user) return; // Only cleanup for auth users, guest logic is harder to reach here without context

              await Promise.all(
                orphanedIds.map(id =>
                  createClient
                    .from('wishlists')
                    .delete()
                    .match({ user_id: user.id, product_id: id })
                )
              );
            };

            cleanup().catch(console.error);
          }
        }
      } catch (error) {
        console.error('Error loading wishlist products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, [wishlist, supabase]);

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      await clearWishlist();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-2 animate-pulse" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32 animate-pulse" />
          </div>
          <WishlistSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-32">
      <div className="container mx-auto px-4 py-8">
        <WishlistHeader
          count={wishlist.length}
          onClearAll={handleClearAll}
        />

        {wishlist.length === 0 ? (
          <EmptyWishlistState />
        ) : (
          <>
            {loadingProducts ? (
              <WishlistSkeleton />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              >
                <AnimatePresence>
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05
                      }}
                      layout
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
