'use client';

import Image from 'next/image';
import { CartItem } from '@/types/order';
import { ShippingInfo } from '@/types/order';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface ReviewOrderProps {
  items: CartItem[];
  shipping: ShippingInfo;
  total: number;
  onConfirm: () => void;
  onBack: () => void;
  loading?: boolean;
}

export default function ReviewOrder({
  items,
  shipping,
  total,
  onConfirm,
  onBack,
  loading = false,
}: ReviewOrderProps) {
  return (
    <div className="space-y-6">
      {/* Order Items */}
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-4">
          Order Items
        </h2>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={`${item.product_id}-${item.size}-${index}`}
              className="flex gap-4 bg-background-surface rounded-lg p-4 border border-border"
            >
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-background-hover flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary">
                  Size: {item.size} • Qty: {item.quantity}
                </p>
                <p className="font-bold text-primary mt-1">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Information */}
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-4">
          Shipping Information
        </h2>
        <div className="bg-background-surface rounded-lg p-4 border border-border space-y-2">
          <p className="text-text-primary">
            <span className="text-text-secondary">Name:</span> {shipping.name}
          </p>
          <p className="text-text-primary">
            <span className="text-text-secondary">Phone:</span> {shipping.phone}
          </p>
          <p className="text-text-primary">
            <span className="text-text-secondary">Address:</span> {shipping.address}
          </p>
          <p className="text-text-primary">
            <span className="text-text-secondary">City:</span> {shipping.city}
          </p>
          {shipping.notes && (
            <p className="text-text-primary">
              <span className="text-text-secondary">Notes:</span> {shipping.notes}
            </p>
          )}
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-primary bg-opacity-10 border border-primary rounded-lg p-4">
        <h2 className="text-xl font-bold text-text-primary mb-2">
          Payment Method
        </h2>
        <div className="flex items-center gap-2">
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="font-semibold text-text-primary">
            Cash on Delivery (COD)
          </span>
        </div>
        <p className="text-sm text-text-secondary mt-2">
          You will pay when your order is delivered to your doorstep.
        </p>
      </div>

      {/* Total */}
      <div className="bg-background-surface rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between text-2xl font-bold">
          <span className="text-text-primary">Total</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="secondary" size="lg" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          size="lg"
          onClick={onConfirm}
          disabled={loading}
          className="flex-1"
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </Button>
      </div>
    </div>
  );
}
