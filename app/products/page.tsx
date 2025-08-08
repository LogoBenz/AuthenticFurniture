"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { getAllProducts, getProductCategories } from "@/lib/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { EnquiryCartModal } from "@/components/products/EnquiryCartModal";
import { Product } from "@/types";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams?.get("category") ?? undefined;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory || "all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Ensure component is mounted before showing cart functionality
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getProductCategories()
        ]);
        
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
        setProducts([]);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);
  
  // Enhanced filtering with proper search implementation
  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    // Apply search filter first if there's a search query
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase().trim();
      filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.features.some(feature => 
          feature.toLowerCase().includes(searchTerm)
        )
      );
    }
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Filter by availability
    if (showAvailableOnly) {
      filtered = filtered.filter(product => product.inStock);
    }
    
    return filtered;
  }, [products, selectedCategory, searchQuery, showAvailableOnly]);

  // Update the selected category when the URL parameter changes
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [urlCategory]);

  if (isLoading) {
    return (
      <div className="pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2">Our Products</h1>
            <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
              Browse our collection of high-quality furniture, perfect for homes, offices, 
              and commercial spaces throughout Nigeria.
            </p>
          </div>
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-blue-600 border-t-transparent mr-3"></div>
            <span className="text-muted-foreground text-sm sm:text-base">Loading products...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2">Our Products</h1>
          <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
            Browse our collection of high-quality furniture, perfect for homes, offices, 
            and commercial spaces throughout Nigeria.
          </p>
        </div>
        
        <div className="mb-6 sm:mb-8">
          <ProductFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showAvailableOnly={showAvailableOnly}
            onAvailableOnlyChange={setShowAvailableOnly}
          />
        </div>
        
        <ProductGrid products={filteredProducts} />
        
        {/* Results Summary */}
        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} products
          {searchQuery && ` for "${searchQuery}"`}
          {selectedCategory !== "all" && ` in ${selectedCategory}`}
          {showAvailableOnly && ` (available only)`}
        </div>
      </div>

      {/* Enquiry Cart Modal */}
      <EnquiryCartModal 
        isOpen={isCartModalOpen} 
        onClose={() => setIsCartModalOpen(false)} 
      />
    </div>
  );
}