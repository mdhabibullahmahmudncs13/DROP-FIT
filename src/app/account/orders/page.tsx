'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getUserOrders } from '@/lib/appwrite/orders';
import { Order, OrderItem } from '@/types/order';
import { formatDate, formatPrice } from '@/lib/utils';
import { PageLoader } from '@/components/ui/Loading';
import Badge from '@/components/ui/Badge';

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth/login?redirect=/account/orders');
      } else {
        fetchOrders();
      }
    }
  }, [authLoading, user, router]);

  async function fetchOrders() {
    if (!user) return;

    try {
      setLoading(true);
      const fetchedOrders = await getUserOrders(user.$id);
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || loading || !user) {
    return <PageLoader />;
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'primary';
      case 'confirmed':
        return 'primary';
      case 'cancelled':
        return 'error';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/account" className="text-primary hover:underline mb-4 inline-block">
          ← Back to Account
        </Link>
        <h1 className="text-4xl font-bold text-text-primary">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-background-surface rounded-card border border-border">
          <svg
            className="mx-auto h-16 w-16 text-text-muted mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-text-primary mb-2">No orders yet</h2>
          <p className="text-text-secondary mb-6">
            When you place an order, it will appear here
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const items: OrderItem[] = JSON.parse(order.items);
            return (
              <div
                key={order.$id}
                className="bg-background-surface rounded-card border border-border p-6 hover:shadow-card-hover transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <p className="text-sm text-text-muted mb-1">Order ID</p>
                    <p className="font-mono text-text-primary font-semibold">
                      {order.$id}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Badge variant={getStatusVariant(order.status)} size="md">
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-text-muted mb-1">Date</p>
                    <p className="text-text-primary">{formatDate(order.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted mb-1">Total</p>
                    <p className="text-text-primary font-bold">
                      {formatPrice(order.total_amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted mb-1">Items</p>
                    <p className="text-text-primary">{items.length} item(s)</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <Link
                    href={`/track-order/${order.$id}`}
                    className="text-primary hover:underline font-semibold"
                  >
                    View Details & Track Order →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
