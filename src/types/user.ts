export interface User {
  $id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  created_at: string;
}

export interface AuthUser {
  $id: string;
  name: string;
  email: string;
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
