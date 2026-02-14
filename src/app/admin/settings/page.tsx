'use client';

import { useState, useEffect } from 'react';
import { getDeliverySettings, updateDeliverySettings, DeliverySettings } from '@/lib/appwrite/settings';
import { invalidateDeliverySettingsCache } from '@/hooks/useDeliverySettings';
import { PageLoader } from '@/components/ui/Loading';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAdminToast } from '@/app/admin/layout';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<DeliverySettings>({
    baseCharge: 60,
    freeDeliveryThreshold: 2000,
    remoteAreaCharge: 40,
    remoteAreas: [],
  });
  const [remoteAreasText, setRemoteAreasText] = useState('');
  const toast = useAdminToast();

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      const data = await getDeliverySettings();
      setSettings(data);
      setRemoteAreasText(data.remoteAreas.join(', '));
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Parse remote areas from comma-separated text
      const remoteAreas = remoteAreasText
        .split(',')
        .map(area => area.trim().toLowerCase())
        .filter(area => area.length > 0);

      const updatedSettings: DeliverySettings = {
        ...settings,
        remoteAreas,
      };

      await updateDeliverySettings(updatedSettings);
      invalidateDeliverySettingsCache(); // Invalidate cache so changes take effect immediately
      toast.success('Settings saved successfully!');
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    const defaultSettings: DeliverySettings = {
      baseCharge: 60,
      freeDeliveryThreshold: 2000,
      remoteAreaCharge: 40,
      remoteAreas: ['sylhet', 'chittagong', 'khulna', 'rajshahi', 'rangpur', 'barisal', 'mymensingh'],
    };
    setSettings(defaultSettings);
    setRemoteAreasText(defaultSettings.remoteAreas.join(', '));
  }

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Delivery Settings</h1>
        <p className="text-text-muted">Configure delivery charges and policies for your store</p>
      </div>

      <div className="bg-background-surface rounded-lg border border-border p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Base Delivery Charge */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Base Delivery Charge (৳)
              </label>
              <Input
                type="number"
                min="0"
                step="1"
                value={settings.baseCharge}
                onChange={(e) => setSettings({ ...settings, baseCharge: parseFloat(e.target.value) || 0 })}
                placeholder="60"
                required
              />
              <p className="text-sm text-text-muted mt-1">
                Standard delivery charge for regular areas
              </p>
            </div>

            {/* Free Delivery Threshold */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Free Delivery Threshold (৳)
              </label>
              <Input
                type="number"
                min="0"
                step="1"
                value={settings.freeDeliveryThreshold}
                onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: parseFloat(e.target.value) || 0 })}
                placeholder="2000"
                required
              />
              <p className="text-sm text-text-muted mt-1">
                Orders above this amount get free delivery
              </p>
            </div>

            {/* Remote Area Additional Charge */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Remote Area Additional Charge (৳)
              </label>
              <Input
                type="number"
                min="0"
                step="1"
                value={settings.remoteAreaCharge}
                onChange={(e) => setSettings({ ...settings, remoteAreaCharge: parseFloat(e.target.value) || 0 })}
                placeholder="40"
                required
              />
              <p className="text-sm text-text-muted mt-1">
                Additional charge for remote areas (added to base charge)
              </p>
            </div>

            {/* Remote Areas */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Remote Areas
              </label>
              <textarea
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                rows={3}
                value={remoteAreasText}
                onChange={(e) => setRemoteAreasText(e.target.value)}
                placeholder="sylhet, chittagong, khulna, rajshahi, rangpur, barisal, mymensingh"
              />
              <p className="text-sm text-text-muted mt-1">
                Enter city/area names separated by commas. These areas will have additional delivery charges.
              </p>
            </div>

            {/* Preview Calculation */}
            <div className="bg-background border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Preview Calculation</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Regular area delivery:</span>
                  <span className="font-medium text-text-primary">৳{settings.baseCharge}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Remote area delivery:</span>
                  <span className="font-medium text-text-primary">
                    ৳{settings.baseCharge + settings.remoteAreaCharge}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-text-muted">Free delivery on orders above:</span>
                  <span className="font-medium text-primary">৳{settings.freeDeliveryThreshold}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                disabled={saving}
              >
                Reset to Default
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Help Section */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
          💡 How it works
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Customers in regular areas pay the base delivery charge</li>
          <li>• Customers in remote areas pay base charge + remote area charge</li>
          <li>• Orders above the free delivery threshold get free shipping</li>
          <li>• City matching is case-insensitive and checks if the delivery city contains any remote area name</li>
        </ul>
      </div>
    </div>
  );
}
