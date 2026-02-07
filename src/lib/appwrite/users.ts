import { databases, DATABASE_ID, USERS_COLLECTION_ID } from './client';
import { User } from '@/types/user';
import { Query } from 'appwrite';

export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('user_id', userId)]
    );
    
    if (response.documents.length === 0) {
      return null;
    }
    
    return response.documents[0] as unknown as User;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function updateUserProfile(
  userId: string,
  data: Partial<Omit<User, '$id' | 'email' | 'created_at'>>
): Promise<User> {
  try {
    // First, get the document ID by querying with user_id
    const response = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('user_id', userId)]
    );
    
    if (response.documents.length === 0) {
      throw new Error('User profile not found');
    }
    
    const documentId = response.documents[0].$id;
    
    // Update the document
    const updated = await databases.updateDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      documentId,
      data
    );
    return updated as unknown as User;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}
