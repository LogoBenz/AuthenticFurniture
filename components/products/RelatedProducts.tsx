"use client";

import { useState, useEffect } from "react";
import { getAllProducts } from "@/lib/products";
import { Product } from "@/types";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RelatedProductsProps {
  currentProduct: Product;
  limit?: number;
}

export function RelatedProducts({ currentProduct, limit = 4 }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [complementaryProducts, setComplementaryProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRelatedProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        
        // Filter related products (same category, different product)
        const related = allProducts
          .filter(p => 
            p.id !== currentProduct.id && 
            p.category === currentProduct.category
          )
          .slice(0, limit);
        
        setRelatedProducts(related);

        // Complementary logic: simple heuristic by name/category keywords
        const category = (currentProduct.category || '').toLowerCase();
        const name = (currentProduct.name || '').toLowerCase();
        let targetKeywords: string[] = [];
        if (category.includes('table') || name.includes('table') || name.includes('desk')) {
          targetKeywords = ['chair', 'office chair', 'armchair', 'bookshelf', 'shelf'];
        } else if (category.includes('sofa') || name.includes('sofa') || name.includes('couch')) {
          targetKeywords = ['table', 'coffee table', 'side table', 'rug'];
        } else if (category.includes('bed') || name.includes('bed')) {
          targetKeywords = ['wardrobe', 'dresser', 'nightstand'];
        } else if (category.includes('chair') || name.includes('chair')) {
          targetKeywords = ['table', 'desk'];
        }

        const complementary = allProducts
          .filter(p => p.id !== currentProduct.id)
          .filter(p => targetKeywords.some(kw => `${p.name} ${p.category}`.toLowerCase().includes(kw)))
          .slice(0, limit);

        setComplementaryProducts(complementary);
      } catch (error) {
        console.error('Error loading related products:', error);
        setRelatedProducts([]);
        setComplementaryProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadRelatedProducts();
  }, [currentProduct, limit]);

  if (loading) {
    return (
      <div className="py-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
          Related Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-slate-200 dark:bg-slate-700 rounded-lg aspect-square mb-4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="py-12">
      <div className="w-full max-w-[1400px] mx-auto px-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
          Related Products
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
          You might also like these products from the same category
        </p>
        
        <div className="flex flex-wrap gap-8 justify-center">
          {relatedProducts.map((product) => (
            <div key={product.id} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {complementaryProducts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
              Complementary Products
            </h3>
            <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
              People also bought these with this product
            </p>
            <div className="flex flex-wrap gap-8 justify-center">
              {complementaryProducts.map((product) => (
                <div key={product.id} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
