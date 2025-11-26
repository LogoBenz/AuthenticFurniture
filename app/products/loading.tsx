import ProductSkeleton from '@/components/ui/ProductSkeleton'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse" />
      
      <div className="flex gap-8">
        {/* Sidebar skeleton */}
        <aside className="w-64 space-y-6">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        </aside>

        {/* Products grid skeleton */}
        <main className="flex-1">
          <ProductSkeleton count={12} />
        </main>
      </div>
    </div>
  )
}
