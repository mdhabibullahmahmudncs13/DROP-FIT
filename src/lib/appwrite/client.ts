import { Client, Account, Databases, Storage } from 'appwrite';

// Validate required environment variables
const requiredEnvVars = {
  NEXT_PUBLIC_APPWRITE_ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  NEXT_PUBLIC_APPWRITE_PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  NEXT_PUBLIC_DATABASE_ID: process.env.NEXT_PUBLIC_DATABASE_ID,
  NEXT_PUBLIC_PRODUCTS_COLLECTION_ID: process.env.NEXT_PUBLIC_PRODUCTS_COLLECTION_ID,
  NEXT_PUBLIC_USERS_COLLECTION_ID: process.env.NEXT_PUBLIC_USERS_COLLECTION_ID,
  NEXT_PUBLIC_ORDERS_COLLECTION_ID: process.env.NEXT_PUBLIC_ORDERS_COLLECTION_ID,
  NEXT_PUBLIC_DROPS_COLLECTION_ID: process.env.NEXT_PUBLIC_DROPS_COLLECTION_ID,
  NEXT_PUBLIC_NOTIFY_COLLECTION_ID: process.env.NEXT_PUBLIC_NOTIFY_COLLECTION_ID,
  NEXT_PUBLIC_COMMUNITY_COLLECTION_ID: process.env.NEXT_PUBLIC_COMMUNITY_COLLECTION_ID,
  NEXT_PUBLIC_SETTINGS_COLLECTION_ID: process.env.NEXT_PUBLIC_SETTINGS_COLLECTION_ID,
  NEXT_PUBLIC_STORAGE_BUCKET_ID: process.env.NEXT_PUBLIC_STORAGE_BUCKET_ID,
};

const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables:\n${missingEnvVars.join('\n')}\n\nPlease check your .env.local file or Vercel environment variables.`
  );
}

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
export const SETTINGS_COLLECTION_ID = process.env.NEXT_PUBLIC_SETTINGS_COLLECTION_ID!;
export const STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_STORAGE_BUCKET_ID!
