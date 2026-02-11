export interface User {
  $id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  role: 'user' | 'admin';
}

export interface AuthUser {
  $id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  city: string;
}

export interface LoginData {
  email: string;
  password: string;
}
