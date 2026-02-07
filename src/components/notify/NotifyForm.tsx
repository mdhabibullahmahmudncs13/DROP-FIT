'use client';

import { useState } from 'react';
import { addToNotifyList } from '@/lib/appwrite/notify';
import { validateEmail } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function NotifyForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !validateEmail(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    try {
      setLoading(true);
      await addToNotifyList(email, name);
      
      showToast('You\'re on the list! We\'ll notify you about new drops.', 'success');
      setEmail('');
      setName('');
    } catch (error) {
      console.error('Error signing up for notifications:', error);
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-background-surface rounded-card border border-border p-8">
      <h2 className="text-2xl font-bold text-text-primary mb-2">
        Never Miss a Drop
      </h2>
      <p className="text-text-secondary mb-6">
        Get notified when new limited-edition drops go live. Be the first to cop the freshest fits.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Your Name (Optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" size="lg" fullWidth disabled={loading}>
          {loading ? 'Signing Up...' : 'Notify Me'}
        </Button>
      </form>
    </div>
  );
}
