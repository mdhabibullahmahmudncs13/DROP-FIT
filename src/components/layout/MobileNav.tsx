'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { href: string; label: string }[];
}

export default function MobileNav({ isOpen, onClose, navLinks }: MobileNavProps) {
  const { user, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Slide-out Menu */}
      <div
        className={cn(
          'fixed top-0 right-0 bottom-0 w-full max-w-sm bg-background-surface z-50 lg:hidden',
          'transform transition-transform duration-300 ease-in-out',
          'border-l border-border',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="text-xl font-bold text-primary">MENU</span>
            <button
              onClick={onClose}
              className="p-2 text-text-secondary hover:text-text-primary"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="block px-4 py-3 text-text-primary hover:bg-background-hover rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="border-t border-border my-4" />

            {user ? (
              <>
                <Link
                  href="/account/profile"
                  onClick={onClose}
                  className="block px-4 py-3 text-text-primary hover:bg-background-hover rounded-lg transition-colors"
                >
                  Profile
                </Link>
                <Link
                  href="/account/orders"
                  onClick={onClose}
                  className="block px-4 py-3 text-text-primary hover:bg-background-hover rounded-lg transition-colors"
                >
                  Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-error hover:bg-background-hover rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={onClose}
                  className="block px-4 py-3 text-text-primary hover:bg-background-hover rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={onClose}
                  className="block px-4 py-3 text-primary hover:bg-background-hover rounded-lg transition-colors font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-sm text-text-muted text-center">
              Drop Fit © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
