import { Query } from 'appwrite';
import { databases, DATABASE_ID, DROPS_COLLECTION_ID } from './client';
import { Drop } from '@/types/drop';

export async function getAllDrops(): Promise<Drop[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      DROPS_COLLECTION_ID,
      [Query.orderDesc('launch_date'), Query.limit(50)]
    );
    return response.documents as unknown as Drop[];
  } catch (error) {
    console.error('Error fetching drops:', error);
    throw error;
  }
}

export async function getActiveDrops(): Promise<Drop[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      DROPS_COLLECTION_ID,
      [Query.equal('status', 'active'), Query.orderDesc('launch_date')]
    );
    return response.documents as unknown as Drop[];
  } catch (error) {
    console.error('Error fetching active drops:', error);
    throw error;
  }
}

export async function getUpcomingDrops(): Promise<Drop[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      DROPS_COLLECTION_ID,
      [
        Query.equal('status', 'upcoming'),
        Query.orderAsc('launch_date'),
      ]
    );
    return response.documents as unknown as Drop[];
  } catch (error) {
    console.error('Error fetching upcoming drops:', error);
    throw error;
  }
}

export async function getDropById(dropId: string): Promise<Drop | null> {
  try {
    const response = await databases.getDocument(
      DATABASE_ID,
      DROPS_COLLECTION_ID,
      dropId
    );
    return response as unknown as Drop;
  } catch (error) {
    console.error('Error fetching drop:', error);
    return null;
  }
}
