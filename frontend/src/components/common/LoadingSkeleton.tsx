export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />;
}

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border">
      <LoadingSkeleton className="aspect-square" />
      <div className="p-4 space-y-3">
        <LoadingSkeleton className="h-3 w-1/3" />
        <LoadingSkeleton className="h-4 w-4/5" />
        <LoadingSkeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function ArticleSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border">
      <LoadingSkeleton className="aspect-video" />
      <div className="p-5 space-y-3">
        <LoadingSkeleton className="h-3 w-1/4" />
        <LoadingSkeleton className="h-5 w-full" />
        <LoadingSkeleton className="h-5 w-4/5" />
        <LoadingSkeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <LoadingSkeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
