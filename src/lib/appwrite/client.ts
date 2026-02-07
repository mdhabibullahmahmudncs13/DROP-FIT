import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { client };

export const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
export const PRODUCTS_COLLECTION_ID = process.env.NEXT_PUBLIC_PRODUCTS_COLLECTION_ID!;
export const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_USERS_COLLECTION_ID!;
export const ORDERS_COLLECTION_ID = process.env.NEXT_PUBLIC_ORDERS_COLLECTION_ID!;
export const DROPS_COLLECTION_ID = process.env.NEXT_PUBLIC_DROPS_COLLECTION_ID!;
export const NOTIFY_COLLECTION_ID = process.env.NEXT_PUBLIC_NOTIFY_COLLECTION_ID!;
export const COMMUNITY_COLLECTION_ID = process.env.NEXT_PUBLIC_COMMUNITY_COLLECTION_ID!;
export const STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_STORAGE_BUCKET_ID!;
