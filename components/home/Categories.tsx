"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getPopularCategories } from "@/lib/db";
import { HorizontalProductRow } from "@/components/products/HorizontalProductRow";
import { getPromoProducts, getBestSellers, debugDatabaseState } from "@/lib/products";

interface Category {
  id: string;
  name: string;
  image_url: string;
  slug: string;
  is_popular: boolean;
}

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getPopularCategories();
        setCategories(Array.isArray(cats) ? cats : []);
        
        // Debug database state
        await debugDatabaseState();
      } catch (error) {
        console.error('Error loading popular categories:', error);
        // Fallback to empty array if no popular categories
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);
  
  const categoryIcons: Record<string, string> = {
    "Office Chairs": "https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "Lounge Chairs": "https://images.pexels.com/photos/2762247/pexels-photo-2762247.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "Gaming Chairs": "https://images.pexels.com/photos/5082573/pexels-photo-5082573.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "Public Seating": "https://images.pexels.com/photos/3771110/pexels-photo-3771110.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "Conference Furniture": "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "Tables": "https://images.pexels.com/photos/2647714/pexels-photo-2647714.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "Living Room": "https://images.pexels.com/photos/4352247/pexels-photo-4352247.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "Outdoor Furniture": "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "Office Furniture": "https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "Game Furniture": "https://images.pexels.com/photos/60912/pexels-photo-60912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  };

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-center">
            Popular Categories
          </h2>
          <div className="text-center text-muted-foreground text-sm sm:text-base">Loading popular categories...</div>
        </div>
      </section>
    );
  }

  // Don't render the section if there are no popular categories
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-center">
          Popular Categories
        </h2>
        <p className="text-center text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto text-sm sm:text-base">
          Find the perfect furniture for every space, from luxury homes to corporate offices.
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {categories.map((category) => (
            <Link 
              href={`/products?category=${encodeURIComponent(category.name)}`}
              key={category.id}
              className="group relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-md"
            >
              <div className="aspect-square relative bg-slate-50 dark:bg-slate-900">
                {category.image_url ? (
                  <div 
                    className="w-full h-full bg-cover bg-center opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                    style={{ backgroundImage: `url(${category.image_url})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  </div>
                ) : (
                  // Fallback to hardcoded images if no image_url
                  categoryIcons[category.name] && (
                    <div 
                      className="w-full h-full bg-cover bg-center opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                      style={{ backgroundImage: `url(${categoryIcons[category.name]})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    </div>
                  )
                )}
                <div className="absolute inset-0 flex items-end p-3 sm:p-4">
                  <h3 className="text-white font-medium text-sm sm:text-base lg:text-lg group-hover:text-amber-100 transition-colors leading-tight">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Horizontal product rows */}
      <HorizontalProductRow title="Promo Products" fetcher={getPromoProducts} />
      <HorizontalProductRow title="Best Sellers" fetcher={getBestSellers} />
    </section>
  );
}