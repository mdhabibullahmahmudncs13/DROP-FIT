'use client';

import { useEffect, useState, useMemo } from 'react';
import { getAllProducts, deleteProduct } from '@/lib/appwrite/products';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/utils';
import { PageLoader } from '@/components/ui/Loading';
import Badge from '@/components/ui/Badge';
import ProductForm, { ProductFormData } from '@/components/admin/ProductForm';
import { createProduct, updateProduct } from '@/lib/appwrite/products';
import Button from '@/components/ui/Button';
import { useDebounce } from '@/hooks/useAdminUtils';
import { useAdminToast } from '@/app/admin/layout';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'anime' | 'series' | 'minimal'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const toast = useAdminToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  const handleCreateProduct = async (data: ProductFormData) => {
    try {
      await createProduct(data);
      await fetchProducts();
      setShowForm(false);
      toast.success('Product created successfully!');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Error creating product. Please try again.');
    }
  };

  const handleUpdateProduct = async (data: ProductFormData) => {
    if (!editingProduct) return;
    try {
      await updateProduct(editingProduct.$id, data);
      await fetchProducts();
      setEditingProduct(null);
      setShowForm(false);
      toast.success('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error updating product. Please try again.');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      setDeletingId(productId);
      await deleteProduct(productId);
      await fetchProducts();
      toast.success('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesFilter = filter === 'all' || p.collection === filter;
      const matchesSearch = debouncedSearch === '' || 
        p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [products, filter, debouncedSearch]);

  const stockStats = {
    total: products.length,
    inStock: products.filter(p => p.stock > 5).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= 5).length,
    outOfStock: products.filter(p => p.stock === 0).length,
  };

  if (loading) {
    return <PageLoader />;
  }

  if (showForm) {
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text-primary mb-2">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <p className="text-text-secondary">
            {editingProduct ? 'Update product information' : 'Create a new product in your catalog'}
          </p>
        </div>

        <div className="bg-background-surface rounded-card border border-border p-6">
          <ProductForm
            product={editingProduct || undefined}
            onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
            onCancel={handleCancelForm}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-text-primary mb-2">Products Management</h2>
          <p className="text-text-secondary">Manage your product catalog</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          + Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-background-surface rounded-card border border-border p-4">
          <div className="text-2xl font-bold text-text-primary">{stockStats.total}</div>
          <div className="text-sm text-text-secondary">Total Products</div>
        </div>
        <div className="bg-background-surface rounded-card border border-border p-4">
          <div className="text-2xl font-bold text-success">{stockStats.inStock}</div>
          <div className="text-sm text-text-secondary">In Stock</div>
        </div>
        <div className="bg-background-surface rounded-card border border-border p-4">
          <div className="text-2xl font-bold text-warning">{stockStats.lowStock}</div>
          <div className="text-sm text-text-secondary">Low Stock</div>
        </div>
        <div className="bg-background-surface rounded-card border border-border p-4">
          <div className="text-2xl font-bold text-error">{stockStats.outOfStock}</div>
          <div className="text-sm text-text-secondary">Out of Stock</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-background-surface rounded-card border border-border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-background-card border border-border rounded-lg focus:outline-none focus:border-primary text-text-primary"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'anime', 'series', 'minimal'].map((col) => (
              <button
                key={col}
                onClick={() => setFilter(col as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === col
                    ? 'bg-primary text-white'
                    : 'bg-background-hover text-text-secondary hover:bg-background-card'
                }`}
              >
                {col.charAt(0).toUpperCase() + col.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-background-surface rounded-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-hover">
              <tr>
                <th className="text-left py-4 px-6 text-text-secondary font-semibold">Product</th>
                <th className="text-left py-4 px-6 text-text-secondary font-semibold">Collection</th>
                <th className="text-left py-4 px-6 text-text-secondary font-semibold">Price</th>
                <th className="text-left py-4 px-6 text-text-secondary font-semibold">Stock</th>
                <th className="text-left py-4 px-6 text-text-secondary font-semibold">Status</th>
                <th className="text-left py-4 px-6 text-text-secondary font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.$id} className="border-t border-border hover:bg-background-hover">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <div className="font-medium text-text-primary">{product.title}</div>
                        <div className="text-xs text-text-muted">{product.sizes.join(', ')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="neutral" size="sm">
                      {product.collection}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-primary font-bold">
                    {formatPrice(product.price)}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`font-semibold ${
                        product.stock === 0
                          ? 'text-error'
                          : product.stock <= 5
                          ? 'text-warning'
                          : 'text-success'
                      }`}
                    >
                      {product.stock} units
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {product.is_drop && (
                      <Badge variant="error" size="sm">
                        Drop
                      </Badge>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        Edit
                      </button>
                      <span className="text-text-muted">|</span>
                      <button
                        onClick={() => handleDeleteProduct(product.$id)}
                        disabled={deletingId === product.$id}
                        className="text-error hover:underline text-sm font-medium disabled:opacity-50"
                      >
                        {deletingId === product.$id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-background-surface rounded-card border border-border mt-6">
          <p className="text-text-secondary">
            {searchQuery ? 'No products found matching your search.' : 'No products in this collection.'}
          </p>
        </div>
      )}
    </div>
  );
}
