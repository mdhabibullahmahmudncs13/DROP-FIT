'use client';

import Image from 'next/image';
import { CartItem as CartItemType } from '@/types/order';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  function handleIncrement() {
    updateQuantity(item.product_id, item.size, item.quantity + 1);
  }

  function handleDecrement() {
    if (item.quantity === 1) {
      removeItem(item.product_id, item.size);
    } else {
      updateQuantity(item.product_id, item.size, item.quantity - 1);
    }
  }

  function handleRemove() {
    removeItem(item.product_id, item.size);
  }

  return (
    <div className="flex gap-4 bg-background-card rounded-lg p-3">
      {/* Image */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-background-hover">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-text-primary text-sm mb-1 truncate">
          {item.title}
        </h3>
        <p className="text-xs text-text-secondary mb-2">Size: {item.size}</p>
        
        <div className="flex items-center justify-between">
          <span className="font-bold text-primary">
            {formatPrice(item.price)}
          </span>
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrement}
              className="w-6 h-6 rounded bg-background-surface border border-border text-text-primary hover:bg-background-hover text-sm font-bold"
            >
              −
            </button>
            <span className="text-sm font-semibold text-text-primary w-6 text-center">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="w-6 h-6 rounded bg-background-surface border border-border text-text-primary hover:bg-background-hover text-sm font-bold"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="text-text-muted hover:text-error transition-colors"
        aria-label="Remove item"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}
