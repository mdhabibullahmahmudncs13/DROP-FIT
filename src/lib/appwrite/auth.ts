import { ID, Query } from 'appwrite';
import { account, databases, DATABASE_ID, USERS_COLLECTION_ID } from './client';
import { AuthUser, LoginData, SignupData } from '@/types/user';

export async function signup(data: SignupData): Promise<AuthUser> {
  try {
    // Delete any existing session first
    try {
      await account.deleteSession('current');
    } catch {
      // No active session, continue
    }

    // Create Appwrite auth account
    const response = await account.create(
      ID.unique(),
      data.email,
      data.password,
      data.name
    );

    // Create session
    await account.createEmailPasswordSession(data.email, data.password);

    // Determine if user should be admin (you can change this logic)
    const isAdmin = data.email === 'admin@dropfit.com'; // Change to your admin email

    // Create user document in users collection
    await databases.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      response.$id,
      {
        user_id: response.$id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address || '',
        city: data.city || '',
        postalCode: '',
        role: isAdmin ? 'admin' : 'user',
      }
    );

    return {
      $id: response.$id,
      name: response.name,
      email: response.email,
      role: isAdmin ? 'admin' : 'user',
    };
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}

export async function login(data: LoginData): Promise<AuthUser> {
  try {
    // Delete any existing session first
    try {
      await account.deleteSession('current');
    } catch {
      // No active session, continue
    }

    const session = await account.createEmailPasswordSession(data.email, data.password);
    const user = await account.get();

    // Get user role from database
    const userDocs = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('user_id', user.$id)]
    );
    const role = userDocs.documents[0]?.role || 'user';

    return {
      $id: user.$id,
      name: user.name,
      email: user.email,
      role: role as 'user' | 'admin',
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function logout(): Promise<void> {
  try {
    await account.deleteSession('current');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const user = await account.get();
    
    // Get user role from database
    const userDocs = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('user_id', user.$id)]
    );
    const role = userDocs.documents[0]?.role || 'user';
    
    return {
      $id: user.$id,
      name: user.name,
      email: user.email,
      role: role as 'user' | 'admin',
    };
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  try {
    return await account.getSession('current');
  } catch (error) {
    return null;
  }
}
