'use client';

import { useState } from 'react';
import { ShippingInfo } from '@/types/order';
import { validatePhone } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface ShippingFormProps {
  onSubmit: (data: ShippingInfo) => void;
  initialData?: Partial<ShippingInfo>;
}

export default function ShippingForm({ onSubmit, initialData }: ShippingFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ShippingInfo>({
    name: initialData?.name || user?.name || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    notes: initialData?.notes || '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingInfo, string>>>({});

  function handleChange(field: keyof ShippingInfo, value: string) {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof ShippingInfo, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="01XXXXXXXXX"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          error={errors.phone}
          required
        />
      </div>

      <Input
        label="Delivery Address"
        type="text"
        placeholder="House/Flat, Street, Area"
        value={formData.address}
        onChange={(e) => handleChange('address', e.target.value)}
        error={errors.address}
        required
      />

      <Input
        label="City"
        type="text"
        value={formData.city}
        onChange={(e) => handleChange('city', e.target.value)}
        error={errors.city}
        required
      />

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Order Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={4}
          placeholder="Any special delivery instructions?"
          className="w-full px-4 py-3 bg-background-surface text-text-primary
            border border-border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            placeholder:text-text-muted resize-none"
        />
      </div>

      <Button type="submit" size="lg" fullWidth>
        Continue to Review
      </Button>
    </form>
  );
}
