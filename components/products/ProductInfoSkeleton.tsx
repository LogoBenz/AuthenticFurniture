export function ProductInfoSkeleton() {
  return (
    <div className="space-y-6">
      {/* Badges skeleton */}
      <div className="flex gap-2">
        <div className="h-6 w-24 bg-gray-200 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
        </div>
        <div className="h-6 w-32 bg-gray-200 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
        </div>
      </div>

      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-3/4 bg-gray-200 rounded overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
        </div>
        <div className="h-8 w-1/2 bg-gray-200 rounded overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
        </div>
      </div>

      {/* Model number skeleton */}
      <div className="h-6 w-32 bg-gray-200 rounded overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200" />

      {/* Price skeleton */}
      <div className="h-8 w-40 bg-gray-200 rounded overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
      </div>

      {/* Description skeleton */}
      <div className="space-y-2">
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

      {/* Quantity label skeleton */}
      <div className="h-4 w-20 bg-gray-200 rounded overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
      </div>

      {/* Quantity and action buttons skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Quantity selector skeleton */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded-lg overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
          </div>
          <div className="w-12 h-8 bg-gray-200 rounded overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded-lg overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex gap-2 flex-1 w-full sm:w-auto">
          <div className="h-10 flex-1 bg-gray-200 rounded-lg overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
          </div>
          <div className="h-10 flex-1 bg-gray-200 rounded-lg overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Wishlist button skeleton */}
      <div className="h-10 w-full bg-gray-200 rounded-lg overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
      </div>

      {/* Features section skeleton */}
      <div className="bg-gray-100 rounded-lg p-4 sm:p-6 space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-7 h-7 bg-gray-200 rounded overflow-hidden relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="h-4 w-32 bg-gray-200 rounded overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
              </div>
              <div className="h-3 w-48 bg-gray-200 rounded overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment methods section skeleton */}
      <div className="bg-gray-100 rounded-lg p-4 sm:p-6 space-y-4">
        <div className="h-5 w-40 bg-gray-200 rounded overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-7 h-7 bg-gray-200 rounded overflow-hidden relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
              </div>
              <div className="h-4 w-24 bg-gray-200 rounded overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social share skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-200 rounded overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
        </div>
        <div className="flex gap-2">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
