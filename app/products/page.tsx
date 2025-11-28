import { Suspense } from "react";
import { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { getSpacesForNavigation } from "@/lib/categories";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import Pagination from "@/components/products/Pagination";

// Enable ISR with 3-minute revalidation
export const revalidate = 180;

interface ProductsPageProps {
  searchParams: Promise<{
    space?: string;
    subcategory?: string;
    collection?: string;
    price_min?: string;
    price_max?: string;
    page?: string;
    sort?: string;
  }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const spaceSlug = params?.space;
  const subcategorySlug = params?.subcategory;
  const collection = params?.collection;

  // Fetch spaces to get names for metadata
  const spaces = await getSpacesForNavigation();
  const activeSpace = spaces.find(s => s.slug === spaceSlug);
  const activeSubcategory = activeSpace?.subcategories?.find(sc => sc.slug === subcategorySlug);

  // Generate dynamic title based on filters
  let title = "Products";
  let description = "Browse our collection of high-quality furniture, perfect for homes, offices, and commercial spaces throughout Nigeria.";

  if (collection === 'best-sellers') {
    title = "Best Selling Furniture | Authentic Furniture";
    description = "Shop our most popular furniture items. Top-rated designs for home and office.";
  } else if (activeSubcategory && activeSpace) {
    title = `${activeSubcategory.name} - ${activeSpace.name} | Authentic Furniture`;
    description = `Explore our ${activeSubcategory.name.toLowerCase()} collection for ${activeSpace.name.toLowerCase()}. Quality furniture delivered across Nigeria.`;
  } else if (activeSpace) {
    title = `${activeSpace.name} Furniture | Authentic Furniture`;
    description = `Browse our complete ${activeSpace.name.toLowerCase()} furniture collection. Quality products for homes, offices, and commercial spaces in Nigeria.`;
  } else {
    title = "All Products | Authentic Furniture";
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Await search parameters (Next.js 15)
  const params = await searchParams;

  // Parse search parameters for filters
  const page = params?.page ? parseInt(params.page) : 1;
  const spaceSlug = params?.space;
  const subcategorySlug = params?.subcategory;
  const collection = params?.collection;
  const price_min = params?.price_min ? parseFloat(params.price_min) : undefined;
  const price_max = params?.price_max ? parseFloat(params.price_max) : undefined;
  const sort = params?.sort;

  // Fetch spaces to convert slugs to IDs
  const spaces = await getSpacesForNavigation();

  // Find active space and subcategory for breadcrumb and get their IDs
  let activeSpace = spaces.find(s => s.slug === spaceSlug);
  let activeSubcategory = activeSpace?.subcategories?.find(sc => sc.slug === subcategorySlug);

  // If subcategory is specified but not found (e.g. no space specified), look for it in all spaces
  if (subcategorySlug && !activeSubcategory) {
    for (const s of spaces) {
      const found = s.subcategories?.find(sc => sc.slug === subcategorySlug);
      if (found) {
        activeSubcategory = found;
        // Set activeSpace for breadcrumbs and context, but only if not already set
        if (!activeSpace) {
          activeSpace = s;
        }
        break;
      }
    }
  }

  // Convert slugs to IDs for the database query
  const space = activeSpace?.id;
  const subcategory = activeSubcategory?.id;

  // Fetch data server-side with filters (using IDs)
  const { products, totalCount, totalPages } = await getProducts({
    space,
    subcategory,
    collection,
    price_min,
    price_max,
    sort,
    page,
    limit: 12
  });

  return (
    <div className="pt-14 sm:pt-16 pb-12 sm:pb-16">
      <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          {activeSpace || activeSubcategory ? (
            <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">
              <a href="/products" className="hover:underline cursor-pointer">All</a>
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
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
            {collection === 'best-sellers' ? 'Best Sellers' : 'Our Products'}
          </h1>
        </div>

        <div className="space-y-6 mb-8">
          {/* Filters Topbar */}
          <ProductFilters
            spaces={spaces}
            totalProducts={totalCount}
            isAdmin={false}
          />

          {/* Products Grid */}
          <Suspense fallback={<ProductSkeleton count={12} />}>
            <ProductGrid products={products} variant="detailed" />
          </Suspense>
        </div>

        {/* Results Summary */}
        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-muted-foreground">
          Showing {products.length} of {totalCount} products
          {activeSpace && ` in ${activeSpace.name}`}
          {activeSubcategory && ` - ${activeSubcategory.name}`}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/products"
            searchParams={params || {}}
          />
        )}
      </div>
    </div>
  );
}
