'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { getUserProfile } from '@/lib/appwrite/users';
import { useToast } from '@/components/ui/Toast';
import { ShippingInfo } from '@/types/order';
import { PageLoader } from '@/components/ui/Loading';
import ProgressBar from '@/components/checkout/ProgressBar';
import ShippingForm from '@/components/checkout/ShippingForm';
import ReviewOrder from '@/components/checkout/ReviewOrder';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, total, clearCart } = useCart();
  const { showToast } = useToast();

  const [step, setStep] = useState(0);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<Partial<ShippingInfo>>({});

  const steps = ['Shipping', 'Review', 'Confirmed'];

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth/login?redirect=/checkout');
        return;
      }

      if (items.length === 0) {
        router.push('/cart');
        return;
      }

      loadUserData();
    }
  }, [authLoading, user, items]);

  async function loadUserData() {
    if (!user) return;

    try {
      const profile = await getUserProfile(user.$id);
      if (profile) {
        setInitialData({
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  async function handlePlaceOrder() {
    if (!shippingInfo || !user) return;

    try {
      setLoading(true);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            product_id: item.product_id,
            title: item.title,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
          })),
          shipping: shippingInfo,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create order');
      }

      const { order } = await response.json();
      
      clearCart();
      router.push(`/order-confirmation?orderId=${order.$id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      showToast(error instanceof Error ? error.message : 'Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || !user || items.length === 0) {
    return <PageLoader />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-text-primary mb-2">Checkout</h1>
      <p className="text-text-secondary mb-8">Complete your order</p>

      <ProgressBar currentStep={step} steps={steps} />

      <div className="bg-background-surface rounded-card border border-border p-6 lg:p-8">
        {step === 0 && (
          <ShippingForm
            initialData={initialData}
            onSubmit={(data) => {
              setShippingInfo(data);
              setStep(1);
            }}
          />
        )}

        {step === 1 && shippingInfo && (
          <ReviewOrder
            items={items}
            shipping={shippingInfo}
            total={total}
            onBack={() => setStep(0)}
            onConfirm={handlePlaceOrder}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
