export const LoadingSkeleton = () => {
    return (
 <div
      className="relative px-2 h-125 sm:h-150 lg:h-175 w-full xl:w-150 overflow-hidden
      bg-linear-to-br from-background via-background/95 to-rose-500/5 backdrop-blur-lg shadow-2xl rounded-3xl
      border border-rose-500/10"
    >
      {/* Progress Bar Skeleton */}
      <div className="absolute top-0 left-0 w-full h-1 bg-muted overflow-hidden">
        <div className="relative h-full w-1/3 bg-muted">
          <Shimmer />
        </div>
      </div>

      <div className="h-full overflow-y-auto pt-12 sm:pt-16 pb-20 sm:pb-24">
        <div className="px-4 sm:px-6">
          {/* Title */}
          <div className="sticky top-0 pt-2 pb-4 bg-background/80 backdrop-blur-xs z-10 flex justify-center">
            <SkeletonBox className="h-10 lg:h-12 w-3/4 rounded-xl" />
          </div>

          {/* Content */}
          <div className="mt-6 space-y-4">
            {[...Array(6)].map((_, i) => (
              <SkeletonBox key={i} className="h-4 w-full rounded-lg" />
            ))}
            <SkeletonBox className="h-4 w-5/6 rounded-lg" />
            <SkeletonBox className="h-4 w-2/3 rounded-lg" />
          </div>
        </div>

        {/* Navigation */}
        <div className="absolute bottom-4 left-0 w-full px-4 flex items-center justify-between gap-4">
          <SkeletonBox className="h-10 w-24 rounded-xl" />

          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <SkeletonBox key={i} className="h-3 w-3 rounded-full" />
            ))}
          </div>

          <SkeletonBox className="h-10 w-24 rounded-xl" />
        </div>
      </div>
    </div>
    );
};



function SkeletonBox({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-muted ${className}`}>
      <Shimmer />
    </div>
  );
}

function Shimmer() {
  return (
    <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer
      bg-linear-to-r from-transparent via-white/10 to-transparent"
    />
  );
}
