import { ID } from 'appwrite';
import { databases, DATABASE_ID, NOTIFY_COLLECTION_ID } from './client';

export async function addToNotifyList(email: string, name?: string): Promise<void> {
  try {
    await databases.createDocument(
      DATABASE_ID,
      NOTIFY_COLLECTION_ID,
      ID.unique(),
      {
        email,
        name: name || '',
        created_at: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error('Error adding to notify list:', error);
    throw error;
  }
}

export async function getAllNotifyEmails(): Promise<string[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      NOTIFY_COLLECTION_ID
    );
    return response.documents.map((doc) => doc.email as string);
  } catch (error) {
    console.error('Error fetching notify emails:', error);
    throw error;
  }
}
