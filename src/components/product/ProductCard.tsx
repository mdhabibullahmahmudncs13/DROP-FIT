import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <Link
      href={`/product/${product.$id}`}
      className="group block bg-background-surface rounded-card border border-border overflow-hidden hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-background-hover">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge variant="primary" size="sm">
            {product.collection}
          </Badge>
          {product.is_drop && (
            <Badge variant="error" size="sm">
              Limited
            </Badge>
          )}
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <Badge variant="error" size="md">
              Sold Out
            </Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          
          {isLowStock && !isOutOfStock && (
            <Badge variant="warning" size="sm">
              Only {product.stock} left
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
