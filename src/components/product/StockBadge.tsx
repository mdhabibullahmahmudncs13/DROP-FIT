import { getStockStatus } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

interface StockBadgeProps {
  stock: number;
}

export default function StockBadge({ stock }: StockBadgeProps) {
  const { status, message, color } = getStockStatus(stock);

  const variantMap = {
    'out-of-stock': 'error' as const,
    'low-stock': 'warning' as const,
    'in-stock': 'success' as const,
  };

  return (
    <Badge variant={variantMap[status]} size="md">
      {message}
    </Badge>
  );
}
