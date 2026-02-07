'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/Toast';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import SizeSelector from './SizeSelector';
import StockBadge from './StockBadge';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const isOutOfStock = product.stock === 0;
  const maxQuantity = Math.min(product.stock, 5);

  function handleAddToCart() {
    if (!selectedSize) {
      showToast('Please select a size', 'error');
      return;
    }

    addItem({
      product_id: product.$id,
      title: product.title,
      image: product.images[0],
      size: selectedSize,
      price: product.price,
      quantity,
    });

    showToast('Added to cart!', 'success');
  }

  function incrementQuantity() {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  }

  function decrementQuantity() {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {/* Images */}
      <div>
        {/* Main Image */}
        <div className="relative aspect-[3/4] mb-4 rounded-card overflow-hidden bg-background-hover">
          <Image
            src={product.images[selectedImage]}
            alt={product.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index
                    ? 'border-primary'
                    : 'border-border hover:border-text-secondary'
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col">
        {/* Badges */}
        <div className="flex gap-2 mb-4">
          <Badge variant="primary">{product.collection}</Badge>
          {product.is_drop && <Badge variant="error">Limited Drop</Badge>}
        </div>

        {/* Title & Price */}
        <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
          {product.title}
        </h1>

        <div className="flex items-center gap-4 mb-6">
          <span className="text-3xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <StockBadge stock={product.stock} />
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-2">
            Description
          </h2>
          <p className="text-text-secondary leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Size Selector */}
        <div className="mb-6">
          <SizeSelector
            sizes={product.sizes}
            selectedSize={selectedSize}
            onSizeSelect={setSelectedSize}
            disabled={isOutOfStock}
          />
        </div>

        {/* Quantity Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-primary mb-3">
            Quantity
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={decrementQuantity}
              disabled={quantity === 1 || isOutOfStock}
              className="w-10 h-10 rounded-lg bg-background-surface border border-border text-text-primary hover:bg-background-hover disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
            >
              −
            </button>
            <span className="text-xl font-semibold text-text-primary w-12 text-center">
              {quantity}
            </span>
            <button
              onClick={incrementQuantity}
              disabled={quantity === maxQuantity || isOutOfStock}
              className="w-10 h-10 rounded-lg bg-background-surface border border-border text-text-primary hover:bg-background-hover disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart */}
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          size="lg"
          fullWidth
        >
          {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
        </Button>

        {/* Product Details */}
        <div className="mt-8 pt-8 border-t border-border space-y-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-semibold text-text-primary">Premium Fabric</p>
              <p className="text-sm text-text-secondary">
                High-quality cotton blend for maximum comfort
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-semibold text-text-primary">
                Fade-Resistant Print
              </p>
              <p className="text-sm text-text-secondary">
                Advanced printing technology for lasting colors
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-semibold text-text-primary">
                Limited Edition
              </p>
              <p className="text-sm text-text-secondary">
                No restocks — once it's gone, it's gone forever
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
