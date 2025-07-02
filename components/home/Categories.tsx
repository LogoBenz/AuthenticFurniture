"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProductCategories } from "@/lib/products";

export function Categories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getProductCategories();
        setCategories(Array.isArray(cats) ? cats : []);
      } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback categories if there's an error
        setCategories([
          "Office Chairs",
          "Lounge Chairs", 
          "Gaming Chairs",
          "Conference Furniture",
          "Living Room"
        ]);
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-center">
            Browse by Category
          </h2>
          <div className="text-center text-muted-foreground">Loading categories...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-2 text-center">
          Browse by Category
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
          Find the perfect furniture for every space, from luxury homes to corporate offices.
        </p>
        
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link 
                href={`/products?category=${encodeURIComponent(category)}`}
                key={category}
                className="group relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-md"
              >
                <div className="aspect-square relative bg-slate-50 dark:bg-slate-900">
                  {categoryIcons[category] && (
                    <div 
                      className="w-full h-full bg-cover bg-center opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                      style={{ backgroundImage: `url(${categoryIcons[category]})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-end p-4">
                    <h3 className="text-white font-medium text-lg group-hover:text-amber-100 transition-colors">
                      {category}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            No categories available
          </div>
        )}
      </div>
    </section>
  );
}