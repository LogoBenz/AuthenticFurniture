export function GallerySkeleton() {
  return (
    <div className="space-y-3">
      {/* Main image skeleton */}
      <div className="relative aspect-[8/5] bg-gray-200 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
      </div>
      
      {/* Thumbnail skeletons */}
      <div className="flex justify-center gap-2 mt-3">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="relative w-20 h-16 bg-gray-200 rounded-lg overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
