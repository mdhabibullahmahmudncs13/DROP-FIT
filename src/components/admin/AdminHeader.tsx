'use client';

import { useAuth } from '@/hooks/useAuth';

export default function AdminHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-background-surface border-b border-border px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
          <p className="text-sm text-text-secondary">Manage your store</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-text-primary">{user?.name}</p>
            <p className="text-xs text-text-muted">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-background-hover text-text-primary rounded-lg hover:bg-background-card transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
