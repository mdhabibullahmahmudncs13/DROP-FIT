'use client';

import { cn } from '@/lib/utils';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string | null;
  onSizeSelect: (size: string) => void;
  disabled?: boolean;
}

export default function SizeSelector({
  sizes,
  selectedSize,
  onSizeSelect,
  disabled = false,
}: SizeSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-3">
        Select Size
      </label>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeSelect(size)}
            disabled={disabled}
            className={cn(
              'px-6 py-3 rounded-lg border-2 font-semibold transition-all',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              selectedSize === size
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-background-surface text-text-primary hover:border-primary'
            )}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
