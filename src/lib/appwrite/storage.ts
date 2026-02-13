import { ID } from 'appwrite';
import { storage, STORAGE_BUCKET_ID } from './client';

/**
 * Upload a product image to Appwrite Storage
 * @param file - The image file to upload
 * @returns The publicly accessible URL of the uploaded image
 */
export async function uploadProductImage(file: File): Promise<string> {
  try {
    // Upload file to Appwrite Storage
    const response = await storage.createFile(
      STORAGE_BUCKET_ID,
      ID.unique(),
      file
    );

    // Generate the public URL for the uploaded file
    const fileUrl = storage.getFileView(STORAGE_BUCKET_ID, response.$id);

    return fileUrl.toString();
  } catch (error) {
    console.error('Error uploading to Appwrite Storage:', error);
    throw new Error('Failed to upload image to storage');
  }
}

/**
 * Delete a file from Appwrite Storage
 * @param fileId - The ID of the file to delete
 */
export async function deleteProductImage(fileId: string): Promise<void> {
  try {
    await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
  } catch (error) {
    console.error('Error deleting from Appwrite Storage:', error);
    throw new Error('Failed to delete image from storage');
  }
}

/**
 * Extract file ID from Appwrite Storage URL
 * @param url - The full storage URL
 * @returns The file ID or null if not an Appwrite Storage URL
 */
export function extractFileIdFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const fileIdIndex = pathParts.findIndex(part => part === 'files') + 1;
    
    if (fileIdIndex > 0 && fileIdIndex < pathParts.length) {
      return pathParts[fileIdIndex];
    }
    
    return null;
  } catch {
    return null;
  }
}
