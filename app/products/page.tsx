"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getFilteredProducts, getProductCategories } from "@/lib/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { EnquiryCartModal } from "@/components/products/EnquiryCartModal";
import { Product } from "@/types";
import { getSpacesForNavigation } from "@/lib/categories";
import type { Space, Subcategory } from "@/types";

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams?.get("category") ?? undefined;
  const urlSpace = searchParams?.get("space") ?? undefined;
  const urlSubcategory = searchParams?.get("subcategory") ?? undefined;
  const minPrice = searchParams?.get("minPrice") ? parseInt(searchParams.get("minPrice")!) : 0;
  const maxPrice = searchParams?.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!) : 1000000;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory || "all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const activeSpace = useMemo(() => spaces.find(s => s.slug === urlSpace), [spaces, urlSpace]);
  const activeSubcategory = useMemo<Subcategory | undefined>(() => {
    if (!activeSpace || !urlSubcategory) return undefined;
    return activeSpace.subcategories?.find(sc => sc.slug === urlSubcategory);
  }, [activeSpace, urlSubcategory]);
  
  // Ensure component is mounted before showing cart functionality
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData, spacesData] = await Promise.all([
          getFilteredProducts(),
          getProductCategories(),
          getSpacesForNavigation()
        ]);
        
        setProducts(productsData);
        setCategories(categoriesData);
        setSpaces(spacesData);
      } catch (error) {
        console.error('Error loading data:', error);
        setProducts([]);
        setCategories([]);
        setSpaces([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);
  
  // Enhanced filtering with proper search implementation
  const filteredProducts = useMemo(() => {
    console.log('🔍 FILTERING PRODUCTS');
    console.log('  Total products:', products.length);
    console.log('  URL params:', { urlSpace, urlSubcategory, minPrice, maxPrice });
    
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

    // Filter by Space and Subcategory (Space → Subspace enforcement)
    // Also fallback to matching by subcategory name if space/subcategory relationships aren't set
    if (urlSpace) {
      filtered = filtered.filter(product => {
        const productSpaceSlug = (product.space?.slug || "").toLowerCase();
        return productSpaceSlug === urlSpace.toLowerCase();
      });
    }
    if (urlSubcategory) {
      filtered = filtered.filter(product => {
        const productSubSlug = (product.subcategory?.slug || "").toLowerCase();
        const productCategory = product.category.toLowerCase();
        const subcategoryName = urlSubcategory.replace(/-/g, ' ').toLowerCase();
        
        // Match by subcategory slug OR by category name (fallback)
        return productSubSlug === urlSubcategory.toLowerCase() || 
               productCategory.includes(subcategoryName) ||
               subcategoryName.includes(productCategory);
      });
    }

    // Filter by category (fallback to old category system if no space/subcategory)
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by price range
    console.log('  Before price filter:', filtered.length);
    filtered = filtered.filter(product => 
      product.price >= minPrice && product.price <= maxPrice
    );
    console.log('  After price filter:', filtered.length);

    // Filter by availability
    if (showAvailableOnly) {
      filtered = filtered.filter(product => product.inStock);
    }

    console.log('  Final filtered count:', filtered.length);
    return filtered;
  }, [products, selectedCategory, searchQuery, showAvailableOnly, urlSpace, urlSubcategory, minPrice, maxPrice]);

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
          {activeSpace || activeSubcategory ? (
            <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">
              <span className="hover:underline cursor-pointer" onClick={() => window.location.assign('/products')}>All</span>
              {activeSpace && (
                <>
                  <span className="mx-2">/</span>
                  <span className="font-medium">{activeSpace.name}</span>
                </>
              )}
              {activeSubcategory && (
                <>
                  <span className="mx-2">/</span>
                  <span className="font-semibold">{activeSubcategory.name}</span>
                </>
              )}
            </div>
          ) : null}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2">Our Products</h1>
          <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
            Browse our collection of high-quality furniture, perfect for homes, offices, 
            and commercial spaces throughout Nigeria.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6 sm:mb-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters
              spaces={spaces}
              totalProducts={filteredProducts.length}
              isAdmin={false}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
        
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

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
