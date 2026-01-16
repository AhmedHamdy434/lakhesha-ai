import BgGradient from "@/components/common/bg-gradient";

export default function DashboardPageSkeleton() {
  return (
    <main className="min-h-screen">
      <BgGradient className="from-emerald-200 via-teal-200 to-cyan-200" />

      <div className="container mx-auto flex flex-col gap-4">
        <div className="px-2 py-12 sm:py-24">
          {/* Header */}
          <div className="flex justify-between gap-4 mb-8">
            <div className="flex flex-col gap-3 w-full max-w-md">
              <SkeletonBox className="h-10 w-64 rounded-xl" />
              <SkeletonBox className="h-4 w-full rounded-lg" />
            </div>

            {/* New Summary Button */}
            <SkeletonBox className="h-10 w-40 rounded-xl" />
          </div>

          {/* Alert Skeleton (optional – limit reached) */}
          <SkeletonBox className="h-16 w-full rounded-xl mb-6" />

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonSummaryCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}


function SkeletonBox({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-muted ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer
        bg-linear-to-r from-transparent via-white/10 to-transparent"
      />
    </div>
  );
}
function SkeletonSummaryCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-background p-4 space-y-4">
      <SkeletonBox className="h-6 w-3/4 rounded-lg" />
      <SkeletonBox className="h-4 w-full rounded-md" />
      <SkeletonBox className="h-4 w-5/6 rounded-md" />

      <div className="flex justify-between items-center pt-4">
        <SkeletonBox className="h-4 w-20 rounded-md" />
        <SkeletonBox className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}
