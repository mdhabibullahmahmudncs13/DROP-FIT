'use client';

import { useDrops } from '@/hooks/useDrops';
import { useProducts } from '@/hooks/useProducts';
import { PageLoader } from '@/components/ui/Loading';
import DropCard from '@/components/drops/DropCard';
import NotifyForm from '@/components/notify/NotifyForm';
import ProductGrid from '@/components/product/ProductGrid';

export default function DropsPage() {
  const { drops: activeDrops, loading: activeLoading } = useDrops('active');
  const { drops: upcomingDrops, loading: upcomingLoading } = useDrops('upcoming');
  const { products: dropProducts, loading: productsLoading } = useProducts();

  const dropProductsList = dropProducts.filter((p) => p.is_drop);

  if (activeLoading || upcomingLoading) {
    return <PageLoader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4">
          Limited Drops. No Restocks.
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Each Drop Fit release is exclusive. Once it's gone, it's gone forever. 
          Don't miss your chance to own a piece of limited-edition streetwear.
        </p>
      </div>

      {/* Active Drops */}
      {activeDrops.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-text-primary mb-6">
            🔥 Active Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {activeDrops.map((drop) => (
              <DropCard key={drop.$id} drop={drop} />
            ))}
          </div>
          {!productsLoading && dropProductsList.length > 0 && (
            <ProductGrid products={dropProductsList} />
          )}
        </section>
      )}

      {/* Upcoming Drops */}
      {upcomingDrops.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-text-primary mb-6">
            Upcoming Drops
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingDrops.map((drop) => (
              <DropCard key={drop.$id} drop={drop} />
            ))}
          </div>
        </section>
      )}

      {/* Notify Me Form */}
      <section>
        <NotifyForm />
      </section>
    </div>
  );
}
