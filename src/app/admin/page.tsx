'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { getAllProducts } from '@/lib/appwrite/products';
import { databases, DATABASE_ID, ORDERS_COLLECTION_ID, USERS_COLLECTION_ID } from '@/lib/appwrite/client';
import { Product } from '@/types/product';
import { formatPrice, formatDate } from '@/lib/utils';
import { PageLoader } from '@/components/ui/Loading';
import { Query } from 'appwrite';
import { useCache } from '@/hooks/useAdminUtils';
import { useAdminToast } from '@/app/admin/layout';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  totalUsers: number;
  recentOrders: any[];
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    recentOrders: [],
  });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const cache = useCache<{ stats: DashboardStats; products: Product[] }>('dashboard-data');
  const toast = useAdminToast();

  const fetchDashboardData = useCallback(async (useLoading = true) => {
    try {
      if (useLoading) setLoading(true);
      else setRefreshing(true);

      // Check cache first
      const cachedData = cache.get();
      if (cachedData && useLoading) {
        setStats(cachedData.stats);
        setRecentProducts(cachedData.products);
        setLoading(false);
      }

      const [products, ordersResponse, usersResponse] = await Promise.all([
        getAllProducts(),
        databases.listDocuments(
          DATABASE_ID,
          ORDERS_COLLECTION_ID,
          [Query.orderDesc('$createdAt'), Query.limit(100)]
        ),
        databases.listDocuments(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          [Query.limit(1)]
        ),
      ]);

      const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5);
      const outOfStock = products.filter(p => p.stock === 0);
      const pendingOrders = ordersResponse.documents.filter((order: any) => order.status === 'pending');
      const confirmedOrders = ordersResponse.documents.filter((order: any) => order.status === 'confirmed');
      const shippedOrders = ordersResponse.documents.filter((order: any) => order.status === 'shipped');
      const deliveredOrders = ordersResponse.documents.filter((order: any) => order.status === 'delivered');

      // Calculate total revenue
      const totalRevenue = ordersResponse.documents.reduce(
        (sum: number, order: any) => sum + (order.total_amount || 0),
        0
      );

      const newStats: DashboardStats = {
        totalProducts: products.length,
        lowStockProducts: lowStock.length,
        outOfStockProducts: outOfStock.length,
        totalOrders: ordersResponse.total,
        pendingOrders: pendingOrders.length,
        confirmedOrders: confirmedOrders.length,
        shippedOrders: shippedOrders.length,
        deliveredOrders: deliveredOrders.length,
        totalRevenue,
        totalUsers: usersResponse.total,
        recentOrders: ordersResponse.documents.slice(0, 5),
      };

      const recentProds = products.slice(0, 5);

      setStats(newStats);
      setRecentProducts(recentProds);
      cache.set({ stats: newStats, products: recentProds });

      if (!useLoading) {
        toast.success('Dashboard refreshed successfully');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [cache, toast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    cache.clear();
    fetchDashboardData(false);
  };

  const orderStatusBreakdown = useMemo(() => [
    { label: 'Pending', count: stats.pendingOrders, color: 'text-yellow-500' },
    { label: 'Confirmed', count: stats.confirmedOrders, color: 'text-blue-500' },
    { label: 'Shipped', count: stats.shippedOrders, color: 'text-purple-500' },
    { label: 'Delivered', count: stats.deliveredOrders, color: 'text-green-500' },
  ], [stats]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-text-primary mb-2">Dashboard Overview</h2>
          <p className="text-text-secondary">Monitor your store performance and manage operations</p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing} variant="secondary">
          <svg className={`w-5 h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-background-surface rounded-card border border-border p-6 hover:shadow-card-hover transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-success bg-opacity-10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-text-primary mb-1">{formatPrice(stats.totalRevenue)}</h3>
          <p className="text-text-secondary text-sm">Total Revenue</p>
          <div className="mt-3 text-xs text-success font-medium">From {stats.totalOrders} orders</div>
        </div>

        <Link
          href="/admin/orders"
          className="bg-background-surface rounded-card border border-border p-6 hover:shadow-card-hover transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center group-hover:bg-opacity-20 transition-colors">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-text-primary mb-1">{stats.totalOrders}</h3>
          <p className="text-text-secondary text-sm">Total Orders</p>
          {stats.pendingOrders > 0 && (
            <div className="mt-3 inline-flex items-center gap-1 text-xs bg-yellow-500 bg-opacity-10 text-yellow-600 px-2 py-1 rounded font-medium">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {stats.pendingOrders} pending
            </div>
          )}
        </Link>

        <Link
          href="/admin/products"
          className="bg-background-surface rounded-card border border-border p-6 hover:shadow-card-hover transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center group-hover:bg-opacity-20 transition-colors">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-text-primary mb-1">{stats.totalProducts}</h3>
          <p className="text-text-secondary text-sm">Total Products</p>
          {stats.lowStockProducts > 0 && (
            <div className="mt-3 inline-flex items-center gap-1 text-xs bg-warning bg-opacity-10 text-warning px-2 py-1 rounded font-medium">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {stats.lowStockProducts} low stock
            </div>
          )}
        </Link>

        <Link
          href="/admin/users"
          className="bg-background-surface rounded-card border border-border p-6 hover:shadow-card-hover transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center group-hover:bg-opacity-20 transition-colors">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-text-primary mb-1">{stats.totalUsers}</h3>
          <p className="text-text-secondary text-sm">Total Users</p>
        </Link>
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-background-surface rounded-card border border-border p-6 mb-8">
        <h3 className="text-lg font-bold text-text-primary mb-4">Order Status Breakdown</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {orderStatusBreakdown.map(({ label, count, color }) => (
            <div key={label} className="text-center p-4 bg-background-hover rounded-lg">
              <div className={`text-2xl font-bold ${color} mb-1`}>{count}</div>
              <div className="text-xs text-text-muted">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory Alerts */}
      {(stats.lowStockProducts > 0 || stats.outOfStockProducts > 0) && (
        <div className="bg-background-surface rounded-card border border-warning p-6 mb-8">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-warning flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-text-primary mb-2">Inventory Alerts</h3>
              <div className="space-y-1 text-text-secondary">
                {stats.outOfStockProducts > 0 && (
                  <p className="text-error font-medium">
                    ⚠️ {stats.outOfStockProducts} product{stats.outOfStockProducts > 1 ? 's' : ''} out of stock
                  </p>
                )}
                {stats.lowStockProducts > 0 && (
                  <p className="text-warning font-medium">
                    ⚠️ {stats.lowStockProducts} product{stats.lowStockProducts > 1 ? 's' : ''} low on stock (≤5 units)
                  </p>
                )}
              </div>
              <Link href="/admin/products" className="text-primary hover:underline text-sm font-medium mt-2 inline-block">
                Manage Inventory →
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Orders */}
        <div className="bg-background-surface rounded-card border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-text-primary">Recent Orders</h3>
            <Link href="/admin/orders" className="text-primary hover:underline text-sm font-medium">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {stats.recentOrders.length === 0 ? (
              <p className="text-text-secondary text-center py-4">No orders yet</p>
            ) : (
              stats.recentOrders.map((order: any) => (
                <div key={order.$id} className="flex items-center justify-between p-3 bg-background-hover rounded-lg hover:bg-background-card transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-text-primary text-sm">Order #{order.$id.slice(-8)}</div>
                    <div className="text-xs text-text-muted mt-1 truncate">{order.shipping_name || 'Unknown Customer'}</div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <div className="font-bold text-primary text-sm">{formatPrice(order.total_amount)}</div>
                    <Badge 
                      variant={
                        order.status === 'delivered' ? 'success' :
                        order.status === 'shipped' ? 'primary' :
                        order.status === 'confirmed' ? 'primary' :
                        'warning'
                      }
                      size="sm"
                      className="mt-1"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-background-surface rounded-card border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-text-primary">Recent Products</h3>
            <Link href="/admin/products" className="text-primary hover:underline text-sm font-medium">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {recentProducts.length === 0 ? (
              <p className="text-text-secondary text-center py-4">No products yet</p>
            ) : (
              recentProducts.map((product) => (
                <div key={product.$id} className="flex items-center gap-3 p-3 bg-background-hover rounded-lg">
                  {product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-text-primary text-sm truncate">{product.title}</div>
                    <div className="text-xs text-text-muted mt-1">{product.collection}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-primary text-sm">{formatPrice(product.price)}</div>
                    <div className={`text-xs mt-1 font-medium ${
                      product.stock === 0 ? 'text-error' :
                      product.stock <= 5 ? 'text-warning' : 'text-success'
                    }`}>
                      {product.stock} in stock
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-background-surface rounded-card border border-border p-6">
        <h3 className="text-xl font-bold text-text-primary mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/products"
            className="flex items-center gap-4 p-4 bg-background-hover rounded-lg hover:bg-background-card transition-colors"
          >
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-text-primary">Add Product</div>
              <div className="text-sm text-text-secondary">Create new listing</div>
            </div>
          </Link>

          <Link
            href="/admin/drops"
            className="flex items-center gap-4 p-4 bg-background-hover rounded-lg hover:bg-background-card transition-colors"
          >
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-text-primary">Manage Drops</div>
              <div className="text-sm text-text-secondary">Launch limited releases</div>
            </div>
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center gap-4 p-4 bg-background-hover rounded-lg hover:bg-background-card transition-colors"
          >
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-text-primary">Process Orders</div>
              <div className="text-sm text-text-secondary">View pending orders</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
