import { Query, ID } from 'appwrite';
import { databases, DATABASE_ID, PRODUCTS_COLLECTION_ID } from './client';
import { Product, Collection } from '@/types/product';

export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  collection: Collection;
  images: string[];
  sizes: string[];
  stock: number;
  is_drop?: boolean;
  drop_id?: string;
}

export async function createProduct(data: CreateProductData): Promise<Product> {
  try {
    // Validate required fields
    if (!data.title || !data.description || !data.price) {
      throw new Error('Title, description, and price are required');
    }

    if (!data.images || data.images.length === 0) {
      throw new Error('At least one image is required');
    }

    if (!data.sizes || data.sizes.length === 0) {
      throw new Error('At least one size is required');
    }

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const response = await databases.createDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      ID.unique(),
      {
        title: data.title,
        slug: slug,
        description: data.description,
        price: data.price,
        collection: data.collection,
        images: data.images,
        sizes: data.sizes,
        stock: data.stock,
        is_drop: data.is_drop || false,
        drop_id: data.drop_id || null,
      }
    );
    return response as unknown as Product;
  } catch (error: any) {
    console.error('Error creating product:', error);
    
    // Provide more specific error messages
    if (error.code === 401) {
      throw new Error('Unauthorized. Please check your Appwrite permissions.');
    } else if (error.code === 404) {
      throw new Error('Collection not found. Please verify your Appwrite setup.');
    } else if (error.message) {
      throw new Error(error.message);
    }
    
    throw new Error('Failed to create product. Please try again.');
  }
}

export async function updateProduct(productId: string, data: Partial<CreateProductData>): Promise<Product> {
  try {
    const updateData: any = { ...data };
    
    // Update slug if title changed
    if (data.title) {
      updateData.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const response = await databases.updateDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      productId,
      updateData
    );
    return response as unknown as Product;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      productId
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      [Query.limit(100)]
    );
    return response.documents as unknown as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await databases.getDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      id
    );
    return response as unknown as Product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function getProductsByCollection(collection: Collection): Promise<Product[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      [
        Query.equal('collection', collection),
        Query.limit(100),
      ]
    );
    return response.documents as unknown as Product[];
  } catch (error) {
    console.error('Error fetching products by collection:', error);
    throw error;
  }
}

export async function getDropProducts(): Promise<Product[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      [
        Query.equal('is_drop', true),
        Query.limit(50),
      ]
    );
    return response.documents as unknown as Product[];
  } catch (error) {
    console.error('Error fetching drop products:', error);
    throw error;
  }
}

export async function updateProductStock(productId: string, newStock: number): Promise<void> {
  try {
    await databases.updateDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      productId,
      { stock: newStock }
    );
  } catch (error) {
    console.error('Error updating product stock:', error);
    throw error;
  }
}
