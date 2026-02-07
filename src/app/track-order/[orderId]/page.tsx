'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getOrderById } from '@/lib/appwrite/orders';
import { useRealtime } from '@/hooks/useRealtime';
import { Order, OrderItem } from '@/types/order';
import { formatDate, formatPrice } from '@/lib/utils';
import { PageLoader } from '@/components/ui/Loading';
import Badge from '@/components/ui/Badge';

export default function TrackOrderPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // Subscribe to real-time order updates
  useRealtime(
    'orders',
    orderId,
    (payload) => {
      if (payload.status && order) {
        setOrder({ ...order, status: payload.status });
      }
    }
  );

  async function fetchOrder() {
    try {
      setLoading(true);
      const fetchedOrder = await getOrderById(orderId);
      setOrder(fetchedOrder);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <PageLoader />;
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-4">Order Not Found</h1>
          <p className="text-text-secondary mb-6">
            We couldn't find an order with ID: {orderId}
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const items: OrderItem[] = JSON.parse(order.items);
  const shippingInfo = JSON.parse(order.shipping_info);

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

  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: '📦' },
    { key: 'confirmed', label: 'Confirmed', icon: '✅' },
    { key: 'shipped', label: 'Shipped', icon: '🚚' },
    { key: 'delivered', label: 'Delivered', icon: '🎉' },
  ];

  const currentStepIndex = statusSteps.findIndex((step) => step.key === order.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text-primary mb-2">Track Order</h1>
        <p className="text-text-secondary">
          Order ID: <span className="font-mono">{order.$id}</span>
        </p>
      </div>

      {/* Status Timeline */}
      <div className="bg-background-surface rounded-card border border-border p-6 md:p-8 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-text-primary">Order Status</h2>
          <Badge variant={getStatusVariant(order.status)} size="md">
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>

        {order.status !== 'cancelled' ? (
          <div className="relative">
            {/* Progress Bar */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-border">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{
                  width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Steps */}
            <div className="relative flex justify-between">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 transition-colors ${
                        isCompleted
                          ? 'bg-primary text-white'
                          : 'bg-background-card border-2 border-border'
                      } ${isCurrent ? 'ring-4 ring-primary ring-opacity-20' : ''}`}
                    >
                      {step.icon}
                    </div>
                    <p
                      className={`text-sm font-semibold text-center ${
                        isCompleted ? 'text-text-primary' : 'text-text-muted'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-2xl mb-2">❌</p>
            <p className="text-text-primary font-semibold">This order has been cancelled</p>
          </div>
        )}
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Shipping Information */}
        <div className="bg-background-surface rounded-card border border-border p-6">
          <h3 className="text-xl font-bold text-text-primary mb-4">Shipping Information</h3>
          <div className="space-y-2 text-text-secondary">
            <p>
              <span className="font-semibold text-text-primary">{shippingInfo.fullName}</span>
            </p>
            <p>{shippingInfo.phone}</p>
            <p>{shippingInfo.address}</p>
            <p>
              {shippingInfo.city}, {shippingInfo.postalCode}
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-background-surface rounded-card border border-border p-6">
          <h3 className="text-xl font-bold text-text-primary mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-text-secondary">
              <span>Order Date:</span>
              <span className="font-semibold">{formatDate(order.created_at)}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Items:</span>
              <span className="font-semibold">{items.length} item(s)</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Shipping:</span>
              <span className="font-semibold">FREE</span>
            </div>
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold text-text-primary">
                <span>Total:</span>
                <span>{formatPrice(order.total_amount)}</span>
              </div>
            </div>
            <div className="bg-primary bg-opacity-10 border border-primary rounded-lg p-3 mt-4">
              <p className="text-sm text-primary font-semibold">💵 Cash on Delivery (COD)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-background-surface rounded-card border border-border p-6">
        <h3 className="text-xl font-bold text-text-primary mb-4">Order Items</h3>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
            >
              <div className="flex-1">
                <p className="font-semibold text-text-primary">{item.name}</p>
                <p className="text-sm text-text-muted">
                  Size: {item.size} | Qty: {item.quantity}
                </p>
              </div>
              <p className="font-bold text-text-primary">{formatPrice(item.price)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/account/orders"
          className="px-6 py-3 bg-background-surface border border-border text-text-primary rounded-lg font-bold hover:bg-background-card transition-colors text-center"
        >
          View All Orders
        </Link>
        <Link
          href="/shop"
          className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors text-center"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
