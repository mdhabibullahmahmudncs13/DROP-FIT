import { Query } from 'appwrite';
import { databases, DATABASE_ID, PRODUCTS_COLLECTION_ID } from './client';
import { Product, Collection } from '@/types/product';

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
