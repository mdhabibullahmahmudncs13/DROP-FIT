import { ID } from 'appwrite';
import { account, databases, DATABASE_ID, USERS_COLLECTION_ID } from './client';
import { AuthUser, LoginData, SignupData } from '@/types/user';

export async function signup(data: SignupData): Promise<AuthUser> {
  try {
    // Create Appwrite auth account
    const response = await account.create(
      ID.unique(),
      data.email,
      data.password,
      data.name
    );

    // Create session
    await account.createEmailPasswordSession(data.email, data.password);

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
      }
    );

    return {
      $id: response.$id,
      name: response.name,
      email: response.email,
    };
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}

export async function login(data: LoginData): Promise<AuthUser> {
  try {
    const session = await account.createEmailPasswordSession(data.email, data.password);
    const user = await account.get();

    return {
      $id: user.$id,
      name: user.name,
      email: user.email,
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
    return {
      $id: user.$id,
      name: user.name,
      email: user.email,
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
