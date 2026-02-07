'use client';

import { useState, useEffect } from 'react';
import { getAllProducts, getProductsByCollection, getProductById } from '@/lib/appwrite/products';
import { Product, Collection, ProductFilters } from '@/types/product';

export function useProducts(filters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [filters?.collection]);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError(null);

      let fetchedProducts: Product[];

      if (filters?.collection && filters.collection !== 'all') {
        fetchedProducts = await getProductsByCollection(filters.collection);
      } else {
        fetchedProducts = await getAllProducts();
      }

      // Apply client-side filters
      let filtered = fetchedProducts;

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(
          (product) =>
            product.title.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower)
        );
      }

      if (filters?.size) {
        filtered = filtered.filter((product) => product.sizes.includes(filters.size!));
      }

      // Apply sorting
      if (filters?.priceSort) {
        filtered = [...filtered].sort((a, b) => {
          if (filters.priceSort === 'asc') {
            return a.price - b.price;
          }
          return b.price - a.price;
        });
      }

      setProducts(filtered);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }

  return { products, loading, error, refetch: fetchProducts };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  async function fetchProduct() {
    try {
      setLoading(true);
      setError(null);
      const fetchedProduct = await getProductById(id);
      setProduct(fetchedProduct);
    } catch (err) {
      setError('Failed to load product');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  }

  return { product, loading, error, refetch: fetchProduct };
}
