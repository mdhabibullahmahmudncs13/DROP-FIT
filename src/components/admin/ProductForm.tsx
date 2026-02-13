'use client';

import { useState, FormEvent } from 'react';
import { Product, Collection } from '@/types/product';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { uploadProductImage } from '@/lib/appwrite/storage';

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
  const [uploadingImage, setUploadingImage] = useState(false);
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
  const [uploadError, setUploadError] = useState('');

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setUploadError('');

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} exceeds 5MB limit`);
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image`);
        }

        const imageUrl = await uploadProductImage(file);
        return imageUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData({ 
        ...formData, 
        images: [...formData.images, ...uploadedUrls] 
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload images');
    } finally {
      setUploadingImage(false);
      // Reset input
      e.target.value = '';
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
    if (!sizeInput.trim()) return;

    // Split by comma, space, or both and clean up
    const sizesToAdd = sizeInput
      .split(/[,\s]+/)
      .map(s => s.trim().toUpperCase())
      .filter(s => s.length > 0 && !formData.sizes.includes(s));

    if (sizesToAdd.length > 0) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, ...sizesToAdd],
      });
      setSizeInput('');
    } else if (sizeInput.trim()) {
      // If no new sizes to add (all duplicates), just clear input
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
          className="w-full px-4 py-3 bg-background-card border border-border rounded-lg focus:outline-none focus:border-primary text-text-primary resize-vertical"
          rows={4}
          required
          maxLength={1000}
        />
        <p className="text-xs text-text-muted mt-1">
          {formData.description.length}/1000 characters
        </p>
      </div>

      {/* Price and Stock */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Price (₹) *
          </label>
          <Input
            type="number"
            value={formData.price || ''}
            onChange={(e) => {
              const value = e.target.value;
              // Remove leading zeros and convert to number
              const numValue = value === '' ? 0 : parseInt(value.replace(/^0+/, '') || '0', 10);
              setFormData({ ...formData, price: numValue });
            }}
            onBlur={(e) => {
              // Ensure we have a valid number on blur
              const numValue = parseInt(e.target.value) || 0;
              setFormData({ ...formData, price: numValue });
            }}
            placeholder="0"
            min="0"
            step="1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Stock *
          </label>
          <Input
            type="number"
            value={formData.stock || ''}
            onChange={(e) => {
              const value = e.target.value;
              const numValue = value === '' ? 0 : parseInt(value.replace(/^0+/, '') || '0', 10);
              setFormData({ ...formData, stock: numValue });
            }}
            onBlur={(e) => {
              const numValue = parseInt(e.target.value) || 0;
              setFormData({ ...formData, stock: numValue });
            }}
            placeholder="0"
            min="0"
            step="1"
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
        
        {/* File Upload */}
        <div className="mb-3">
          <label className="block w-full">
            <div className={`flex items-center justify-center gap-2 px-4 py-3 bg-background-card border-2 border-dashed ${uploadingImage ? 'border-primary' : 'border-border'} rounded-lg cursor-pointer hover:border-primary transition-colors`}>
              <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-text-secondary font-medium">
                {uploadingImage ? 'Uploading...' : 'Click to upload images'}
              </span>
              <span className="text-xs text-text-muted">(Max 5MB each)</span>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              disabled={uploadingImage}
              className="hidden"
            />
          </label>
          {uploadError && (
            <p className="text-sm text-error mt-2">{uploadError}</p>
          )}
        </div>

        {/* URL Input (Optional) */}
        <div className="flex gap-2 mb-3">
          <Input
            type="url"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            placeholder="Or enter image URL"
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
          <div className="bg-error bg-opacity-10 border border-error rounded-lg p-2 mt-2">
            <p className="text-sm text-error font-medium">
              ⚠️ Please upload at least one product image
            </p>
          </div>
        )}
        {formData.images.length > 0 && (
          <p className="text-sm text-success mt-2">
            ✓ {formData.images.length} image{formData.images.length > 1 ? 's' : ''} uploaded
          </p>
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
            onChange={(e) => setSizeInput(e.target.value.toUpperCase())}
            placeholder="Enter size (e.g., S, M, L, XL) and press Enter"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSize();
              }
            }}
          />
          <Button 
            type="button" 
            onClick={addSize} 
            variant="secondary"
            disabled={!sizeInput.trim()}
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
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
          <div className="bg-error bg-opacity-10 border border-error rounded-lg p-2">
            <p className="text-sm text-error font-medium">
              ⚠️ Please add at least one size by clicking the "Add" button or pressing Enter
            </p>
          </div>
        )}
        {formData.sizes.length > 0 && (
          <p className="text-sm text-success">
            ✓ {formData.sizes.length} size{formData.sizes.length > 1 ? 's' : ''} added
          </p>
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
      <div className="pt-4 border-t border-border">
        {/* Validation Summary */}
        {(formData.images.length === 0 || formData.sizes.length === 0) && (
          <div className="bg-warning bg-opacity-10 border border-warning rounded-lg p-3 mb-4">
            <p className="text-sm font-semibold text-warning mb-2">
              Cannot create product - Missing required fields:
            </p>
            <ul className="text-sm text-warning space-y-1 ml-4">
              {formData.images.length === 0 && (
                <li>• Upload at least one product image</li>
              )}
              {formData.sizes.length === 0 && (
                <li>• Add at least one available size (click "Add" button after typing)</li>
              )}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" onClick={onCancel} variant="secondary" disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading || formData.images.length === 0 || formData.sizes.length === 0}
            title={
              formData.images.length === 0 || formData.sizes.length === 0
                ? 'Please add images and sizes before submitting'
                : ''
            }
          >
            {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </div>
    </form>
  );
}
