'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useProduct } from '@/hooks/useProducts';
import { useRealtime } from '@/hooks/useRealtime';
import { PRODUCTS_COLLECTION_ID } from '@/lib/appwrite/client';
import ProductDetail from '@/components/product/ProductDetail';
import { PageLoader } from '@/components/ui/Loading';

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;

  const { product, loading, refetch } = useProduct(id);

  // Real-time stock updates
  useRealtime(PRODUCTS_COLLECTION_ID, id, () => {
    refetch();
  });

  if (loading) {
    return <PageLoader />;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl font-bold text-text-primary mb-4">Product Not Found</h1>
        <p className="text-text-secondary mb-8">This product doesn't exist or has been removed.</p>
        <a href="/shop" className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors">
          Back to Shop
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ProductDetail product={product} />
    </div>
  );
}
