'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-background-surface rounded-card border border-border p-12">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-success bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-success"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            Order Confirmed! 🎉
          </h1>
          
          <p className="text-lg text-text-secondary mb-2">
            Thank you for your order!
          </p>
          
          {orderId && (
            <p className="text-text-secondary mb-6">
              Order ID: <span className="font-mono text-primary">{orderId}</span>
            </p>
          )}

          <div className="bg-primary bg-opacity-10 border border-primary rounded-lg p-6 mb-8">
            <p className="text-text-primary">
              💵 <strong>Cash on Delivery (COD)</strong>
            </p>
            <p className="text-sm text-text-secondary mt-2">
              You will pay when your order is delivered to your doorstep.
            </p>
          </div>

          <p className="text-text-secondary mb-8">
            We've sent a confirmation email with your order details. 
            You can track your order status from your account.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {orderId && (
              <Link href={`/track-order/${orderId}`}>
                <Button size="lg">Track My Order</Button>
              </Link>
            )}
            <Link href="/shop">
              <Button variant="secondary" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
