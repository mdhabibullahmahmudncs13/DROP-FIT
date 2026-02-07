import { ID, Query } from 'appwrite';
import { databases, DATABASE_ID, COMMUNITY_COLLECTION_ID } from './client';
import { CommunityPost } from '@/types/drop';

export async function createCommunityPost(
  userName: string,
  imageUrl: string,
  caption?: string
): Promise<CommunityPost> {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COMMUNITY_COLLECTION_ID,
      ID.unique(),
      {
        user_name: userName,
        image_url: imageUrl,
        caption: caption || '',
        created_at: new Date().toISOString(),
      }
    );
    return response as unknown as CommunityPost;
  } catch (error) {
    console.error('Error creating community post:', error);
    throw error;
  }
}

export async function getAllCommunityPosts(): Promise<CommunityPost[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COMMUNITY_COLLECTION_ID,
      [Query.orderDesc('created_at'), Query.limit(100)]
    );
    return response.documents as unknown as CommunityPost[];
  } catch (error) {
    console.error('Error fetching community posts:', error);
    throw error;
  }
}

export async function getLatestCommunityPosts(limit: number = 3): Promise<CommunityPost[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COMMUNITY_COLLECTION_ID,
      [Query.orderDesc('created_at'), Query.limit(limit)]
    );
    return response.documents as unknown as CommunityPost[];
  } catch (error) {
    console.error('Error fetching latest community posts:', error);
    throw error;
  }
}
