import { GallerySkeleton } from '@/components/products/GallerySkeleton';
import { ProductInfoSkeleton } from '@/components/products/ProductInfoSkeleton';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 max-w-7xl pt-6">
      {/* Breadcrumb skeleton */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-12 bg-gray-200 rounded overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
          </div>
          <div className="h-4 w-4 bg-gray-200 rounded overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
          </div>
          <div className="h-4 w-20 bg-gray-200 rounded overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
          </div>
          <div className="h-4 w-4 bg-gray-200 rounded overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
          </div>
          <div className="h-4 w-32 bg-gray-200 rounded overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 lg:gap-10">
        {/* Gallery skeleton */}
        <GallerySkeleton />
        
        {/* Product info skeleton */}
        <ProductInfoSkeleton />
      </div>

      {/* Tabs skeleton */}
      <div className="mt-12">
        <div className="flex gap-4 border-b border-gray-200 mb-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-10 w-32 bg-gray-200 rounded-t overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-200 rounded overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
          </div>
          <div className="h-4 w-5/6 bg-gray-200 rounded overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
          </div>
          <div className="h-4 w-4/5 bg-gray-200 rounded overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Related products skeleton */}
      <div className="mt-16">
        <div className="h-8 w-48 bg-gray-200 rounded overflow-hidden relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
              </div>
              <div className="h-4 w-3/4 bg-gray-200 rounded overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
              </div>
              <div className="h-4 w-1/2 bg-gray-200 rounded overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
