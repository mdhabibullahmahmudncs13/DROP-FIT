'use client';

import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import ToastContainer from '@/components/ui/ToastContainer';
import { useToast } from '@/hooks/useToast';
import { createContext, useContext } from 'react';

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useAdminToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useAdminToast must be used within AdminLayout');
  }
  return context;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const toast = useToast();

  return (
    <AdminGuard>
      <ToastContext.Provider value={toast}>
        <div className="flex min-h-screen bg-background">
          <AdminSidebar />
          <div className="flex-1">
            <AdminHeader />
            <main className="p-8">{children}</main>
          </div>
        </div>
        <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      </ToastContext.Provider>
    </AdminGuard>
  );
}
