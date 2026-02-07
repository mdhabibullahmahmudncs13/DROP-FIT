export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-4 border-background-hover border-t-primary`}
      />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-background-surface rounded-card border border-border overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-background-hover" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-background-hover rounded w-3/4" />
        <div className="h-4 bg-background-hover rounded w-1/2" />
        <div className="h-6 bg-background-hover rounded w-1/3" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-text-secondary">Loading...</p>
      </div>
    </div>
  );
}
