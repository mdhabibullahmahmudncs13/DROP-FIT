'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useDeliverySettings } from '@/hooks/useDeliverySettings';
import { formatPrice, calculateDeliveryCharge } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface CartSummaryProps {
  onCheckoutClick?: () => void;
}

export default function CartSummary({ onCheckoutClick }: CartSummaryProps) {
  const { items, total } = useCart();
  const { settings } = useDeliverySettings();
  const estimatedDelivery = calculateDeliveryCharge(total, undefined, settings);
  const freeDeliveryThreshold = settings.freeDeliveryThreshold;

  return (
    <div className="space-y-4">
      {/* Subtotal */}
      <div className="flex items-center justify-between text-text-secondary">
        <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
        <span>{formatPrice(total)}</span>
      </div>

      {/* Delivery Estimate */}
      <div className="flex items-center justify-between text-sm text-text-muted">
        <span>Estimated Delivery</span>
        <span>
          {estimatedDelivery === 0 ? (
            <span className="text-success font-medium">FREE</span>
          ) : (
            <>{formatPrice(estimatedDelivery)}</>
          )}
        </span>
      </div>

      {/* Free Delivery Notice */}
      {total < freeDeliveryThreshold && (
        <div className="bg-primary bg-opacity-10 border border-primary rounded-lg p-2">
          <p className="text-xs text-primary font-medium text-center">
            Add {formatPrice(freeDeliveryThreshold - total)} more for FREE delivery! 🚚
          </p>
        </div>
      )}

      {total >= freeDeliveryThreshold && (
        <div className="bg-success bg-opacity-10 border border-success rounded-lg p-2">
          <p className="text-xs text-success font-medium text-center">
            🎉 You've earned FREE delivery!
          </p>
        </div>
      )}

      {/* Total */}
      <div className="flex items-center justify-between text-xl font-bold border-t border-border pt-3">
        <span className="text-text-primary">Estimated Total</span>
        <span className="text-primary">{formatPrice(total + estimatedDelivery)}</span>
      </div>

      {/* Checkout Button */}
      <Link href="/checkout" onClick={onCheckoutClick}>
        <Button size="lg" fullWidth>
          Proceed to Checkout
        </Button>
      </Link>

      <p className="text-xs text-text-muted text-center">
        💵 Cash on Delivery (COD) — Pay when you receive your order
      </p>
    </div>
  );
}
