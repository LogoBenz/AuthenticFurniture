"use client";

import { useState, useEffect } from "react";
import { getAllProducts } from "@/lib/products";
import { Product } from "@/types";
import { ProductCarousel } from "./ProductCarousel";

interface RelatedProductsProps {
  currentProduct: Product;
  limit?: number;
}

export function RelatedProducts({ currentProduct, limit = 8 }: RelatedProductsProps) {
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
        <div className="w-full max-w-[1450px] mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Related Products
          </h2>
          <div className="flex gap-8 overflow-hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex-shrink-0 w-[300px] sm:w-[350px] animate-pulse">
                <div className="bg-gray-200 rounded-lg aspect-square mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div>
      <ProductCarousel
        title="Related Products"
        products={relatedProducts}
      />

      {complementaryProducts.length > 0 && (
        <ProductCarousel
          title="Complementary Products"
          products={complementaryProducts}
        />
      )}
    </div>
  );
}
