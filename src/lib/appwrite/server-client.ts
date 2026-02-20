import { Client, Databases } from 'node-appwrite';

// Server-side Appwrite client with API key for privileged operations
const serverClient = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

export const serverDatabases = new Databases(serverClient);

export { serverClient };
