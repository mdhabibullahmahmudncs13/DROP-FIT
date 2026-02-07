'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/ui/Loading';

export default function AccountPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/account');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <PageLoader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-text-primary mb-2">My Account</h1>
      <p className="text-text-secondary mb-8">Welcome back, {user.name}!</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/account/orders"
          className="bg-background-surface rounded-card border border-border p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all group"
        >
          <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
            My Orders
          </h2>
          <p className="text-text-secondary">
            View your order history and track shipments
          </p>
        </Link>

        <Link
          href="/account/profile"
          className="bg-background-surface rounded-card border border-border p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all group"
        >
          <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
            My Profile
          </h2>
          <p className="text-text-secondary">
            Update your personal information and addresses
          </p>
        </Link>

        <Link
          href="/shop"
          className="bg-background-surface rounded-card border border-border p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all group"
        >
          <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
            Continue Shopping
          </h2>
          <p className="text-text-secondary">
            Browse our latest drops and collections
          </p>
        </Link>
      </div>
    </div>
  );
}
