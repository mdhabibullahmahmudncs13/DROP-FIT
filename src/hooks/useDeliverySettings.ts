import { useState, useEffect } from 'react';
import { getDeliverySettings, DeliverySettings } from '@/lib/appwrite/settings';

const defaultSettings: DeliverySettings = {
  baseCharge: 60,
  freeDeliveryThreshold: 2000,
  remoteAreaCharge: 40,
  remoteAreas: ['sylhet', 'chittagong', 'khulna', 'rajshahi', 'rangpur', 'barisal', 'mymensingh'],
};

// Cache settings to avoid frequent API calls
let cachedSettings: DeliverySettings | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useDeliverySettings() {
  const [settings, setSettings] = useState<DeliverySettings>(cachedSettings || defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        // Use cache if it's still valid
        const now = Date.now();
        if (cachedSettings && (now - cacheTimestamp) < CACHE_DURATION) {
          setSettings(cachedSettings);
          setLoading(false);
          return;
        }

        const data = await getDeliverySettings();
        cachedSettings = data;
        cacheTimestamp = now;
        setSettings(data);
      } catch (err) {
        console.error('Error fetching delivery settings:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch settings'));
        // Use default settings on error
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  return { settings, loading, error };
}

// Function to invalidate the cache (useful after updating settings)
export function invalidateDeliverySettingsCache() {
  cachedSettings = null;
  cacheTimestamp = 0;
}
