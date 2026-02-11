'use client';

import { useAuth } from './useAuth';

export function useAdmin() {
  const { user, loading } = useAuth();
  const isAdmin = user?.role === 'admin';

  return {
    isAdmin,
    loading,
    user,
  };
}
