'use client';

import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Collection } from '@/types/product';
import ProductGrid from '@/components/product/ProductGrid';
import { ProductGridSkeleton } from '@/components/ui/Loading';
import Input from '@/components/ui/Input';

export default function ShopPage() {
  const [collection, setCollection] = useState<Collection | 'all'>('all');
  const [priceSort, setPriceSort] = useState<'asc' | 'desc' | undefined>();
  const [search, setSearch] = useState('');

  const { products, loading } = useProducts({ collection, priceSort, search });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-text-primary mb-8">Shop All</h1>

      {/* Filters */}
      <div className="bg-background-surface rounded-card border border-border p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Collection Filter */}
          <select
            value={collection}
            onChange={(e) => setCollection(e.target.value as Collection | 'all')}
            className="px-4 py-3 bg-background-surface text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Collections</option>
            <option value="anime">Anime</option>
            <option value="series">Series</option>
            <option value="minimal">Minimal</option>
          </select>

          {/* Price Sort */}
          <select
            value={priceSort || ''}
            onChange={(e) => setPriceSort(e.target.value as 'asc' | 'desc' | undefined)}
            className="px-4 py-3 bg-background-surface text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Sort by Price</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products */}
      {loading ? (
        <ProductGridSkeleton count={9} />
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
