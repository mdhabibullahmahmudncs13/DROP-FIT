'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function AdminHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-background-surface border-b border-border px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        {/* Mobile Logo */}
        <div className="lg:hidden">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">DROP FIT</span>
            <span className="text-xs text-text-muted">Admin</span>
          </Link>
        </div>
        
        {/* Desktop Title */}
        <div className="hidden lg:block">
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Admin Dashboard</h1>
          <p className="text-xs sm:text-sm text-text-secondary">Manage your store</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-text-primary">{user?.name}</p>
            <p className="text-xs text-text-muted">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-background-hover text-text-primary rounded-lg hover:bg-background-card transition-colors text-sm sm:text-base min-h-[44px]"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
