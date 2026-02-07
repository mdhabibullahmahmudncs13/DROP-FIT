'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface CartSummaryProps {
  onCheckoutClick?: () => void;
}

export default function CartSummary({ onCheckoutClick }: CartSummaryProps) {
  const { items, total } = useCart();

  return (
    <div className="space-y-4">
      {/* Subtotal */}
      <div className="flex items-center justify-between text-text-secondary">
        <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
        <span>{formatPrice(total)}</span>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between text-xl font-bold">
        <span className="text-text-primary">Total</span>
        <span className="text-primary">{formatPrice(total)}</span>
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
