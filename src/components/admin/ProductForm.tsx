'use client';

import { useState, FormEvent } from 'react';
import { Product, Collection } from '@/types/product';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
}

export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  collection: Collection;
  images: string[];
  sizes: string[];
  stock: number;
  is_drop: boolean;
  drop_id?: string;
}

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    title: product?.title || '',
    description: product?.description || '',
    price: product?.price || 0,
    collection: product?.collection || 'anime',
    images: product?.images || [],
    sizes: product?.sizes || [],
    stock: product?.stock || 0,
    is_drop: product?.is_drop || false,
    drop_id: product?.drop_id || '',
  });
  const [imageInput, setImageInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setFormData({ ...formData, images: [...formData.images, imageInput.trim()] });
      setImageInput('');
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const addSize = () => {
    if (sizeInput.trim() && !formData.sizes.includes(sizeInput.trim().toUpperCase())) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, sizeInput.trim().toUpperCase()],
      });
      setSizeInput('');
    }
  };

  const removeSize = (size: string) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter(s => s !== size),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-2">
          Product Title *
        </label>
        <Input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter product title"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter product description"
          className="w-full px-4 py-3 bg-background-card border border-border rounded-lg focus:outline-none focus:border-primary text-text-primary resize-none"
          rows={4}
          required
        />
      </div>

      {/* Price and Stock */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Price (₹) *
          </label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            placeholder="0"
            min="0"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Stock *
          </label>
          <Input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
            placeholder="0"
            min="0"
            required
          />
        </div>
      </div>

      {/* Collection */}
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-2">
          Collection *
        </label>
        <select
          value={formData.collection}
          onChange={(e) => setFormData({ ...formData, collection: e.target.value as Collection })}
          className="w-full px-4 py-3 bg-background-card border border-border rounded-lg focus:outline-none focus:border-primary text-text-primary"
          required
        >
          <option value="anime">Anime</option>
          <option value="series">Series</option>
          <option value="minimal">Minimal</option>
        </select>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-2">
          Product Images *
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            type="url"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            placeholder="Enter image URL"
          />
          <Button type="button" onClick={addImage} variant="secondary">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.images.map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={img}
                alt={`Product ${index + 1}`}
                className="w-20 h-20 object-cover rounded-lg border border-border"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-error text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {formData.images.length === 0 && (
          <p className="text-sm text-text-muted mt-2">No images added yet</p>
        )}
      </div>

      {/* Sizes */}
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-2">
          Available Sizes *
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            type="text"
            value={sizeInput}
            onChange={(e) => setSizeInput(e.target.value)}
            placeholder="Enter size (e.g., S, M, L, XL)"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
          />
          <Button type="button" onClick={addSize} variant="secondary">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.sizes.map((size) => (
            <span
              key={size}
              className="px-3 py-1 bg-background-hover border border-border rounded-lg text-text-primary flex items-center gap-2"
            >
              {size}
              <button
                type="button"
                onClick={() => removeSize(size)}
                className="text-error hover:text-error-dark"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        {formData.sizes.length === 0 && (
          <p className="text-sm text-text-muted mt-2">No sizes added yet</p>
        )}
      </div>

      {/* Drop Product */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_drop"
          checked={formData.is_drop}
          onChange={(e) => setFormData({ ...formData, is_drop: e.target.checked })}
          className="w-4 h-4"
        />
        <label htmlFor="is_drop" className="text-sm font-medium text-text-primary">
          This is a drop product
        </label>
      </div>

      {formData.is_drop && (
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Drop ID (Optional)
          </label>
          <Input
            type="text"
            value={formData.drop_id}
            onChange={(e) => setFormData({ ...formData, drop_id: e.target.value })}
            placeholder="Enter drop ID to link this product"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button type="button" onClick={onCancel} variant="secondary" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || formData.images.length === 0 || formData.sizes.length === 0}>
          {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
