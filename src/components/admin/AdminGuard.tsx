'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/hooks/useAdmin';
import { PageLoader } from '@/components/ui/Loading';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { isAdmin, loading } = useAdmin();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/auth/login');
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return <PageLoader />;
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
